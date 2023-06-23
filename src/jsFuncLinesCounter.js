const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const config = require('../config')
const { countComment, minLineCount, maxLineCount } = config

/**
 * @typedef {import('./funcLinesCountHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter handler of the javascript.
 * @param {string} filePath The path of the file to be counted.
 * @returns {FunctionLineCountsResult[]} 
 */
const jsFuncCounterHandler = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return jsFuncCounter(fileContent)
}

/**
 * The counter of the javascript.
 * @returns {FunctionLineCountsResult[]} 
 */
const jsFuncCounter = function (fileContent, offset = 0) {
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
        let lineCount = 0
        for (let i = startLine - 1; i < endLine; i++) {
            const lineStr = lines[i].trim()
            if (lineStr !== '') {
                lineCount = lineCount + 1 - commentLinesCount(i + 1, lineStr)
            }
        }
        if (minLineCount <= lineCount && lineCount <= maxLineCount) {
            functionLineCountsResult.push({
                functionName: functionName,
                lineCount: lineCount,
                startLine: startLine + offset,
                endLine: endLine + offset,
            })
        }
    }

    /** 
     * This is the function that calculates the lines count of the comment.
     * @param {number} lineNumber The number of hte line that to be calculated.
     * @param {string} lineStr The content of the line.
     * @returns {number} The lines count of the comment that should be subtracted.
     */
    function commentLinesCount(lineNumber, lineStr) {
        if (countComment) return 0

        let countResult = 0
        /** 
         * The list of indexes that has been counted.
         * @type {number[]}
         */
        const countedCommentsIndex = []

        comments.forEach((comment, index) => {
            const { loc: { start: { line: startLine }, end: { line: endLine } } } = comment
            if (startLine <= lineNumber && lineNumber <= endLine) {
                if (comment.type === 'CommentBlock') {
                    if (startLine !== endLine) {
                        // multi-line with block type comment
                        countedCommentsIndex.push(index)
                        countResult = endLine - startLine + 1
                    }
                    else if (lineStr === '/*' + comment.value + '*/') {
                        // single line with block type comment
                        countedCommentsIndex.push(index)
                        countResult = 1
                    }
                }
                else if (lineStr === '//' + comment.value) {
                    // single line with line type comment
                    countedCommentsIndex.push(index)
                    countResult = 1
                }
            }
        })

        // to remove comments that already counted or passed
        comments = comments.filter((comment, index) => !countedCommentsIndex.includes(index) && comment.loc.start.line > lineNumber)
        return countResult
    }

    return functionLineCountsResult
}

module.exports.jsFuncCounterHandler = jsFuncCounterHandler
module.exports.jsFuncCounter = jsFuncCounter
