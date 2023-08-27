export interface CountResult {
    functionName: string
    startPos: number
    endPos: number
    totalLineCount: number
    pureCodeLineCount: number
    commentLineCount: number
    blankLineCount: number
}