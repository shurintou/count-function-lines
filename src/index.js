const fs = require('fs')
const jsFunctionLineCount = require('./jsFunctionLineCount')
const COUNT_COMMENT = false
const TARGET_PATH = 'your_file.js'

const functionLineCountsResult = jsFunctionLineCount(TARGET_PATH, COUNT_COMMENT)

// output the result
let outputStr = ''
for (const functionName in functionLineCountsResult) {
    outputStr += `The lines of function '${functionName}' is：${functionLineCountsResult[functionName]}\n`
}
fs.writeFileSync('result.txt', outputStr)
