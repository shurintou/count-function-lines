import config from '../config.js'
import configValidator from './utils/configValidator.js'
import traverseDirectory from './utils/traverseDirectory.js'
import showProgressBar from './utils/showProgressBar.js'
import fileCountHandler from './utils/fileCountHandler.js'
import { supportFileExtensions } from 'count-function-lines'
import resultHandler from './utils/resultHandler.js'
/** @typedef {import('./utils/fileCountHandler.js').FileCountResult} FileCountResult */

configValidator(config)
const { excludeFunctionNames, excludePaths, maxLineCount, minLineCount, targetPath } = config
/**
 * @description This is a two-dimensional array, the first dimension is the traversed files and the second dimension is the functions in each file.
 * @type {FileCountResult[]} 
 * */
let result = []
/** @type {string[]} */
let targetFilePathList = []
traverseDirectory(targetPath, excludePaths, supportFileExtensions, targetFilePathList)
const targetFilePathListLength = targetFilePathList.length
targetFilePathList.forEach((filePath, index) => {
    showProgressBar(targetFilePathListLength, index + 1)
    result.push(fileCountHandler(filePath, minLineCount, maxLineCount, excludeFunctionNames))
})
resultHandler(result)
