import { parse as vueParser } from '@vue/compiler-sfc'
import jsFuncCounter from './jsFuncLinesCounter.js'

/**
 * @typedef {import('../counterHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter of the Vue.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
export default function (fileContent, minLineCount = 0, maxLineCount = Infinity, excludeFunctionNames = []) {
    const { descriptor } = vueParser(fileContent)
    const scriptContent = descriptor.script?.content || descriptor.scriptSetup?.content
    if (scriptContent) {
        // need to correct the line index of the <script> so pass the offset parameter.
        const offset = descriptor.script?.loc.start.line - 1 || descriptor.scriptSetup?.loc.start.line - 1 || 0
        const countResult = jsFuncCounter(scriptContent, minLineCount, maxLineCount, excludeFunctionNames)
        return countResult.map(({ functionName, lineCount, startLine, endLine, commentLineCount, blankLineCount }) => ({
            functionName: functionName,
            lineCount: lineCount,
            startLine: startLine + offset,
            endLine: endLine + offset,
            commentLineCount: commentLineCount,
            blankLineCount: blankLineCount,
        }))
    }
    return []
}
