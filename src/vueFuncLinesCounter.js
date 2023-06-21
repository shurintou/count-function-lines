const fs = require('fs')
const vueParser = require('@vue/compiler-sfc').parse
const { jsFuncCounter } = require('./jsFuncLinesCounter')

const vueFuncCounterHandler = function (filePath) {
    const vueFileContent = fs.readFileSync(filePath, 'utf-8')
    const { descriptor } = vueParser(vueFileContent)
    const scriptContent = descriptor.script?.content || descriptor.scriptSetup?.content
    return jsFuncCounter(scriptContent, descriptor.script?.loc.start.line - 1 || descriptor.scriptSetup?.loc.start.line - 1)
}

module.exports.vueFuncCounterHandler = vueFuncCounterHandler