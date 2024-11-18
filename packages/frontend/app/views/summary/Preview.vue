<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import { ref } from 'vue';

const html = ref('')

async function getData() {
	html.value = await $fetch('/api/tasks-scheduler/SummaryTask/run', {
		method: 'POST',
		query: { onlyHtml: 'true' },
		headers: { 'Content-Type': 'text/html' },
	})
}

getData()
</script>

<template>
	<div v-html="html"></div>
</template>