import fs from 'fs'
import * as path from 'path'
import { getFuncCounter } from 'count-function-lines'

/**
 * @typedef {import('count-function-lines').FunctionLineCountsResult} FunctionLineCountsResult
 * @typedef {import('../../config.js').OutputTemplate} OutputTemplate
 * @typedef {import('../../config.js').ErrorTemplate} ErrorTemplate
 */

/**
 * @typedef FileCountResult
 * @type {object}
 * @property {string} filePath - The path of the file.
 * @property {FunctionLineCountsResult[]} resultList - Each function's count result in the file.
 */

/** 
 * This is the function that handles the all counting operations of a certain file.
 * @param {string} filePath - The path of the file.
 * @param {number} [minLineCount] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames] The regular expressions of function name that you don't want to count lines.
 * @returns {FileCountResult} Returns the output of the specified file.
 */
function fileCountHandler(filePath, minLineCount, maxLineCount, excludeFunctionNames) {
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
        if (e instanceof Error) console.error(`'${e}' occurred in the file ${filePath}, this file would not be counted.`)
    }

    return { filePath: filePath, resultList: functionLineCountsResult }
}


export default fileCountHandler
