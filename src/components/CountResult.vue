<script setup lang="ts">
import { inject } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
const isPcMode = inject(isPcModeKey, isPcModeRef)

const { language, tableData } = useCounter()
</script>


<template>
    <el-table :data="tableData" style="width: 100%;"
        :style="{ marginLeft: isPcMode ? '10px' : '', marginTop: isPcMode ? '' : '10px' }">
        <el-table-column sortable prop="functionName" label="name" />
        <el-table-column label="Position">
            <el-table-column sortable prop="startLine" label="start" />
            <el-table-column sortable prop="endLine" label="end" />
        </el-table-column>
        <el-table-column label="line count">
            <el-table-column sortable prop="totalLineCount" label="total" />
            <el-table-column sortable prop="lineCount" label="valid" />
            <el-table-column sortable prop="commentLineCount" label="comment" :minWidth="100" />
            <el-table-column sortable prop="blankLineCount" label="blank" />
        </el-table-column>
    </el-table>
</template>