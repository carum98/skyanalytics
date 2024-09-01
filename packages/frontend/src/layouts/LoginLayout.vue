<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
    const app = document.querySelector('#app')
    app?.setAttribute('data-layout', 'login')
})
</script>

<template>
    <main>
        <slot></slot>
    </main>
    <footer>
        <p>Plaforna para uso interno de <a href="https://skydatalatam.com" target="_blank">SkyData</a></p>
        <p>Desarrollado por <a href="https://carum.dev" target="_blank">Carlos Umaña</a></p>
    </footer>
</template>