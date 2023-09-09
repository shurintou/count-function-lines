<script setup lang="ts">
import { shallowRef, inject, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from 'codemirror'
import { ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'

const { code } = useCounter()
const extensions = [javascript({ jsx: true, typescript: true }), vue(), java(), oneDark]
const view = shallowRef<EditorView>()
const state = shallowRef<EditorState>()
const container = ref<HTMLElement>()
const contentHeight = ref<number>(0)
const lineHeight = ref<number>(0)
const handleReady = (payload: { view: EditorView, state: EditorState, container: HTMLDivElement }) => {
    view.value = payload.view
    state.value = payload.state
    container.value = payload.view.scrollDOM
    contentHeight.value = payload.view.contentHeight
    lineHeight.value = payload.view.defaultLineHeight
}
const isPcMode = inject(isPcModeKey, isPcModeRef)

const scrollToLine = (startline: number) => {
    if (container.value) {
        const domStartLine = startline - 1
        // There is no proper API for line binding so the following code is a workaround.
        container.value.scrollTo({ behavior: 'smooth', top: domStartLine * lineHeight.value })
    }
}

const mouseMoveEventHandler = (eventType: string, startline: number, endLine: number) => {
    // There is no proper API for line binding so the following code is a workaround.
    if (container.value) {
        const domStartLine = startline - 1
        const domEndLine = endLine - 1
        const lineDOMs = container.value.getElementsByClassName('cm-line') as HTMLCollectionOf<HTMLDivElement>
        const lineBlocks = view.value?.viewportLineBlocks
        if (lineBlocks) {
            lineBlocks.forEach((lineBlock, index) => lineDOMs[index].classList.remove('cm-activeLine'))
            const displayingDomStartLine = lineBlocks.findIndex(lineBlock => lineBlock.top > (domStartLine * lineHeight.value))
            const displayingDomEndLine = lineBlocks.findIndex(lineBlock => lineBlock.top > (domEndLine * lineHeight.value))
            for (let i = (displayingDomStartLine === -1 ? lineBlocks.length : displayingDomStartLine); i <= (displayingDomEndLine === -1 ? lineBlocks.length : displayingDomEndLine); i++) {
                if (eventType === 'mouseEnter') {
                    lineDOMs[i - 1]?.classList.add('cm-activeLine')
                }
            }
        }
    }
}

const updateHandler = (newViewState: ViewUpdate) => {
    view.value = newViewState.view
    state.value = newViewState.state
    contentHeight.value = newViewState.view.contentHeight
    lineHeight.value = newViewState.view.defaultLineHeight
    container.value = newViewState.view.scrollDOM
}

defineExpose({
    scrollToLine,
    mouseMoveEventHandler
})
</script>

<template>
    <codemirror v-model="code" placeholder="Input your code and count the lines."
        :style="{ height: isPcMode ? '650px' : '400px' }" :autofocus="isPcMode" :indent-with-tab="true" :tab-size="4"
        :extensions="extensions" @ready="handleReady" @update="updateHandler" style="font-weight: bold;" />
</template>