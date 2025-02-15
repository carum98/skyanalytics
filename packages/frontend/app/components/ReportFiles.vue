<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import type { IReport, IReportFile } from '@shared/types'

const { report } = defineProps<{
	report: IReport
}>()

const { data } = useFetch<IReportFile[]>(`/api/reports/${report.code}/files`)

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
		<button 
			v-for="item in data" 
			:key="item.name"
			v-dialog="{ name: 'files.preview', props: { report: report, file: item } }"
		>
			<p class="text-overflow">{{ item.name }}</p>
			<small>{{ formatSize(item.size) }}</small>
		</button>
	</div>
</template>

<style lang="css">
.report-files {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
	padding: 10px 0;

	button {
		font-size: 15px;
		background-color: var(--background-color);
		border-radius: 10px;
		padding: 5px 15px;

		text-align: left;

		small {
			color: gray;
			font-size: 13px;
		}
	}
}
</style>