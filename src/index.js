const fs = require('fs')

const TARGET_PATH = 'D:/Programs/my-code-memos/src'
const funcLinesCountHandler = require('./funcLinesCountHandler')

const result = funcLinesCountHandler(TARGET_PATH)
fs.writeFileSync('result.txt', result)
