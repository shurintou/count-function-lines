const fs = require('fs')
const esprima = require('esprima')

const fileContent = fs.readFileSync('your_file.js', 'utf-8')
const lines = fileContent.split('\n')

const ast = esprima.parseScript(fileContent, { loc: true })

const functionLineCountsResult = {}

function traverse(node) {
    if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
        if (node.id) {
            const functionName = node.id.name
            const { start, end } = node.body.loc

            // count normal function lines
            let lineCount = 0
            for (let i = start.line - 1; i < end.line; i++) {
                if (lines[i].trim() !== '') {
                    lineCount++
                }
            }

            functionLineCountsResult[functionName] = lineCount
        }

    } else if (node.type === 'Property') {
        if (['FunctionExpression', 'ArrowFunctionExpression'].includes(node.value.type)) {
            const functionName = node.key.name
            const { start, end } = node.value.body.loc
            const lines = fileContent.split('\n')

            // count the function lines of Object's property
            let lineCount = 0
            for (let i = start.line - 1; i < end.line; i++) {
                if (lines[i].trim() !== '') {
                    lineCount++
                }
            }

            functionLineCountsResult[functionName] = lineCount

        } else if (node.value.type === 'ObjectExpression') {
            // count the function lines of an Object nesting inside the Object's property 
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

traverse(ast)

// output the result
for (const functionName in functionLineCountsResult) {
    console.log(`The lines of function '${functionName}' is：${functionLineCountsResult[functionName]}`)
}
