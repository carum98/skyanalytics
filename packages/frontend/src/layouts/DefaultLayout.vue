<script setup lang="ts">
import { ref, watch } from 'vue'
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
</script>

<template>
    <header>
        <h1>{{ title }}</h1>

        <button @click="logOut">
            Log Out
        </button>
    </header>
    <aside>
        <nav>
            <RouterLink :to="{ name: 'home' }">Home</RouterLink>
            <RouterLink :to="{ name: 'events' }">Events</RouterLink>
        </nav>
    </aside>
    <main>
        <slot></slot>
    </main>
</template>