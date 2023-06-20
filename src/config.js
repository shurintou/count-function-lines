module.exports = {
    countComment: false,
    minLineCount: 0,
    maxLineCount: Infinity,
    targetPath: 'D:/Programs/my-code-memos',
    excludePaths: [/.*node_modules.*/, /.*jquery.*/],
    ouputResultFilePath: 'result.txt',
    outputTemplate: (functionName, linesCount, startLine, endLine) => `The lines of function '${functionName}'(${startLine}:${endLine}) is：${linesCount}\n`,
}
