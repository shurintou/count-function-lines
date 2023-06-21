const fs = require('fs')
const vueParser = require('vue-template-compiler')
const { jsFuncCounter } = require('./jsFuncLinesCounter')

const vueFuncCounterHandler = function (filePath) {
    const vueFileContent = fs.readFileSync(filePath, 'utf-8')
    const scriptContent = vueParser.parseComponent(vueFileContent).script.content
    return jsFuncCounter(scriptContent)
}

module.exports.vueFuncCounterHandler = vueFuncCounterHandler