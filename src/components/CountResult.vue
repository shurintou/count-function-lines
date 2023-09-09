<script setup lang="ts">
import { inject, computed } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
import LanguageSelector from './LanguageSelector.vue'
import UploadButton from './UploadButton.vue'
import { type FunctionLineCountsResult } from 'count-function-lines'
import type { TableEvents, MouseMoveEventType } from '@/types/index'
const isPcMode = inject(isPcModeKey, isPcModeRef)

const { tableData, errorMsg, loading } = useCounter()
const commonStyle = computed(() =>
    ({ marginLeft: isPcMode.value ? '10px' : '', marginTop: isPcMode.value ? '' : '10px', marginBottom: isPcMode.value ? '10px' : '' })
)
const mouseMoveEventHandler = (rowData: FunctionLineCountsResult, eventType: MouseMoveEventType) => {
    emit(eventType, eventType, rowData.startLine, rowData.endLine)
}
const emit = defineEmits<TableEvents>()

</script>


<template>
    <el-space wrap alignment="flex-start">
        <UploadButton :style="commonStyle" />
        <LanguageSelector :style="commonStyle" />
    </el-space>

    <el-table v-loading="loading" element-loading-text="Counting..." :data="tableData" style="width: 100%;"
        :style="commonStyle" :maxHeight="590"
        @row-click="(rowData: FunctionLineCountsResult) => emit('clickResult', rowData.startLine)"
        @cell-mouse-enter="(rowData: FunctionLineCountsResult) => mouseMoveEventHandler(rowData, 'mouseEnter')"
        @cell-mouse-leave="(rowData: FunctionLineCountsResult) => mouseMoveEventHandler(rowData, 'mouseLeave')">
        <template #empty>
            <el-result v-if="errorMsg.length > 0" icon="error" title="Error happened!" :sub-title="errorMsg" />
            <el-result v-else-if="!loading" icon="warning" title="No result?"
                sub-title="Please check your code or change the file extension." />
            <span v-else></span>
        </template>
        <el-table-column align="center" sortable prop="functionName" label="name" />
        <el-table-column align="center" label="line count">
            <el-table-column align="center" sortable prop="totalLineCount" label="total" />
            <el-table-column align="center" sortable prop="validLineCount" label="valid" />
            <el-table-column align="center" sortable prop="commentLineCount" label="comment" :minWidth="100" />
            <el-table-column align="center" sortable prop="blankLineCount" label="blank" />
        </el-table-column>
        <el-table-column align="center" label="Position">
            <el-table-column align="center" sortable prop="startLine" label="start" />
            <el-table-column align="center" sortable prop="endLine" label="end" />
        </el-table-column>
    </el-table>
</template>