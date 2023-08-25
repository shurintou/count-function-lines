<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from './CodeEditor.vue';
const code = ref<string>('')
</script>

<template>
    <el-row style="margin-top: 5px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <CodeEditor />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="{ span: 11, offset: 1 }" :xl="{ span: 11, offset: 1 }">
            result
        </el-col>
    </el-row>
</template>
