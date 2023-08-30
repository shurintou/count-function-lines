import fs from 'fs'
import { parse as vueParser } from '@vue/compiler-sfc'
import { jsFuncCounter } from './jsFuncLinesCounter.js'
import config from '../config.js'

/**
 * @typedef {import('./funcLinesCountHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter handler of the vue.js.
 * @param {string} filePath The path of the file to be counted.
 * @returns {FunctionLineCountsResult[]} 
 */
export const vueFuncCounterHandler = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { minLineCount, maxLineCount, excludeFunctionNames } = config
    return vueFuncCounter(fileContent, minLineCount, maxLineCount, excludeFunctionNames)
}

/**
 * The counter of the Vue.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
export const vueFuncCounter = function (fileContent, minLineCount = 0, maxLineCount = Infinity, excludeFunctionNames = []) {
    const { descriptor } = vueParser(fileContent)
    const scriptContent = descriptor.script?.content || descriptor.scriptSetup?.content
    if (scriptContent) {
        // need to correct the line index of the <script> so pass the offset parameter.
        return jsFuncCounter(
            scriptContent,
            (descriptor.script?.loc.start.line - 1 || descriptor.scriptSetup?.loc.start.line - 1),
            minLineCount, maxLineCount, excludeFunctionNames
        )
    }
    return []
}
