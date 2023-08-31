<script setup lang="ts">
import { inject, computed } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
import LanguageSelector from './LanguageSelector.vue'
import UploadButton from './UploadButton.vue'
const isPcMode = inject(isPcModeKey, isPcModeRef)

const { tableData, errorMsg, loading } = useCounter()
const commonStyle = computed(() =>
    ({ marginLeft: isPcMode.value ? '10px' : '', marginTop: isPcMode.value ? '' : '10px', marginBottom: isPcMode.value ? '10px' : '' })
)
</script>


<template>
    <el-space wrap alignment="flex-start">
        <UploadButton :style="commonStyle" />
        <LanguageSelector :style="commonStyle" />
    </el-space>

    <el-table v-loading="loading" element-loading-text="Counting..." :data="tableData" style="width: 100%;"
        :style="commonStyle">
        <template #empty>
            <el-result v-if="errorMsg.length > 0" icon="error" title="Error happened!" :sub-title="errorMsg" />
        </template>
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