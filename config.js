/** This is the configuration of the function lines counter. */
module.exports = {
    /** 
     * Whether to count comment or not, the false is not to count.
     * @type {boolean}
    */
    countComment: false,

    /** 
     * Functions whose count line is less than this value will not output. 
     * @type {number}
    */
    minLineCount: 0,

    /** 
    * Functions whose count line is larger than this value will not output. 
    * @type {number}
    */
    maxLineCount: Infinity,

    /** 
    * The path of folder or file that you want to count lines.
    * @type {string}
    */
    targetPath: 'D:/Programs/my-code-memos',

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
    * @param {number} linesCount - The lines count of the function. 
    * @param {number} startLine - The startLine of the function.
    * @param {number} endLine - The endLine of the function.
    * 
    */
    outputTemplate: (functionName, linesCount, startLine, endLine) => `The lines of function '${functionName}'(${startLine}:${endLine}) is：${linesCount}`,
    /** 
    * The template of the error message.
    * @param {error} error - The error that be thrown.
    * @param {string} filePath - The path of the file which occurred the error.
    */
    errorTemplate: (error, filePath) => `'${error}' occurred in the file ${filePath}, this file would not be counted.`,
}
