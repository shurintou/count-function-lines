<script setup lang="ts">
import { shallowRef, inject } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import type { EditorView } from 'codemirror'
import type { EditorState } from '@codemirror/state'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'

const { code } = useCounter()
const extensions = [javascript({ jsx: true, typescript: true }), vue(), java(), oneDark]
const view = shallowRef<EditorView>()
const state = shallowRef<EditorState>()
const handleReady = (payload: { view: EditorView, state: EditorState, container: HTMLDivElement }) => {
    view.value = payload.view
    state.value = payload.state
}
const isPcMode = inject(isPcModeKey, isPcModeRef)

</script>

<template>
    <codemirror v-model="code" placeholder="Input your code and count the lines."
        :style="{ height: isPcMode ? '650px' : '400px' }" :autofocus="isPcMode" :indent-with-tab="true" :tab-size="4"
        :extensions="extensions" @ready="handleReady" style="font-weight: bold;" />
</template>