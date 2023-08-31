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
interface FunctionLineCountsResult {
    functionName: string
    lineCount: number
    startLine: number
    endLine: number
    commentLineCount: number
    blankLineCount: number
}

type SupportLanguages = '.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java'

/**
 * @type {SupportLanguages[]}
 */
declare const supportFileType: SupportLanguages[]

/**
 * The counter of the java.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
declare function javaFuncCounter(fileContent: string, minLineCount?: number, maxLineCount?: number, excludeFunctionNames?: RegExp[]): FunctionLineCountsResult[]

/**
 * The counter of the javascript.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.
 * @param {number} [offset = 0] The offset of the content's location compared to the start of the file.

 * @returns {FunctionLineCountsResult[]} 
 */
declare function jsFuncCounter(fileContent: string, minLineCount?: number, maxLineCount?: number, excludeFunctionNames?: RegExp[], offset?: number,): FunctionLineCountsResult[]

/**
 * The counter of the Vue.
 * @param {string} fileContent The content of the file.
 * @param {number} [minLineCount = 0] Functions whose count line is less than this value will not output.
 * @param {number} [maxLineCount = Infinity] Functions whose count line is larger than this value will not output. 
 * @param {RegExp[]} [excludeFunctionNames = []] The regular expressions of function name that you don't want to count lines.

 * @returns {FunctionLineCountsResult[]} 
 */
declare function vueFuncCounter(fileContent: string, minLineCount?: number, maxLineCount?: number, excludeFunctionNames?: RegExp[]): FunctionLineCountsResult[]

/** 
 * To get the function counter for a certain file extension.
 * @param {string} fileExtname
 * @return {((fileContent: string, minLineCount?: number | undefined, maxLineCount?: number | undefined, excludeFunctionNames?: RegExp[] | undefined, offset?: number | undefined) => FunctionLineCountsResult[]) | undefined} 
 */
declare function getFuncCounter(fileExtname: string): ((fileContent: string, minLineCount?: number | undefined, maxLineCount?: number | undefined, excludeFunctionNames?: RegExp[] | undefined, offset?: number | undefined) => FunctionLineCountsResult[]) | undefined

export { getFuncCounter, javaFuncCounter, jsFuncCounter, vueFuncCounter, FunctionLineCountsResult, SupportLanguages, supportFileType }
