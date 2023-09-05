export interface CountResult {
    functionName: string
    startLine: number
    endLine: number
    totalLineCount: number
    validLineCount: number
    commentLineCount: number
    blankLineCount: number
}