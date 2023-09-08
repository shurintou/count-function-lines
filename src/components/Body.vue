<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from './CodeEditor.vue'
import CountResult from './CountResult.vue'
import type { MouseMoveEventType } from '@/types/index'
const codeEditor = ref<InstanceType<typeof CodeEditor> | null>(null)
const mouseMoveEventHandler = (eventType: MouseMoveEventType, startLine: number, endLine: number) => codeEditor?.value?.mouseMoveEventHandler(eventType, startLine, endLine)
</script>

<template>
    <el-row style="margin-top: 5px; margin-right:5px">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <CodeEditor ref="codeEditor" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="{ span: 12 }" :xl="{ span: 12 }">
            <CountResult @mouseEnter="mouseMoveEventHandler" @mouseLeave="mouseMoveEventHandler"
                @clickResult="(startLine: number) => codeEditor?.scrollToLine(startLine)" />
        </el-col>
    </el-row>
</template>
