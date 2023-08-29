import { parse as vueParser } from '@vue/compiler-sfc'
import { jsFuncCounter } from './jsFuncLinesCounter.js'

/**
 * @typedef {import('./index.d.ts').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter of the Vue.
 * @param {string} fileContent The content of the file.
 * @param {boolean} [countComment = false] Whether to count comment or not, the false is not to count.
 * @param {boolean} [countBlank = false] Whether to count blank line or not, the false is not to count.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
export default function (fileContent, countComment = false, countBlank = false, minLineCount = 0, maxLineCount = Infinity, excludeFunctionNames = []) {
    const { descriptor } = vueParser(fileContent)
    const scriptContent = descriptor.script?.content || descriptor.scriptSetup?.content
    if (scriptContent) {
        // need to correct the line index of the <script> so pass the offset parameter.
        return jsFuncCounter(
            scriptContent,
            (descriptor.script?.loc.start.line - 1 || descriptor.scriptSetup?.loc.start.line - 1),
            countComment, countBlank, minLineCount, maxLineCount, excludeFunctionNames
        )
    }
    return []
}
