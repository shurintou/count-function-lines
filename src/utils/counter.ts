import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { jsFuncCounter, vueFuncCounter, javaFuncCounter, type FunctionLineCountsResult } from 'count-function-lines'
import type { CountResult } from '@/types/index'
import { displayCode } from '@/configs/constant'
import { type SupportLanguages } from '@/types/index'
import { throttle } from '@/utils/common'

const code = ref<string>(displayCode)
const loading = ref<boolean>(true)
const errorMsg = ref<string>('')
const language = ref<SupportLanguages>('.js')
const tableData = ref<CountResult[]>([])

export function useCounter() {
    const counter = computed(() => {
        if (['.js', '.jsx', '.ts', '.tsx'].includes(language.value)) {
            return jsFuncCounter
        }
        else if (language.value === '.vue') {
            return vueFuncCounter
        }
        else if (language.value === '.java') {
            return javaFuncCounter
        }
        return jsFuncCounter
    })

    onMounted(() => countFunctionLine())
    watch(counter, () => countFunctionLine())
    watch(code, () => countFunctionLine())


    const countFunctionLine = () => {
        loading.value = true
        throttle(async () => {
            let countResultList: FunctionLineCountsResult[] = []
            try {
                countResultList = counter.value(code.value)
                errorMsg.value = ''
            }
            catch (e) {
                if (e instanceof Error) errorMsg.value = e.message
            }
            tableData.value = countResultList.map(countResult => {
                return { totalLineCount: countResult.endLine - countResult.startLine + 1, ...countResult }
            })
            await nextTick()
            loading.value = false
        })()
    }

    return { code, errorMsg, language, loading, tableData }
}