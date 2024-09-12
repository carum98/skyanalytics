<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import { useRouter } from 'vue-router'

const router = useRouter()

async function onSubmit(event: Event) {
    try {
        const formData = new FormData(event.target as HTMLFormElement)

        await $fetch('/api/login', {
            method: 'POST',
            body: formData,
        })

        const url = router.resolve({ name: 'home' }).fullPath
        window.location.replace(url)
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <form class="sk-form" @submit.prevent="onSubmit">
        <img src="/img/logo.avif" width="80" height="80" alt="Logo" />

        <label>
            Correo
        </label>
        <input 
            class="sk-input"
            type="email" 
            name="email"
            placeholder="Correo" 
        />

        <label>
            Contraseña
        </label>
        <input 
            class="sk-input"
            type="password"
            name="password"
            placeholder="Contraseña" 
        />
        
        <button type="submit" class="sk-button block">
            Iniciar sesión
        </button>
    </form>
</template>