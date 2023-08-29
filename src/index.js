import fs from 'fs'
import configValidator from './configValidator.js'
import funcLinesCountHandler from './funcLinesCountHandler.js'
import config from '../config.js'
const { ouputResultFilePath } = config
configValidator()
const result = funcLinesCountHandler()
fs.writeFileSync(ouputResultFilePath, result)
