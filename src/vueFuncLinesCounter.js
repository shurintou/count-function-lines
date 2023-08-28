const fs = require('fs')
const vueParser = require('@vue/compiler-sfc').parse
const { jsFuncCounter } = require('./jsFuncLinesCounter')

/**
 * @typedef {import('./funcLinesCountHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter handler of the vue.js.
 * @param {string} filePath The path of the file to be counted.
 * @returns {FunctionLineCountsResult[]} 
 */
const vueFuncCounterHandler = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return vueFuncCounter(fileContent)
}

/**
 * The counter of the Vue.
 * @param {string} fileContent The content of the file.
 * @returns {FunctionLineCountsResult[]} 
 */
const vueFuncCounter = function (fileContent) {
    const { descriptor } = vueParser(fileContent)
    const scriptContent = descriptor.script?.content || descriptor.scriptSetup?.content
    if (scriptContent) {
        // need to correct the line index of the <script> so pass the offset parameter.
        return jsFuncCounter(scriptContent, descriptor.script?.loc.start.line - 1 || descriptor.scriptSetup?.loc.start.line - 1)
    }
    return []
}

module.exports.vueFuncCounterHandler = vueFuncCounterHandler
module.exports.vueFuncCounter = vueFuncCounter