import { ref, onMounted } from 'vue'
import { jsFuncCounter, type FunctionLineCountsResult } from 'count-function-lines'
import type { CountResult } from '@/types/index'
import { displayCode } from '@/configs/constant'
import { type SupportLanguages } from '@/types/index'

const code = ref<string>(displayCode)
const language = ref<SupportLanguages>('.js')
const tableData = ref<CountResult[]>([])

export function useCounter() {

    onMounted(() => {
        const countResults: FunctionLineCountsResult[] = jsFuncCounter(code.value)
        tableData.value = countResults.map(countResult => {
            const { startLine, endLine, lineCount } = countResult
            return {
                startPos: startLine,
                endPos: endLine,
                totalLineCount: endLine - startLine + 1,
                validCodeLineCount: lineCount,
                ...countResult
            }
        })
    })

    return { code, language, tableData }
}