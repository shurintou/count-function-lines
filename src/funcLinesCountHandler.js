const fs = require('fs')
const path = require('path')
const jsFunctionLineCount = require('./jsFunctionLineCount')

const funcLinesCountHandler = function (directoryPath) {
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
                const functionLineCountsResult = jsFunctionLineCount(directoryPath)
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

    traverseDirectory(directoryPath)
    return outputStr
}

module.exports = funcLinesCountHandler
