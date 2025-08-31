<script setup lang="ts">
import TableReports from '@components/reports/TableReports.vue'

import { useSidebar } from '@composables/useSidebar'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { $fetch } from '@/utils/fetch'
import type { IReport } from '@shared/types'

const sidebar = useSidebar()
const route = useRoute()

onMounted(async () => {
	const code = route.query.code

	if (code) {
		const item = await $fetch<IReport>(`/api/reports/${code}`)

		if (item) {
			sidebar.push({
				name: 'reports.profile',
				props: { item },
			})
		}
	}
})
</script>

<template>
	<section>
		<TableReports />
	</section>
</template>