const fs = require('fs')
const { parse, BaseJavaCstVisitorWithDefaults } = require("java-parser")

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
        this.methodNames = []
        this.methodLocations = []
        this.methodComments = []
    }

    methodHeader(ctx) {
        this.methodNames.push(ctx.methodDeclarator[0].children.Identifier[0].image)
    }

    methodBody(ctx) {
        this.block(ctx)
    }

    block(ctx) {
        this.children(ctx.block[0])
    }

    children(ctx) {
        this.methodLocations.push(ctx.location)
        this.blockStatements(ctx.children?.blockStatements[0])
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
    const visitor = new MethodVisitor()
    /** 
     * @type {FunctionLineCountsResult[]}
     */
    let functionLineCountsResult = []
    visitor.visit(cst)
    visitor.methodNames.forEach((name, index) => {
        const { startLine, endLine } = visitor.methodLocations[index]
        functionLineCountsResult.push({
            functionName: name,
            lineCount: endLine - startLine + 1,
            startLine: startLine,
            endLine: endLine,
        })
    })
    return functionLineCountsResult
}

module.exports.javaFuncCounterHandler = javaFuncCounterHandler