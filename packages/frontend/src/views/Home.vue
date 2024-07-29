<script setup lang="ts">
import { $fetch } from '@/utils/fetch'

async function getData() {
	try {
		const response = await $fetch('/api/sources')
		console.log(response)
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
    <h1>Home</h1>
    <button @click="getData">
        Sources
    </button>
</template>