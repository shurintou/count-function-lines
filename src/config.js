module.exports = {
    // Whether to count comment or not, the false is not to count.
    countComment: false,
    // Functions whose count line is less than this value will not output. 
    minLineCount: 0,
    // Functions whose count line is larger than this value will not output. 
    maxLineCount: Infinity,
    // The path of folder or file that you want to count lines.
    targetPath: 'D:/Programs/my-code-memos',
    // The regular expressions of folder or file that you don't want to count lines.
    excludePaths: [/.*node_modules.*/, /.*jquery.*/],
    // Where the result file to be output.
    ouputResultFilePath: 'result.txt',
    // The template of the output.
    outputTemplate: (functionName, linesCount, startLine, endLine) => `The lines of function '${functionName}'(${startLine}:${endLine}) is：${linesCount}`,
}
