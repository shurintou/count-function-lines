<script setup>
/* This is a vue3 file. */
import { ref } from 'vue'

const count = ref(0)

function increment() {
    // line comment
    count.value++
}
</script>

<template>
    <button @click="increment">
        {{ count }}
    </button>
</template>