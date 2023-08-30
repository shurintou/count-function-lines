<script setup lang="ts">
import { inject } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { useCounter } from '@/utils/counter'
const isPcMode = inject(isPcModeKey, isPcModeRef)
import { languageOptions } from '@/configs/constant'

const uploadTip = 'Support languages: ' + languageOptions.join(',')
</script>

<template>
    <el-upload ref="upload" class="upload-demo" action="" :limit="1" :auto-upload="false">
        <template #trigger>
            <el-button type="primary" :size="isPcMode ? 'large' : 'small'">upload file</el-button>
        </template>
    </el-upload>
</template>