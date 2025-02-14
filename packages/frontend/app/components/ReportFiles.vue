<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import type { IReport, IReportFile } from '@shared/types'

const { item } = defineProps<{
	item: IReport
}>()

const { data } = useFetch<IReportFile[]>(`/api/reports/${item.code}/files`)

function formatSize(size: number) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']

	let i = 0
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024
		i++
	}

	return `${size.toFixed(2)} ${units[i]}`
}
</script>

<template>
	<div class="report-files">
		<button v-for="item in data" :key="item.file">
			<p class="text-overflow">{{ item.file }}</p>
			<small>{{ formatSize(item.size) }}</small>
		</button>
	</div>
</template>

<style lang="css">
.report-files {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;

	button {
		font-size: 16px;
		background-color: var(--background-color);
		border-radius: 10px;
		padding: 10px 15px;

		text-align: left;
	}
}
</style>