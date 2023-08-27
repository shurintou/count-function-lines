<script setup lang="ts">
import CodeEditor from './CodeEditor.vue';
import CountResult from './CountResult.vue'
</script>

<template>
    <el-row style="margin-top: 5px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <CodeEditor />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="{ span: 12 }" :xl="{ span: 12 }">
            <CountResult />
        </el-col>
    </el-row>
</template>
