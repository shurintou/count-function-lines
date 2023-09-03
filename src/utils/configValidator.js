
/** This is a function that to validate configurations. */
function configValidator(config) {
    const { minLineCount, maxLineCount, targetPath, excludePaths, excludeFunctionNames, ouputResultFilePath, outputTemplate, errorTemplate } = config

    if (typeof minLineCount !== 'number') throw new Error('The type of the minLineCount should be a number.')

    if (typeof maxLineCount !== 'number') throw new Error('The type of the maxLineCount should be a number.')

    if (minLineCount > maxLineCount) throw new Error('The minLineCount should less than the maxLineCount.')

    if (minLineCount < 0) throw new Error('The minLineCount should be positive.')

    if (maxLineCount < 0) throw new Error('The maxLineCount should be positive.')

    if (typeof targetPath !== 'string') throw new Error('The type of the targetPath should be a string.')

    if (targetPath.trim().length === 0) throw new Error('The value of the targetPath should not be empty.')

    if (!Array.isArray(excludePaths)) throw new Error('The type of the excludePaths should be a array.')

    if (excludePaths.some(path => !path instanceof RegExp)) throw new Error('The type of each excludePath should be a regualr expression.')

    if (!Array.isArray(excludeFunctionNames)) throw new Error('The type of the excludeFunctionNames should be a array.')

    if (excludeFunctionNames.some(functionName => !functionName instanceof RegExp)) throw new Error('The type of each excludeFunctionName should be a regualr expression.')

    if (typeof ouputResultFilePath !== 'string') throw new Error('The type of the ouputResultFilePath should be a string.')

    if (ouputResultFilePath.trim().length === 0) throw new Error('The value of the ouputResultFilePath should not be empty.')

    if (typeof outputTemplate !== 'function') throw new Error('The type of the outputTemplate should be a function.')

    if (typeof errorTemplate !== 'function') throw new Error('The type of the errorTemplate should be a function.')
}

export default configValidator