const fs = require('fs')
const funcLinesCountHandler = require('./funcLinesCountHandler')
const { ouputResultFilePath } = require('./config')
const result = funcLinesCountHandler()
fs.writeFileSync(ouputResultFilePath, result)
