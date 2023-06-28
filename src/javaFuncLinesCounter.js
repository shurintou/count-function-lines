const fs = require('fs')
const { parse, BaseJavaCstVisitorWithDefaults, MethodDeclarationCtx, CstNode, IToken } = require("java-parser")
const config = require('../config')
const { countComment, countBlank, minLineCount, maxLineCount, excludeFunctionNames } = config

/**
 * @typedef FunctionInnerComment
 * @type {IToken}
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
        * @type {Array<FunctionInnerComment[]>} 
        */
        this.methodComments = []
    }

    /**
     * To implement the methodDeclaration method.
     * @param {MethodDeclarationCtx} ctx 
     */
    methodDeclaration(ctx) {
        const { methodHeader: [methodHeader], methodBody: [methodBody] } = ctx
        if (methodHeader && methodBody) {
            this.methodNames.push(methodHeader.children.methodDeclarator[0].children.Identifier[0].image || '[Anonymous]')
            /**
             * @type {number} 
             */
            const startLine = methodHeader.location?.startLine || 0
            /**
             * @type {number} 
             */
            const endLine = methodBody.location?.endLine || 0
            this.methodLocations.push({ startLine: startLine, endLine: endLine })

            /**
            * @type {FunctionInnerComment[]} 
            */
            let functionComments = []
            this.collectFunctionInnerComments(methodBody, functionComments)
            this.methodComments.push(functionComments)

        }
    }

    /**
     * To traverse the cst node to get all the comments inside the method body block.
     * @param {CstNode} ctx
     * @param {FunctionInnerComment[]} functionComments The result will be pushed in this list.
     */
    collectFunctionInnerComments(ctx, functionComments) {
        if (typeof ctx === 'object') {
            Object.keys(ctx).forEach(key => {
                if (key === 'leadingComments') {
                    ctx.leadingComments.forEach(leadingComment => functionComments.push(leadingComment))
                }
                else {
                    this.collectFunctionInnerComments(ctx[key], functionComments)
                }
            })
        }
        else if (Array.isArray(ctx)) {
            ctx.forEach(subCtx => this.collectFunctionInnerComments(subCtx, functionComments))
        }
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
        if (!countComment) {
            functionComments.forEach(comment => {
                const { startLine, endLine, image } = comment
                if (startLine !== endLine) {
                    lineCount = lineCount - (endLine - startLine + 1)
                }
                else if (image === lines[startLine - 1].trim()) {
                    lineCount = lineCount - 1
                }
            })
        }

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