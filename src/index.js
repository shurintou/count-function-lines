import fs from 'fs'
import configValidator from './configValidator.js'
import counterHandler from './counterHandler.js'
import config from '../config.js'
const { ouputResultFilePath } = config
configValidator()
const result = counterHandler()
fs.writeFileSync(ouputResultFilePath, result)
