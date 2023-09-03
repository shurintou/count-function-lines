import fs from 'fs'
import { fileURLToPath } from 'url'
import * as path from 'path'

const rootSrcPath = path.dirname(fileURLToPath(import.meta.url)).split('src')[0] + 'src\\'
/** 
 * Traverse the directoryPath to get the target filepath list.
 * @param {string} directoryPath
 * @param {RegExp[]} excludePaths
 * @param {string[]} supportFileExtensions
 * @param {string[]} targetFilePathList
 * @returns {void}
 */
function traverseDirectory(directoryPath, excludePaths, supportFileExtensions, targetFilePathList) {
    if (excludePaths.some(regex => regex.test(directoryPath))) return
    if (!path.isAbsolute(directoryPath)) {
        directoryPath = rootSrcPath + directoryPath
    }
    const stats = fs.statSync(directoryPath)
    if (stats.isDirectory()) {
        const files = fs.readdirSync(directoryPath)
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file)
            traverseDirectory(filePath, excludePaths, supportFileExtensions, targetFilePathList)
        })
    } else {
        if (supportFileExtensions.includes(path.extname(directoryPath))) targetFilePathList.push(directoryPath)
    }
}

export default traverseDirectory