const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const config = require('./config')
const COUNT_COMMENT = config.countComment
const MIN_LINE_COUNT = config.minLineCount
const MAX_LINE_COUNT = config.maxLineCount

const jsFuncCounter = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const isModule = fileContent.includes('import') || fileContent.includes('export')
    const lines = fileContent.split('\n')
    const functionLineCountsResult = []

    let ast
    try {
        ast = parser.parse(fileContent, {
            sourceType: isModule ? 'module' : 'script',
            tokens: true,
            ranges: true,
            attachComment: true,
        })
    } catch (e) {
        const { reasonCode, loc } = e
        console.error(`${reasonCode} error occurred in the file ${filePath} at the line${loc.line}, this file would not be counted.`)
        return functionLineCountsResult
    }

    let { comments } = ast

    traverse(ast, {
        enter(path) {
            if (path.isFunctionDeclaration()) {
                // count the lines of funcion which is defined by a FunctionDeclaration way
                const functionName = path.node.id.name
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
                    const functionName = path.node.key.name
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

    function countLines(startLine, endLine, functionName) {
        let lineCount = 0
        for (let i = startLine - 1; i < endLine; i++) {
            const lineStr = lines[i].trim()
            if (lineStr !== '') {
                lineCount = lineCount + 1 - commentLinesCount(i + 1, lineStr)
            }
        }
        if (MIN_LINE_COUNT <= lineCount && lineCount <= MAX_LINE_COUNT) {
            functionLineCountsResult.push({
                functionName: functionName,
                lineCount: lineCount,
                startLine: startLine,
                endLine: endLine,
            })
        }
    }

    function commentLinesCount(lineNumber, lineStr) {
        if (COUNT_COMMENT) return 0

        let countResult = 0
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

module.exports = jsFuncCounter
