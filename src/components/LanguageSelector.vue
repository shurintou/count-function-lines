<script setup lang="ts">
import { inject } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
import { supportFileExtensions } from 'count-function-lines'
const isPcMode = inject(isPcModeKey, isPcModeRef)
const { language, loading } = useCounter()
</script>

<template>
    <el-select v-model="language" placeholder="select the language" :size="isPcMode ? 'large' : 'small'" :disabled="loading"
        :style="{ width: isPcMode ? '200px' : '160px' }">
        <el-option v-for="item in supportFileExtensions" :key="item" :label="item" :value="item" />
        <template #prefix>
            read code as
        </template>
    </el-select>
</template>