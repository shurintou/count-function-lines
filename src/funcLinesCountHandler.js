const fs = require('fs')
const path = require('path')
const jsFuncLinesCounter = require('./jsFuncLinesCounter')
const config = require('./config')
const TARGET_PATH = config.targetPath

const funcLinesCountHandler = function () {
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
                const functionLineCountsResult = jsFuncLinesCounter(directoryPath)
                if (Object.keys(functionLineCountsResult).length > 0) {
                    outputStr += directoryPath + '\n'
                    // output the result
                    for (const functionName in functionLineCountsResult) {
                        outputStr += config.outputTemplate(functionName, functionLineCountsResult[functionName])
                    }
                    outputStr += '\n'
                }
            }
        }
    }

    if (TARGET_PATH !== '') traverseDirectory(TARGET_PATH)

    return outputStr
}

module.exports = funcLinesCountHandler
