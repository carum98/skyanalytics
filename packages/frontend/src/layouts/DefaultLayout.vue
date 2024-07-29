<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from '@/utils/fetch'

const title = ref('')
const route = useRoute()
const router = useRouter()

watch(() => route.fullPath, () => {
    title.value = route.meta.title || 'Default Title'
}, { immediate: true })

async function logOut() {
    await $fetch('/api/logout', { method: 'POST' })
    router.push({ name: 'login' })
}

onMounted(() => {
    const app = document.querySelector('#app')
    app.setAttribute('data-layout', 'default')
})
</script>

<template>
    <header>
        <h1>{{ title }}</h1>

        <button @click="logOut">
            Log Out
        </button>
    </header>
    <main>
        <slot></slot>
    </main>
</template>