const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const jsFuncCount = function (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const isModule = fileContent.includes('import') || fileContent.includes('export');

    const ast = parser.parse(fileContent, {
        sourceType: isModule ? 'module' : 'script',
        tokens: true,
        ranges: true,
        comments: true, // enable comments parsing
    });

    const functionLineCountsResult = {};

    traverse(ast, {
        enter(path) {
            // Skip comment nodes
            if (path.node.type === 'Comment') {
                path.skip();
                return;
            }

            if (path.isFunctionDeclaration()) {
                const functionName = path.node.id.name;
                const { start, end } = path.node.loc;
                countLines(start.line, end.line, functionName);
            } else if (path.isVariableDeclaration()) {
                const declaration = path.node.declarations[0];
                if (
                    declaration &&
                    (declaration.init?.type === 'FunctionExpression' ||
                        declaration.init?.type === 'ArrowFunctionExpression')
                ) {
                    const functionName = declaration.id.name;
                    const { start, end } = declaration.init.body.loc;
                    countLines(start.line, end.line, functionName);
                }
            } else if (path.isProperty()) {
                const value = path.node.value;
                if (
                    value &&
                    (value.type === 'FunctionExpression' ||
                        value.type === 'ArrowFunctionExpression')
                ) {
                    const functionName = path.node.key.name;
                    const { start, end } = value.body.loc;
                    countLines(start.line, end.line, functionName);
                }
            }
        },
    });

    function countLines(startLine, endLine, functionName) {
        if (!functionLineCountsResult.hasOwnProperty(functionName)) {
            let lineCount = 0;
            for (let i = startLine - 1; i < endLine; i++) {
                const lineStr = fileContent.split('\n')[i].trim();
                if (lineStr !== '') {
                    lineCount++;
                }
            }
            functionLineCountsResult[functionName] = lineCount;
        }
    }

    return functionLineCountsResult;
};

module.exports = jsFuncCount;
