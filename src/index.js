const fs = require('fs')
const path = require('path')
const jsFunctionLineCount = require('./jsFunctionLineCount')
const COUNT_COMMENT = false
const TARGET_PATH = 'D:/Programs/my-code-memos/src'

let outputStr = ''

function traverseDirectory(directoryPath) {
    if (!path.isAbsolute(directoryPath)) directoryPath = __dirname + '\\' + directoryPath
    const stats = fs.statSync(directoryPath)
    if (stats.isDirectory()) {
        const files = fs.readdirSync(directoryPath)
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file)
            traverseDirectory(filePath)
        })
    } else {
        if (path.extname(directoryPath) === '.js') {
            const functionLineCountsResult = jsFunctionLineCount(directoryPath, COUNT_COMMENT)
            if (Object.keys(functionLineCountsResult).length > 0) {
                outputStr += directoryPath + '\n'
                // output the result
                for (const functionName in functionLineCountsResult) {
                    outputStr += `The lines of function '${functionName}' is：${functionLineCountsResult[functionName]}\n`
                }
                outputStr += '\n'
            }
        }
    }
}

traverseDirectory(TARGET_PATH)
fs.writeFileSync('result.txt', outputStr)
