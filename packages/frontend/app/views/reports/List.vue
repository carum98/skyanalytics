<script setup lang="ts">
import TableReports from '@components/reports/TableReports.vue'

const props = defineProps<{
	query?: Record<string, string>
	sourceCode: string
}>()

</script>

<template>
	<TableReports
		hide-source
		:query="{
			...props.query,
			['sources[code][equal]']: props.sourceCode
		}"
	></TableReports>
</template>