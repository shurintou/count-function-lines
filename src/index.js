const fs = require('fs')
const configValidator = require('./configValidator')
const funcLinesCountHandler = require('./funcLinesCountHandler')
const { ouputResultFilePath } = require('../config')
configValidator()
const result = funcLinesCountHandler()
fs.writeFileSync(ouputResultFilePath, result)

const { javaFuncCounter } = require('./javaFuncLinesCounter')
const { jsFuncCounter } = require('./jsFuncLinesCounter')
const { vueFuncCounter } = require('./vueFuncLinesCounter')
export { jsFuncCounter, vueFuncCounter, javaFuncCounter }
