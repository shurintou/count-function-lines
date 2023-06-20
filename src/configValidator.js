const config = require('./config')

const configValidator = function () {
    const { countComment, minLineCount, maxLineCount, targetPath, excludePaths, ouputResultFilePath, outputTemplate } = config

    if (typeof countComment !== 'boolean') throw new Error('The type of the countComment should be a boolean.')

    if (typeof minLineCount !== 'number') throw new Error('The type of the minLineCount should be a number.')

    if (typeof maxLineCount !== 'number') throw new Error('The type of the maxLineCount should be a number.')

    if (minLineCount > maxLineCount) throw new Error('The minLineCount should less than the maxLineCount.')

    if (minLineCount < 0) throw new Error('The minLineCount should be positive.')

    if (maxLineCount < 0) throw new Error('The maxLineCount should be positive.')

    if (typeof targetPath !== 'string') throw new Error('The type of the targetPath should be a string.')

    if (!Array.isArray(excludePaths)) throw new Error('The type of the excludePaths should be a array.')

    if (excludePaths.some(path => !path instanceof RegExp)) throw new Error('The type of each excludePath should be a regualr expression.')

    if (typeof ouputResultFilePath !== 'string') throw new Error('The type of the ouputResultFilePath should be a string.')

    if (typeof outputTemplate !== 'function') throw new Error('The type of the outputTemplate should be a function.')
}

module.exports = configValidator