import fs from 'fs'
import config from '../config.js'
import configValidator from './utils/configValidator.js'
import traverseDirectory from './utils/traverseDirectory.js'
import showProgressBar from './utils/showProgressBar.js'
import fileCountHandler from './utils/fileCountHandler.js'
import { supportFileExtensions } from 'count-function-lines'

configValidator(config)
const { excludeFunctionNames, excludePaths, errorTemplate, maxLineCount, minLineCount, ouputResultFilePath, outputTemplate, targetPath } = config
let result = ''
/** @type {string[]} */
let targetFilePathList = []
traverseDirectory(targetPath, excludePaths, supportFileExtensions, targetFilePathList)
const targetFilePathListLength = targetFilePathList.length
targetFilePathList.forEach((filePath, index) => {
    showProgressBar(targetFilePathListLength, index + 1)
    result += fileCountHandler(filePath, minLineCount, maxLineCount, excludeFunctionNames, outputTemplate, errorTemplate)
})
fs.writeFileSync(ouputResultFilePath, result)
