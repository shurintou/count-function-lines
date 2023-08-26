import { createApp, ref, computed } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import { windowWidthKey, gridTypeKey, isPcModeKey, isSpModeKey } from '@/types/inject'
import { windowWidthConstant } from '@/configs/constant'
import { throttle } from '@/utils/common'

const app = createApp(App)

export const windowWidthRef = ref(window.innerWidth)
const { smWidth, mdWidth, lgWidth, xlWidth } = windowWidthConstant

export const gridTypeRef = computed(() => {
    const { value } = windowWidthRef
    if (value < smWidth) {
        return 'xs'
    }
    else if (value < mdWidth) {
        return 'sm'
    }
    else if (value < lgWidth) {
        return 'md'
    }
    else if (value < xlWidth) {
        return 'lg'
    }
    return 'xl'
})

export const isPcModeRef = computed(() => windowWidthRef.value >= lgWidth)

export const isSPModeRef = computed(() => windowWidthRef.value < lgWidth)

window.addEventListener('resize', throttle(() => {
    windowWidthRef.value = window.innerWidth
}))

app.provide(windowWidthKey, windowWidthRef)
app.provide(gridTypeKey, gridTypeRef)
app.provide(isPcModeKey, isPcModeRef)
app.provide(isSpModeKey, isSPModeRef)

app.use(ElementPlus)
app.mount('#app')