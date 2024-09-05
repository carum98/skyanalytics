<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import { computed } from 'vue'

const props = defineProps<{
	path: string
	code: string
	name: string
	message?: string
}>()

const emits = defineEmits<{
    close: []
    refresh: []
}>()

const text = computed(() => {
	if (props.message && props.message.includes(':name')) {
		return props.message.replace(':name', props.name)
	} else {
		return `Remove ${props.name}?`
	}
})

async function onRemove() {
	const path = props.path.replace(':code', props.code)

    await $fetch(path, {
        method: 'DELETE'
    })

    emits('refresh')
    emits('close')
}
</script>

<template>
    <svg width="48" height="48" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Z"/>
    </svg>

    <p>{{ text }}</p>

    <div class="d-flex-center">
        <button class="sk-button sk-button--transparent" @click="$emit('close')">
            Cancel
        </button>
        <button class="sk-button" @click="onRemove">
            Remove
        </button>
    </div>
</template>

<style scoped>
svg {
    margin: auto;
    display: block;
    color: red;
}

p {
    text-align: center;
    font-size: 1.5rem;
    margin: 1rem 0;
    color: var(--text-color);
}
</style>