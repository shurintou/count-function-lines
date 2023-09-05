import fs from 'fs'
import * as path from 'path'
import { getFuncCounter } from 'count-function-lines'

/**
 * @typedef {import('count-function-lines').FunctionLineCountsResult} FunctionLineCountsResult
 * @typedef {import('../../config.js').OutputTemplate} OutputTemplate
 * @typedef {import('../../config.js').ErrorTemplate} ErrorTemplate
 */

/** 
 * This is the function that handles the all counting operations of a certain file.
 * @param {string} filePath
 * @param {number} [minLineCount] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames] The regular expressions of function name that you don't want to count lines.
 * @param {OutputTemplate} [outputTemplate] The template of the output.
 * @param {ErrorTemplate} [errorTemplate] The template of the error message.
 * @returns {string} Returns the counting result of the specified file.
 */
function fileCountHandler(filePath, minLineCount, maxLineCount, excludeFunctionNames, outputTemplate, errorTemplate) {
    let resultStr = ''

    const fileExtname = path.extname(filePath)
    /** 
     * @type {FunctionLineCountsResult[]}
     */
    let functionLineCountsResult = []
    try {
        let counter = getFuncCounter(fileExtname)
        if (counter) {
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            functionLineCountsResult = counter(fileContent, minLineCount, maxLineCount, excludeFunctionNames)
        }
    }
    catch (e) {
        if (e instanceof Error) console.error(errorTemplate(e, filePath))
    }
    if (functionLineCountsResult.length > 0) {
        resultStr += filePath + '\n'
        // append the result
        functionLineCountsResult.forEach(result => resultStr += outputTemplate(result.functionName, result.validLineCount, result.startLine, result.endLine, result.commentLineCount, result.blankLineCount) + '\n')
        resultStr += '\n'
    }

    return resultStr
}


export default fileCountHandler
