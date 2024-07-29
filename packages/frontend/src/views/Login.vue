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

        router.push({ name: 'home' })
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button>Login</button>
    </form>
</template>