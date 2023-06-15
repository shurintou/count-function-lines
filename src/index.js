const fs = require('fs')
const esprima = require('esprima')

const fileContent = fs.readFileSync('your_file.js', 'utf-8')
const lines = fileContent.split('\n')
const isModule = fileContent.indexOf('import') >= 0 || fileContent.indexOf('export') >= 0

const parseParameters = { loc: true, comment: true, range: true }
const ast = isModule ? esprima.parseModule(fileContent, parseParameters) : esprima.parseScript(fileContent, parseParameters)
let { comments } = ast

const functionLineCountsResult = {}

function traverse(node) {
    if (node.type === 'FunctionDeclaration') {
        // count the lines of funcion which is defined by a FunctionDeclaration way
        if (node.id) {
            const functionName = node.id.name
            const { start, end } = node.body.loc
            countLines(start, end, functionName)
        }
    } else if (node.type === 'VariableDeclaration') {
        // count the lines of funcion which is defined by a VariableDeclaration way
        if (['FunctionExpression', 'ArrowFunctionExpression'].includes(node.declarations[0].init?.type)) {
            const functionName = node.declarations[0].id.name
            const { start, end } = node.declarations[0].init.body.loc
            countLines(start, end, functionName)
        }
    } else if (node.type === 'Property') {
        // count the lines of function in Object declaration
        if (['FunctionExpression', 'ArrowFunctionExpression'].includes(node.value.type)) {
            // count the lines of function as an property of a certain Object 
            const functionName = node.key.name
            const { start, end } = node.value.body.loc
            countLines(start, end, functionName)

        } else if (node.value.type === 'ObjectExpression') {
            // count the function lines of a certain Object nesting inside another Object's property 
            for (const property of node.value.properties) {
                traverse(property)
            }
        }
    }

    for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
            traverse(node[key])
        }
    }
}

function countLines(start, end, functionName) {
    if (!functionLineCountsResult.hasOwnProperty(functionName)) {
        let lineCount = 0
        for (let i = start.line - 1; i < end.line; i++) {
            const lineStr = lines[i].trim()
            if (lineStr !== '') {
                lineCount = lineCount + 1 - commentLinesCount(i + 1, lineStr)
            }
        }
        functionLineCountsResult[functionName] = lineCount
    }
}

function commentLinesCount(lineNumber, lineStr) {
    let countResult = 0
    const countedCommentsIndex = []

    comments.forEach((comment, index) => {
        const { loc: { start: { line: startLine }, end: { line: endLine } } } = comment
        if (startLine <= lineNumber && lineNumber <= endLine) {
            if (comment.type === 'Block') {
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

traverse(ast)

// output the result
let outputStr = ''
for (const functionName in functionLineCountsResult) {
    outputStr += `The lines of function '${functionName}' is：${functionLineCountsResult[functionName]}\n`
}
fs.writeFileSync('result.txt', outputStr)
