import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { getFuncCounter, type FunctionLineCountsResult } from 'count-function-lines'
import type { CountResult } from '@/types/index'
import { displayCode } from '@/configs/constant'
import { type SupportLanguages } from 'count-function-lines'
import { throttle } from '@/utils/common'

const code = ref<string>(displayCode)
const loading = ref<boolean>(true)
const errorMsg = ref<string>('')
const language = ref<SupportLanguages>('.js')
const tableData = ref<CountResult[]>([])

export function useCounter() {
    const counter = computed(() => getFuncCounter(language.value))

    onMounted(() => countFunctionLine())
    watch(counter, () => countFunctionLine())
    watch(code, () => countFunctionLine())


    const countFunctionLine = () => {
        loading.value = true
        throttle(async () => {
            let countResultList: FunctionLineCountsResult[] = []
            try {
                if (counter.value) {
                    countResultList = counter.value(code.value)
                    errorMsg.value = ''
                }
                else {
                    countResultList = []
                    errorMsg.value = 'unsupported file extension.'
                }
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