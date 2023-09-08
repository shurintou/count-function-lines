<script setup lang="ts">
import { shallowRef, inject, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'

const { code } = useCounter()
const extensions = [javascript({ jsx: true, typescript: true }), vue(), java(), oneDark]
const view = shallowRef<EditorView>()
const state = shallowRef<EditorState>()
const container = ref<HTMLDivElement>()
const handleReady = (payload: { view: EditorView, state: EditorState, container: HTMLDivElement }) => {
    view.value = payload.view
    state.value = payload.state
    container.value = payload.container
}
const isPcMode = inject(isPcModeKey, isPcModeRef)

const scrollToLine = (startline: number) => {
    if (container.value) {
        const domStartLine = startline - 1
        const lineDOMs = container.value.getElementsByClassName('cm-line')
        lineDOMs[domStartLine].scrollIntoView({ behavior: 'smooth' })
    }
}

const mouseMoveEventHandler = (eventType: string, startline: number, endLine: number) => {
    if (container.value) {
        const domStartLine = startline - 1
        const domEndLine = endLine - 1
        const lineDOMs = container.value.getElementsByClassName('cm-line')
        for (let i = domStartLine; i <= domEndLine; i++) {
            if (eventType === 'mouseEnter') {
                lineDOMs[i].classList.add('cm-activeLine')
            }
            else {
                lineDOMs[i].classList.remove('cm-activeLine')
            }
        }
    }
}

defineExpose({
    scrollToLine,
    mouseMoveEventHandler
})
</script>

<template>
    <codemirror v-model="code" placeholder="Input your code and count the lines."
        :style="{ height: isPcMode ? '650px' : '400px' }" :autofocus="isPcMode" :indent-with-tab="true" :tab-size="4"
        :extensions="extensions" @ready="handleReady" style="font-weight: bold;" />
</template>