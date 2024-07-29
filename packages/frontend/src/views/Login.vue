<script setup lang="ts">
import { $fetch } from '@/utils/fetch'

async function onSubmit(event: Event) {
    try {
        const formData = new FormData(event.target as HTMLFormElement)

        await $fetch('/api/login', {
            method: 'POST',
            body: formData,
        })
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