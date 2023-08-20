const fs = require('fs')
const path = require('path')
const { jsFuncCounterHandler } = require('./jsFuncLinesCounter')
const { vueFuncCounterHandler } = require('./vueFuncLinesCounter')
const { javaFuncCounterHandler } = require('./javaFuncLinesCounter')
const config = require('../config')
const { targetPath, excludePaths } = config
const supportFileType = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.java']

/**
 * @typedef FunctionLineCountsResult
 * @type {object}
 * @property {string} functionName - The name of the function.
 * @property {number} lineCount -  The result lines count of the function that match the user-specified counting conditions. 
 * @property {number} startLine - The startLine of the function.
 * @property {number} endLine - The endLine of the function.
 * @property {number} commentLineCount - The lines count of the comment inside the function.
 * @property {number} blankLineCount - The lines count of the blank line inside the function.
 */

/** 
 * This is the function that handles the all counting operations.
 * @returns {string} Returns the counting result.
 */
const funcLinesCountHandler = function () {
    let outputStr = ''
    /**
     * @type {string[]}  
     */
    const filePathList = []
    traverseDirectory(targetPath)
    const filePathListLenght = filePathList.length
    filePathList.forEach((filePath, index) => {
        showProgressBar(filePathListLenght, index + 1)
        const resultStr = countFunctionLinesOfFile(filePath)
        outputStr += resultStr
    })


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
            if (supportFileType.includes(path.extname(directoryPath))) filePathList.push(directoryPath)
        }
    }


    /** 
     * Count function lines of the given file and return the result.
     * @param {string} filePath
     * @returns {string} The result.
     */
    function countFunctionLinesOfFile(filePath) {
        let resultStr = ''

        const fileExtname = path.extname(filePath)
        /** 
         * @type {FunctionLineCountsResult[]}
         */
        let functionLineCountsResult = []
        try {
            if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExtname)) {
                functionLineCountsResult = jsFuncCounterHandler(filePath)
            }
            else if (fileExtname === '.vue') {
                functionLineCountsResult = vueFuncCounterHandler(filePath)
            }
            else if (fileExtname === '.java') {
                functionLineCountsResult = javaFuncCounterHandler(filePath)
            }
        }
        catch (e) {
            console.error(config.errorTemplate(e, filePath))
        }
        if (functionLineCountsResult.length > 0) {
            resultStr += filePath + '\n'
            // append the result
            functionLineCountsResult.forEach(result => resultStr += config.outputTemplate(result.functionName, result.lineCount, result.startLine, result.endLine, result.commentLineCount, result.blankLineCount) + '\n')
            resultStr += '\n'
        }

        return resultStr
    }


    /** 
     * To show process in console.
     * @param {number} totalSteps
     * @param {number} currentStep
     */
    function showProgressBar(totalSteps, currentStep) {
        const progressBarLength = 40
        const progress = currentStep / totalSteps
        const filledBarLength = Math.round(progress * progressBarLength)
        const emptyBarLength = progressBarLength - filledBarLength
        const filledBar = "█".repeat(filledBarLength)
        const emptyBar = "░".repeat(emptyBarLength)
        const percentageProgress = Math.round(progress * 100)
        const statusStr = percentageProgress === 100 ? 'Finished' : 'Counting...'

        process.stdout.write(`${statusStr}: [${filledBar}${emptyBar}] ${percentageProgress}% (${currentStep}/${totalSteps})  \r`)

        if (percentageProgress === 100) process.stdout.write('\n')

    }

    return outputStr
}





module.exports = funcLinesCountHandler
