import * as javaParser from "java-parser"
const { parse, BaseJavaCstVisitorWithDefaults, MethodDeclarationCtx, } = javaParser

/**
 * @typedef FunctionComment
 * @type {object}
 * @property {string} type -  The type of the comment, the value would be "CommentLine" or "CommentBlock". 
 * @property {string} text -  The text of the comment. 
 * @property {number} startLine -  The start line of the comment. 
 * @property {number} endLine - The end line of the comment.

 */

/**
 * @typedef FunctionLocation
 * @type {object}
 * @property {number} startLine -  The start line of the function. 
 * @property {number} endLine - The end line of the function.
 */

/**
 * @typedef {import('../index.d.ts').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * This is the visitor class to traverse the Java Concrete Syntax Tree. 
 */
class MethodVisitor extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super()
        this.validateVisitor()
        /**
         * @type {string[]} 
         */
        this.methodNames = []
        /**
         * @type {FunctionLocation[]} 
         */
        this.methodLocations = []
    }

    /**
     * To implement the methodDeclaration method.
     * @param {MethodDeclarationCtx} ctx 
     */
    methodDeclaration(ctx) {
        const { methodHeader: [methodHeader], methodBody: [methodBody] } = ctx
        if (methodHeader && methodBody) {
            this.methodNames.push(methodHeader.children.methodDeclarator[0].children.Identifier[0].image || '[Anonymous]')
            /**
             * @type {number} 
             */
            const startLine = methodHeader.location?.startLine || 0
            /**
             * @type {number} 
             */
            const endLine = methodBody.location?.endLine || 0
            this.methodLocations.push({ startLine: startLine, endLine: endLine })
        }
    }

}

/**
 * The counter of the java.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
export default function (fileContent, minLineCount = 0, maxLineCount = Infinity, excludeFunctionNames = []) {
    const cst = parse(fileContent)
    /**
     * @type {string[]} 
     */
    const lines = fileContent.split('\n')
    const visitor = new MethodVisitor()
    /** 
     * @type {FunctionLineCountsResult[]}
     */
    let functionLineCountsResult = []

    visitor.visit(cst)

    if (visitor.methodNames) {
        visitor.methodNames.forEach((name, index) => {
            const { startLine, endLine } = visitor.methodLocations[index]
            const methodCommentList = getFunctionCommentList(startLine, lines.filter((line, index) => index >= startLine - 1 && index <= endLine - 1))
            countLines(startLine, endLine, name, methodCommentList)
        })
    }

    /**
     * This is the function to collect comments in function block.
     * @param {number} startLine The startLine of the function.
     * @param {string[]} lines The content of the function split by \n.
     * @returns {FunctionComment[]} The comment list of the function.
    */
    function getFunctionCommentList(startLine, lines) {
        // return the splitted content to be one with linebreaks.
        const content = "".concat(lines.reduce((linesWithLineBreak, line) => linesWithLineBreak.concat('\n', line)))
        const lineCommentPattern = /\/\/[^\n]*/g
        const blockCommentPattern = /\/\*([^*]|\*(?!\/))*\*\//g
        /**
         * @type {FunctionComment[]} 
         */
        const comments = []
        /**
         * @type {RegExpExecArray | null}
         */
        let match

        while ((match = lineCommentPattern.exec(content)) !== null) {
            /**
             * @type {FunctionComment} 
             */
            const comment = {
                type: 'CommentLine',
                text: match[0],
                startLine: getLineNumber(content, match.index) + startLine - 1,
                endLine: getLineNumber(content, match.index + match[0].length) + startLine - 1
            }
            comments.push(comment)
        }
        while ((match = blockCommentPattern.exec(content)) !== null) {
            /**
             * @type {FunctionComment} 
             */
            const comment = {
                type: 'CommentBlock',
                text: match[0],
                startLine: getLineNumber(content, match.index) + startLine - 1,
                endLine: getLineNumber(content, match.index + match[0].length) + startLine - 1
            }
            comments.push(comment)
        }

        /**
         * Get the line number of the certain comment.
         * @param {string} text The content of the function.
         * @param {index} index The 0-based index of the match in the string.
         * @returns {number} The line number of the certain comment.
         */
        function getLineNumber(text, index) {
            const lines = text.substring(0, index).split('\n')
            return lines.length
        }

        return comments
    }

    /**
     * This is the function to count the line and push the result to the results list. 
     * @param {number} startLine The startLine of the function.
     * @param {number} endLine The endLine of the function.
     * @param {string} functionName The name of the function.
     * @param {FunctionComment[]} functionComments The comments list of the function.
     */
    function countLines(startLine, endLine, functionName, functionComments) {
        if (excludeFunctionNames.some(regex => regex.test(functionName))) return
        let validLineCount = 0
        let commentLineCount = 0
        let blankLineCount = 0

        // to cumulate the lines count
        for (let i = startLine - 1; i < endLine; i++) {
            const lineStr = lines[i].trim()
            if (lineStr !== '') {
                validLineCount = validLineCount + 1
            }
            else {
                const lineInBlockCommentFlg = isLineInBlockComment(i + 1, functionComments)
                if (!lineInBlockCommentFlg) blankLineCount = blankLineCount + 1
                if (lineInBlockCommentFlg) validLineCount = validLineCount + 1
            }
        }

        // to subtract the lines count of comments from the count result above
        functionComments.forEach(comment => {
            const { startLine, endLine, text } = comment
            if (startLine !== endLine) {
                const commentLine = endLine - startLine + 1
                validLineCount = validLineCount - commentLine
                commentLineCount = commentLineCount + commentLine
            }
            else if (text.trimEnd() === lines[startLine - 1].trim()) { // Fix: 'trimEnd' is to fix the bug that '// comment ' is not correctly counted as comment.
                validLineCount = validLineCount - 1
                commentLineCount = commentLineCount + 1
            }
        })

        // to push the result to the results list
        if (minLineCount <= validLineCount && validLineCount <= maxLineCount) {
            functionLineCountsResult.push({
                functionName: functionName,
                validLineCount: validLineCount,
                startLine: startLine,
                endLine: endLine,
                commentLineCount: commentLineCount,
                blankLineCount: blankLineCount,
            })
        }

    }

    /**
     * This is the function to get boolean whether the given line is in a certain block comment.
     * @param {number} lineNumber The number of the line.
     * @param {FunctionComment[]} functionComments The comments list of the function.
     * @returns {boolean}
     */
    function isLineInBlockComment(lineNumber, functionComments) {
        return functionComments.some(comment => comment.type === 'CommentBlock' && lineNumber > comment.startLine && lineNumber < comment.endLine)
    }


    return functionLineCountsResult
}

