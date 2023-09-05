/**
 * @typedef FunctionLineCountsResult
 * @type {object}
 * @property {string} functionName - The name of the function.
 * @property {number} validLineCount -  The lines count of the valid code inside the function. 
 * @property {number} startLine - The startLine of the function.
 * @property {number} endLine - The endLine of the function.
 * @property {number} commentLineCount - The lines count of the comment inside the function.
 * @property {number} blankLineCount - The lines count of the blank line inside the function.
 */
interface FunctionLineCountsResult {
    functionName: string
    validLineCount: number
    startLine: number
    endLine: number
    commentLineCount: number
    blankLineCount: number
}

type SupportFileExtensions = '.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java'

declare const supportFileExtensions: ('.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java')[]

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

 * @returns {FunctionLineCountsResult[]} 
 */
declare function jsFuncCounter(fileContent: string, minLineCount?: number, maxLineCount?: number, excludeFunctionNames?: RegExp[]): FunctionLineCountsResult[]

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
 * @return {((fileContent: string, minLineCount?: number | undefined, maxLineCount?: number | undefined, excludeFunctionNames?: RegExp[] | undefined) => FunctionLineCountsResult[]) | undefined} 
 */
declare function getFuncCounter(fileExtname: string): ((fileContent: string, minLineCount?: number | undefined, maxLineCount?: number | undefined, excludeFunctionNames?: RegExp[] | undefined) => FunctionLineCountsResult[]) | undefined

export { getFuncCounter, javaFuncCounter, jsFuncCounter, vueFuncCounter, FunctionLineCountsResult, SupportFileExtensions, supportFileExtensions }
