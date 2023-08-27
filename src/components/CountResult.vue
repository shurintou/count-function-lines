<script setup lang="ts">
import { ref, inject } from 'vue'
import type { CountResult } from '@/types/index'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
const isPcMode = inject(isPcModeKey, isPcModeRef)

const tableData = ref<CountResult[]>([
    { functionName: 'abc', startPos: 1, endPos: 5, totalLineCount: 6, pureCodeLineCount: 5, commentLineCount: 3, blankLineCount: 2 },
    { functionName: 'bce', startPos: 4, endPos: 10, totalLineCount: 12, pureCodeLineCount: 4, commentLineCount: 6, blankLineCount: 6 },
    { functionName: 'abe', startPos: 3, endPos: 12, totalLineCount: 13, pureCodeLineCount: 3, commentLineCount: 9, blankLineCount: 4 },
    { functionName: 'cbc', startPos: 5, endPos: 20, totalLineCount: 14, pureCodeLineCount: 9, commentLineCount: 15, blankLineCount: 8 },
    { functionName: 'dbc', startPos: 2, endPos: 15, totalLineCount: 10, pureCodeLineCount: 5, commentLineCount: 1, blankLineCount: 10 },
])
</script>


<template>
    <el-table :data="tableData" style="width: 100%;"
        :style="{ marginLeft: isPcMode ? '10px' : '', marginTop: isPcMode ? '' : '10px' }">
        <el-table-column sortable prop="functionName" label="name" />
        <el-table-column label="Position">
            <el-table-column sortable prop="startPos" label="start" />
            <el-table-column sortable prop="endPos" label="end" />
        </el-table-column>
        <el-table-column label="line count">
            <el-table-column sortable prop="totalLineCount" label="total" />
            <el-table-column sortable prop="pureCodeLineCount" label="code" />
            <el-table-column sortable prop="commentLineCount" label="comment" :minWidth="100" />
            <el-table-column sortable prop="blankLineCount" label="blank" />
        </el-table-column>
    </el-table>
</template>