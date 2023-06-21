const fs = require('fs')
const path = require('path')
const { jsFuncCounterHandler } = require('./jsFuncLinesCounter')
const { vueFuncCounterHandler } = require('./vueFuncLinesCounter')
const config = require('./config')
const TARGET_PATH = config.targetPath
const EXCLUDE_PATHS = config.excludePaths

const funcLinesCountHandler = function () {
    let outputStr = ''

    function traverseDirectory(directoryPath) {
        if (EXCLUDE_PATHS.some(regex => regex.test(directoryPath))) return
        if (!path.isAbsolute(directoryPath)) directoryPath = __dirname + '\\' + directoryPath
        const stats = fs.statSync(directoryPath)
        if (stats.isDirectory()) {
            const files = fs.readdirSync(directoryPath)
            files.forEach((file) => {
                const filePath = path.join(directoryPath, file)
                traverseDirectory(filePath)
            })
        } else {
            const fileExtname = path.extname(directoryPath)
            let functionLineCountsResult = []
            try {
                if (fileExtname === '.js') {
                    functionLineCountsResult = jsFuncCounterHandler(directoryPath)
                }
                else if (fileExtname === '.vue') {
                    functionLineCountsResult = vueFuncCounterHandler(directoryPath)
                }
            }
            catch (e) {
                console.error(config.errorTemplate(e, directoryPath))
            }
            if (functionLineCountsResult.length > 0) {
                outputStr += directoryPath + '\n'
                // output the result
                functionLineCountsResult.forEach(result => outputStr += config.outputTemplate(result.functionName, result.lineCount, result.startLine, result.endLine) + '\n')
                outputStr += '\n'
            }
        }
    }

    traverseDirectory(TARGET_PATH)

    return outputStr
}

module.exports = funcLinesCountHandler
