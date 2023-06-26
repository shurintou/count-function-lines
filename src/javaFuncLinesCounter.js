const fs = require('fs')
const { parse, BaseJavaCstVisitorWithDefaults } = require("java-parser")
const config = require('../config')
const { countComment, countBlank, minLineCount, maxLineCount, excludeFunctionNames } = config

/**
 * @typedef FunctionInnerComment
 * @type {object}
 * @property {string} image - The content of the comment.
 * @property {number} startLine -  The start line of the comment. 
 * @property {number} endLine - The end line of the comment.
 */

/**
 * @typedef FunctionLocation
 * @type {object}
 * @property {number} startLine -  The start line of the function. 
 * @property {number} endLine - The end line of the function.
 */

/**
 * @typedef {import('./funcLinesCountHandler').FunctionLineCountsResult} FunctionLineCountsResult
 */

/**
 * The counter handler of the java.
 * @param {string} filePath The path of the file to be counted.
 * @returns {FunctionLineCountsResult[]} 
 */
const javaFuncCounterHandler = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return javaFuncCounter(fileContent)
}

/**
 * This is the visitor class to traverse the Java Concrete Syntax Tree. 
 */
class MethodVisitor extends BaseJavaCstVisitorWithDefaults {
    constructor() {
        super()
        this.validateVisitor()
        /**
         * @type {string[]} 
         */
        this.methodNames = []
        /**
         * @type {FunctionLocation[]} 
         */
        this.methodLocations = []
        /**
        * @type {FunctionInnerComment[]} 
        */
        this.methodComments = []
    }

    methodHeader(ctx) {
        this.methodNames.push(ctx.methodDeclarator[0].children.Identifier[0].image)
    }

    methodBody(ctx) {
        this.block(ctx)
    }

    block(ctx) {
        if (ctx.hasOwnProperty('block')) {
            this.children(ctx.block[0])
        }
        else if (ctx.hasOwnProperty('Semicolon')) {
            this.methodLocations.push(ctx.Semicolon[0])
        }
        else if (ctx.hasOwnProperty('LCurly') && ctx.hasOwnProperty('RCurly')) {
            this.methodLocations.push({ startLine: ctx.LCurly[0].startLine, endLine: ctx.RCurly[0].endLine })
        }

    }

    children(ctx) {
        this.methodLocations.push(ctx.location)
        const blockStatements = ctx.children?.blockStatements
        if (blockStatements && blockStatements.length > 0)
            this.blockStatements(blockStatements[0])
    }

    blockStatements(ctx) {
        this.methodComments.push(ctx.leadingComments)
    }

}

/**
 * The counter of the java.
 * @returns {FunctionLineCountsResult[]} 
 */
const javaFuncCounter = function (fileContent) {
    const cst = parse(fileContent)
    /**
     * @type {string[]} 
     */
    const lines = fileContent.split('\n')
    const visitor = new MethodVisitor()
    /** 
     * @type {FunctionLineCountsResult[]}
     */
    let functionLineCountsResult = []

    visitor.visit(cst)

    if (visitor.methodNames) {
        visitor.methodNames.forEach((name, index) => {
            const { startLine, endLine } = visitor.methodLocations[index]
            countLines(startLine, endLine, name, visitor.methodComments[index] || [])
        })
    }

    /**
     * This is the function to count the line and push the result to the results list. 
     * @param {number} startLine The startLine of the function.
     * @param {number} endLine The endLine of the function.
     * @param {string} functionName The name of the function.
     * @param {FunctionInnerComment[]} functionComments The comments list of the function.
     */
    function countLines(startLine, endLine, functionName, functionComments) {
        if (excludeFunctionNames.some(regex => regex.test(functionName))) return
        let lineCount = 0

        // to cumulate the lines count
        for (let i = startLine - 1; i < endLine; i++) {
            const lineStr = lines[i].trim()
            if (lineStr !== '' || countBlank) {
                lineCount = lineCount + 1
            }
        }

        // to subtract the lines count of comments from the count result above
        functionComments.forEach(comment => {
            if (countComment) return
            const { startLine, endLine, image } = comment
            if (startLine !== endLine) {
                lineCount = lineCount - (endLine - startLine + 1)
            }
            else if (image === lines[startLine - 1].trim()) {
                lineCount = lineCount - 1
            }
        })

        // to push the result to the results list
        if (minLineCount <= lineCount && lineCount <= maxLineCount) {
            functionLineCountsResult.push({
                functionName: functionName,
                lineCount: lineCount,
                startLine: startLine,
                endLine: endLine,
            })
        }

    }
    return functionLineCountsResult
}

module.exports.javaFuncCounterHandler = javaFuncCounterHandler