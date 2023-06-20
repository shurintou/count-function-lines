module.exports = {
    countComment: false,
    targetPath: 'D:/Programs/my-code-memos',
    ouputResultFilePath: 'result.txt',
    outputTemplate: (functionName, linesCount, startLine, endLine) => `The lines of function '${functionName}'(${startLine}:${endLine}) is：${linesCount}\n`,
}
