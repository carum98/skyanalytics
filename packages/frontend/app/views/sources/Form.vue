<script setup lang="ts">
import SkSelect from '@/components/ui/SkSelect.vue'
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
    const data = Array
        .from(new FormData(event.target as HTMLFormElement))
        .filter(([k, v]) => v);

    const formData = new FormData()
    data.forEach(([k, v]) => formData.append(k, v))

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
            placeholder="Name"
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
            placeholder="Domain"
            name="domain"
            :value="props.item?.domain"
        />

        <label>Type</label>
        <SkSelect
            name="type"
            placeholder="Type"
            :value="props.item?.type"
            :options="[
                { name: 'App', value: 'app' },
                { name: 'Web', value: 'web' },
            ]"
        ></SkSelect>

        <!-- <label>Icon</label>
        <input 
            type="file" 
            class="sk-input"
            name="icon"
            accept="image/*"
        /> -->

        <button type="submit" class="sk-button">Save</button>
    </form>
</template>