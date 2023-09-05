import fs from 'fs'

/** @typedef {import('./fileCountHandler.js').FileCountResult} FileCountResult */

/** 
 * This is the function that handles the count result and ouput it.
 * @param {FileCountResult[]} [fileCountResults] The count result of all the files.
 * @returns {void} 
 */
function resultHandler(fileCountResults) {
    let outputStr = ''
    if (fileCountResults.length > 0) {
        fileCountResults.forEach(({ filePath, resultList }) => {
            if (resultList.length > 0) {
                outputStr += filePath + '\n'
                resultList.forEach(({ functionName, validLineCount, startLine, endLine, commentLineCount, blankLineCount }) => outputStr += `The total lines of function '${functionName}'(${startLine}:${endLine}) is：${endLine - startLine + 1}, including ${validLineCount} valid lines, ${commentLineCount} comment lines and ${blankLineCount} blank lines.` + '\n')
                outputStr += '\n'
            }
        })
    }
    // Output to result.txt at the root path as default.
    fs.writeFileSync('result.txt', outputStr)
}

export default resultHandler