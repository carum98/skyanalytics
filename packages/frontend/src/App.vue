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
  	<main>
		<RouterView />

		<button @click="getData">
			Sources
		</button>
  	</main>
</template>
