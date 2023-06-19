module.exports = {
    countComment: false,
    targetPath: 'D:/Programs/my-code-memos',
    ouputResultFilePath: 'result.txt',
    outputTemplate: (functionName, linesCount) => `The lines of function '${functionName}' is：${linesCount}\n`,
}
