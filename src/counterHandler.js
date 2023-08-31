import jsFuncCounter from './counters/jsFuncLinesCounter.js'
import vueFuncCounter from './counters/vueFuncLinesCounter.js'
import javaFuncCounter from './counters/javaFuncLinesCounter.js'

/**
 * @type {('.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java')[]}
 */
export const supportFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.java']


/** 
 * To get the function counter for a certain file extension.
 * @param {string} fileExtname
 * @return {((fileContent: string, minLineCount?: number | undefined, maxLineCount?: number | undefined, excludeFunctionNames?: RegExp[] | undefined, offset?: number | undefined) => FunctionLineCountsResult[]) | undefined} 
 */
export const getFuncCounter = (fileExtname) => {
    if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExtname)) {
        return jsFuncCounter
    }
    else if (fileExtname === '.vue') {
        return vueFuncCounter
    }
    else if (fileExtname === '.java') {
        return javaFuncCounter
    }
    return undefined
}
