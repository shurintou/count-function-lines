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
            return { totalLineCount: countResult.endLine - countResult.startLine + 1, ...countResult }
        })
    })

    return { code, language, tableData }
}