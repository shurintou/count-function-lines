<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import type { EditorView } from 'codemirror'
import type { EditorState } from '@codemirror/state'

const code = ref(`console.log('Hello, world!')`)
const extensions = [javascript({ jsx: true, typescript: true }), vue(), java(), oneDark]
const view = shallowRef<EditorView>()
const handleReady = (payload: { view: EditorView, state: EditorState, container: HTMLDivElement }) => view.value = payload.view

</script>

<template>
    <codemirror v-model="code" placeholder="Input your code..." :style="{ height: '400px' }" :autofocus="true"
        :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" style=" font-weight: bold;"
        @change="console.log('change', $event)" @focus="console.log('focus', $event)" @blur="console.log('blur', $event)" />
</template>