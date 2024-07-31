<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { $fetch } from '@/utils/fetch'

import SkPopover from '@components/SkPopover.vue'

const router = useRouter()

async function logOut() {
    await $fetch('/api/logout', { method: 'POST' })
    router.push({ name: 'login' })
}

onMounted(() => {
    const app = document.querySelector('#app')
    app?.setAttribute('data-layout', 'default')
})
</script>

<template>
    <header>
        <div class="flex align-center ga-1">
            <img src="/img/logo.avif" width="30" height="30" alt="SkyAnalytics" />
            <h1>SkyAnalytics</h1>
        </div>

        <SkPopover position="bottom span-left">
            <template #target="{ props }">
                <button class="dropdown_actions" v-bind="props">
                    <i class="icon-caret-down"></i>
                </button>
            </template>
            <template #popover="{ props }">
                <div class="sk-dropdown__options" v-bind="props">
                    <button @click="logOut">
                        <i class="icon-right-from-bracket"></i>
                        Cerrar sesión
                    </button>
                </div>
            </template>
        </SkPopover>
    </header>
    <main>
        <slot></slot>
    </main>
</template>