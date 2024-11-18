<script setup lang="ts">
const props = defineProps<{
	text: string
}>()

const emits = defineEmits<{
    confirm: []
	close: []
}>()

function onConfirm() {
	emits('confirm')
	emits('close')
}
</script>

<template>
	<svg width="48" height="48" viewBox="0 0 24 24">
		<path fill="currentColor" fill-rule="evenodd" d="M9.616 3.642c1.058-1.839 3.71-1.839 4.768 0l8.043 13.988c1.054 1.833-.27 4.12-2.384 4.12H3.957c-2.115 0-3.438-2.287-2.384-4.12zM12 8.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75m.568 9.25a.75.75 0 0 0-1.115-1.003l-.01.011a.75.75 0 0 0 1.114 1.004z" clip-rule="evenodd"/>
	</svg>

    <p>{{ text }}</p>

    <div class="d-flex-center">
        <button class="sk-button sk-button--transparent" @click="$emit('close')">
            Cancel
        </button>
        <button class="sk-button" @click="onConfirm">
            Confirm
        </button>
    </div>
</template>

<style scoped>
svg {
    margin: auto;
    display: block;
    color: orange;
}

p {
    text-align: center;
    font-size: 1.5rem;
    margin: 1rem 0;
    color: var(--text-color);
}
</style>