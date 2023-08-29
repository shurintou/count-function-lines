import fs from 'fs'
import * as parser from '@babel/parser'
import babelTraverse from '@babel/traverse'
import config from '../config.js'
const { countComment, countBlank, minLineCount, maxLineCount, excludeFunctionNames } = config
const traverse = babelTraverse.default

/**
 * @typedef {import('./funcLinesCountHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * @typedef LineCountResult
 * @type {object}
 * @property {number} lineCountIncrement -  The increment of function line count for a certain line. 
 * @property {number} commentLineCountIncrement - The increment of comment line count for a certain line.
 * @property {number} blankLineCountIncrement - The increment of blank line count for a certain line.
 */

/**
 * The counter handler of the javascript.
 * @param {string} filePath The path of the file to be counted.
 * @returns {FunctionLineCountsResult[]} 
 */
export const jsFuncCounterHandler = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return jsFuncCounter(fileContent)
}

/**
 * The counter of the javascript.
 * @param {string} fileContent The content of the file.
 * @param {number} [offset = 0] The offset of the content's location compared to the start of the file.
 * @returns {FunctionLineCountsResult[]} 
 */
export const jsFuncCounter = function (fileContent, offset = 0) {
    /** 
     * @type {boolean}  
     */
    const isModule = fileContent.includes('import') || fileContent.includes('export')
    /**
     * @type {string[]} 
     */
    const lines = fileContent.split('\n')
    /** 
     * @type {FunctionLineCountsResult[]}
     */
    const functionLineCountsResult = []

    const ast = parser.parse(fileContent, {
        sourceType: isModule ? 'module' : 'script',
        tokens: true,
        ranges: true,
        attachComment: true,
        plugins: ['jsx', 'typescript'],
    })

    let { comments } = ast

    traverse(ast, {
        enter(path) {
            if (path.isFunctionDeclaration()) {
                // count the lines of funcion which is defined by a FunctionDeclaration way
                const functionName = path.node.id?.name || '[Anonymous]'
                const { start, end } = path.node.loc
                countLines(start.line, end.line, functionName)
            } else if (path.isVariableDeclaration()) {
                // count the lines of funcion which is defined by a VariableDeclaration way
                const declaration = path.node.declarations[0]
                if (
                    declaration &&
                    (declaration.init?.type === 'FunctionExpression' ||
                        declaration.init?.type === 'ArrowFunctionExpression')
                ) {
                    const functionName = declaration.id.name
                    const { start, end } = declaration.init?.body.loc
                    countLines(start.line, end.line, functionName)
                }
            } else if (path.isProperty()) {
                // count the lines of function as an property of a certain Object
                const value = path.node.value
                if (
                    value &&
                    (value.type === 'FunctionExpression' ||
                        value.type === 'ArrowFunctionExpression')
                ) {
                    const functionName = path.node.key.name || path.node.key.value || path.node.value.id?.name
                    const { start, end } = value.body.loc
                    countLines(start.line, end.line, functionName)
                }
            } else if (path.isObjectMethod()) {
                // count the lines of function as an method of a certain Object
                const methodName = path.node.key.name
                const { start, end } = path.node.body.loc
                countLines(start.line, end.line, methodName)
            }
        },
    })

    /**
     * This is the function to count the line and push the result to the results list. 
     * @param {number} startLine The startLine of the function.
     * @param {number} endLine The endLine of the function.
     * @param {string} functionName The name of the function.
     */
    function countLines(startLine, endLine, functionName) {
        if (excludeFunctionNames.some(regex => regex.test(functionName))) return
        let lineCount = 0
        let commentLineCount = 0
        let blankLineCount = 0
        for (let i = startLine - 1; i < endLine; i++) {
            const { lineCountIncrement, commentLineCountIncrement, blankLineCountIncrement } = getLineCount(i + 1)
            lineCount += lineCountIncrement
            commentLineCount += commentLineCountIncrement
            blankLineCount += blankLineCountIncrement
        }
        if (minLineCount <= lineCount && lineCount <= maxLineCount) {
            functionLineCountsResult.push({
                functionName: functionName,
                lineCount: lineCount,
                startLine: startLine + offset,
                endLine: endLine + offset,
                commentLineCount: commentLineCount,
                blankLineCount: blankLineCount,
            })
        }
    }

    /** 
     * This is the function that calculates a certain line count in consideration of comments and blank line.
     * @param {number} lineNumber The number of hte line that to be calculated.
     * @returns {LineCountResult} The result of the counting.
     */
    function getLineCount(lineNumber) {
        const lineStr = lines[lineNumber - 1].trim()
        let lineCountResult = 0
        let blankLineCountResult = 0
        if (lineStr !== '') {
            lineCountResult = 1
        }
        else {
            blankLineCountResult = 1
            if (countBlank) lineCountResult = 1
        }
        let commentCountResult = 0

        for (let i = 0, len = comments.length; i < len; i++) {
            const { loc: { start: { line: startLine }, end: { line: endLine } } } = comments[i]
            // To improve the performance because the comments list is listed by start line's asc order 
            if (startLine > lineNumber) break
            if (endLine < lineNumber) continue

            if (startLine <= lineNumber && lineNumber <= endLine) {
                if (comments[i].type === 'CommentBlock') {
                    if (startLine !== endLine) {
                        // multi-line with block type comment
                        commentCountResult = 1
                        if (lineStr === '') lineCountResult = 1 // treat blank line as a valid line.
                    }
                    else if (lineStr === '/*' + comments[i].value + '*/') {
                        // single line with block type comment
                        commentCountResult = 1
                    }
                }
                else if (lineStr === '//' + comments[i].value) {
                    // single line with line type comment
                    commentCountResult = 1
                }
            }
        }

        return {
            lineCountIncrement: lineCountResult - (countComment ? 0 : commentCountResult),
            commentLineCountIncrement: commentCountResult,
            blankLineCountIncrement: commentCountResult === 0 ? blankLineCountResult : 0,
        }
    }

    return functionLineCountsResult
}

