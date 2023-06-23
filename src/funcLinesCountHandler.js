const fs = require('fs')
const path = require('path')
const { jsFuncCounterHandler } = require('./jsFuncLinesCounter')
const { vueFuncCounterHandler } = require('./vueFuncLinesCounter')
const config = require('../config')
const { targetPath, excludePaths } = config

/**
 * @typedef FunctionLineCountsResult
 * @type {object}
 * @property {string} functionName - The name of the function.
 * @property {number} lineCount -  The lines count of the function. 
 * @property {number} startLine - The startLine of the function.
 * @property {number} endLine - The endLine of the function.
 */

/** 
 * This is the function that handles the all counting operations.
 * @returns {string} Returns the counting result.
 */
const funcLinesCountHandler = function () {
    let outputStr = ''

    /** 
     * Traverse the directoryPath to invoke function count handlers.
     * @param {string} directoryPath
     */
    function traverseDirectory(directoryPath) {
        if (excludePaths.some(regex => regex.test(directoryPath))) return
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
            /** 
             * @type {FunctionLineCountsResult[]}
             */
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

    traverseDirectory(targetPath)

    return outputStr
}

module.exports = funcLinesCountHandler
