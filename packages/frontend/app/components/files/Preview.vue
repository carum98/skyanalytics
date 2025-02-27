<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import type { IReport, IReportFile } from '@shared/types'
import Logs from '@components/files/Logs.vue'
import { onMounted, ref, useTemplateRef } from 'vue'

const { file, report } = defineProps<{
	report: IReport
	file: IReportFile
}>()

const img = useTemplateRef('img')
const data = ref<any>(null)

async function getFile() {
	return $fetch(`/api/reports/${report.code}/files/${file.name}`)
}

async function getData() {
	data.value = await getFile()

	if (file.type === 'image') {
		console.log(typeof data.value)
		const objectURL = URL.createObjectURL(data.value)

		img.value!.src = objectURL

		img.value!.onload = () => {
			URL.revokeObjectURL(objectURL)
		}
	}
}

async function dowloadFile(event: MouseEvent) {
	event.preventDefault()

	const button = event.target as HTMLButtonElement

	button.disabled = true

	const data = await getFile() as Blob

	const blob = new Blob([data])
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')

	a.href = url
	a.download = file.name
	a.click()

	URL.revokeObjectURL(url)

	button.disabled = false
}

onMounted(() => {
	if (file.type !== 'file') {
		getData()
	}
})
</script>

<template>
	<div class="files-preview">
		<img 
			v-if="file.type === 'image'" 
			ref="img"
			width="100%"
		/>
		<div v-else-if="file.name === 'logs.zip'">
			<Logs :report />
		</div>
		<div v-else-if="file.type === 'file'">
			<button 
				@click="dowloadFile"
				class="sk-button dowload-button"
			>
				Download
			</button>
		</div>
		<pre v-else>{{ data }}</pre>
	</div>
</template>

<style lang="css">
.files-preview {
	min-height: 400px;

	&:has(.dowload-button) {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	pre {
		white-space: pre-wrap;
		overflow: scroll;
		max-height: 80vh;
	}
}
</style>