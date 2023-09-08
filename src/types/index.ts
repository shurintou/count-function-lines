export interface CountResult {
    functionName: string
    startLine: number
    endLine: number
    totalLineCount: number
    validLineCount: number
    commentLineCount: number
    blankLineCount: number
}

export type MouseMoveEventType = 'mouseEnter' | 'mouseLeave'

export interface TableEvents {
    (e: MouseMoveEventType, eventType: MouseMoveEventType, startLine: number, endLine: number): void
    (e: 'clickResult', startLine: number): void
}