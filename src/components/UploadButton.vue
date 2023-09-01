<script setup lang="ts">
import { ref, inject } from 'vue'
import { isPcModeRef } from '@/main'
import { isPcModeKey } from '@/types/inject'
import { Upload } from '@element-plus/icons-vue'
import { unSupportedFileExtensionError } from '@/configs/constant'
import { useCounter } from '@/utils/counter'
import { supportFileExtensions, type SupportFileExtensions } from 'count-function-lines'
import type { UploadInstance, UploadFile, UploadFiles, UploadProps } from 'element-plus'

const isPcMode = inject(isPcModeKey, isPcModeRef)
const uploadRef = ref<UploadInstance>()
const { code, errorMsg, language, loading, tableData } = useCounter()

const uploadFileHandler: UploadProps['onChange'] = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    try {
        const rawData = uploadFile.raw
        if (rawData) {
            const fileName = rawData.name
            const fileExtension = fileName.substring(fileName.lastIndexOf('.'), fileName.length) as SupportFileExtensions
            if (supportFileExtensions.includes(fileExtension)) {
                rawData.text().then(readCode => code.value = readCode)
                language.value = fileExtension
            }
            else {
                tableData.value = []
                errorMsg.value = unSupportedFileExtensionError
            }
        }
    }
    catch (e) {
        if (e instanceof Error) errorMsg.value = e.message
    }

}

const clearFile = () => uploadRef.value?.clearFiles()
</script>

<template>
    <el-upload ref="uploadRef" :show-file-list="false" :limit="1" :auto-upload="false" :disabled="loading"
        :on-change="uploadFileHandler">
        <template #trigger>
            <el-button type="primary" :size="isPcMode ? 'large' : 'small'" :disabled="loading" @click="clearFile">upload
                code
                <el-icon class="el-icon--right">
                    <Upload />
                </el-icon>
            </el-button>
        </template>
    </el-upload>
</template>