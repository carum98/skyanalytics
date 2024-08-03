<script setup lang="ts">
import type { ISources } from '@/types'
import { $fetch } from '@/utils/fetch'
import { reactive } from 'vue'

const props = defineProps<{
    item?: ISources
}>()

const emits = defineEmits<{
    close: []
    refresh: []
}>()

const form = reactive({
    name: props.item?.name || ''
})

async function send() {
    if (props.item) {
        await $fetch(`/api/sources/${props.item.code}`, {
            method: 'PUT',
            body: JSON.stringify(form)
        })
    } else {
        await $fetch('/api/sources', {
            method: 'POST',
            body: JSON.stringify(form)
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
            v-model="form.name" 
        />

        <button type="submit" class="sk-button">Save</button>
    </form>
</template>