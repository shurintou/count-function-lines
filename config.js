/**
* @typedef { (functionName:string, validLineCount:number, startLine:number, endLine:number, commentLineCount:number, blankLineCount:number) => string} OutputTemplate
* @param {string} functionName - The name of the function.
* @param {number} validLineCount - The lines count of the valid code inside the function. 
* @param {number} startLine - The startLine of the function.
* @param {number} endLine - The endLine of the function.
* @param {number} commentLineCount - The lines count of the comment inside the function.
* @param {number} blankLineCount - The lines count of the blank line inside the function.
* @returns {string} The output text.
*/

/**
* @typedef { (error:Error, filePath:string) => string} ErrorTemplate
* @param {string} functionName - The name of the function.
* @param {Error} error - The occurred error.
* @param {string} filePath - The filePath where error occurred.
* @returns {string} The error message.
*/

/** This is the configuration of the function lines counter. */
export default {
    /** 
     * Functions whose valid count line is less than this value will not output. 
     * @type {number}
    */
    minLineCount: 0,

    /** 
    * Functions whose valid count line is larger than this value will not output. 
    * @type {number}
    */
    maxLineCount: Infinity,

    /** 
    * The path of folder or file that you want to count lines.
    * @type {string}
    */
    targetPath: 'examples',

    /** 
    * The regular expressions of folder or file that you don't want to count lines.
    * @type {RegExp[]}
    */
    excludePaths: [/.*node_modules.*/, /.*jquery.*/],

    /** 
    * The regular expressions of function name that you don't want to count lines.
    * @type {RegExp[]}
    */
    excludeFunctionNames: [/data/],

}
