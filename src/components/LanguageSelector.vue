<script setup lang="ts">
import { inject } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
import { languageOptions } from '@/configs/constant'
const isPcMode = inject(isPcModeKey, isPcModeRef)

const { language } = useCounter()
</script>

<template>
    <el-select v-model="language" placeholder="select the language" :size="isPcMode ? 'large' : 'small'"
        style="width:100px">
        <el-option v-for="item in languageOptions" :key="item" :label="item" :value="item" />
    </el-select>
</template>