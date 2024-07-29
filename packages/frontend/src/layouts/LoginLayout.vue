<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
    const app = document.querySelector('#app')
    app.setAttribute('data-layout', 'login')
})
</script>

<template>
    <main>
        <slot></slot>
    </main>
</template>