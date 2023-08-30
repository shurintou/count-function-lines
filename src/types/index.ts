export interface CountResult {
    functionName: string
    startPos: number
    endPos: number
    totalLineCount: number
    validCodeLineCount: number
    commentLineCount: number
    blankLineCount: number
}

export type SupportLanguages = '.js' | '.jsx' | '.ts' | '.tsx' | '.vue' | '.java'