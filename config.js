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

    /** 
    * Where the result file to be output.
    * @type {string}
    * 
    */
    ouputResultFilePath: 'result.txt',

    /** 
    * The template of the output.
    * @param {string} functionName - The name of the function.
    * @param {number} lineCount - The result lines count of the function that match the user-specified counting conditions.
    * @param {number} startLine - The startLine of the function.
    * @param {number} endLine - The endLine of the function.
    * @property {number} commentLineCount - The lines count of the comment inside the function.
    * @property {number} blankLineCount - The lines count of the blank line inside the function.
    * 
    */
    outputTemplate: (functionName, lineCount, startLine, endLine, commentLineCount, blankLineCount) => `The total lines of function '${functionName}'(${startLine}:${endLine}) is：${endLine - startLine + 1}, including ${lineCount} valid lines, ${commentLineCount} comment lines and ${blankLineCount} blank lines.`,
    /** 
    * The template of the error message.
    * @param {error} error - The error that be thrown.
    * @param {string} filePath - The path of the file which occurred the error.
    */
    errorTemplate: (error, filePath) => `'${error}' occurred in the file ${filePath}, this file would not be counted.`,
}
