export interface CountResult {
    functionName: string
    startLine: number
    endLine: number
    totalLineCount: number
    lineCount: number
    commentLineCount: number
    blankLineCount: number
}

export type SupportLanguages = '.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java'