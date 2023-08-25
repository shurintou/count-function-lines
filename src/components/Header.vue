<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { isDark } from '@/utils/darkMode'
</script>

<template>
    <el-row>
        <el-col :xs="21" :sm="22" :md="22" :lg="23" :xl="23">
            <span :style="`font-size: var(--el-font-size-extra-large)`">Count-function-lines</span>
        </el-col>
        <el-col :xs="3" :sm="2" :md="2" :lg="1" :xl="1">
            <el-switch v-model="isDark" style="--el-switch-on-color: #909399; --el-switch-off-color: #409EFF"
                :active-action-icon="Moon" :inactive-action-icon="Sunny" />
        </el-col>
    </el-row>
    <el-divider style="margin: 5px;" />
</template>