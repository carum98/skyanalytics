<script setup lang="ts">
import type { ISources } from '@/types'
import { $fetch } from '@/utils/fetch'

const props = defineProps<{
    item?: ISources
}>()

const emits = defineEmits<{
    close: []
    refresh: []
}>()

async function send(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement)

    // Remove empty fields
    for (const [key, value] of formData.entries()) {
        if (!value) {
            formData.delete(key)
        }
    }

    if (props.item) {
        await $fetch(`/api/sources/${props.item.code}`, {
            method: 'PUT',
            body: formData,
        })
    } else {
        await $fetch('/api/sources', {
            method: 'POST',
            body: formData,
        })
    }

    emits('refresh')
    emits('close')
}
</script>

<template>
    <form class="sk-form" @submit.prevent="send">
        <label required>Name</label>
        <input 
            type="text" 
            class="sk-input"
            placeholder="Nombre"
            autofocus
            required
            minlength="3"
            maxlength="50"
            name="name"
            :value="props.item?.name"
        />

        <label>Domain</label>
        <input 
            type="text" 
            class="sk-input"
            placeholder="Dominio"
            name="domain"
            :value="props.item?.domain"
        />

        <label>Icon</label>
        <input 
            type="file" 
            class="sk-input"
            name="icon"
            accept="image/*"
        />

        <button type="submit" class="sk-button">Save</button>
    </form>
</template>