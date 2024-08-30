<script setup lang="ts">
import type { ISession } from '@/types'
import { useFetch } from '@composables/useFetch'
import { getCurrentTimeZone } from '@/utils'
import { useScrollPagination } from '@composables/useScrollPagination'

import SkTable from '@components/ui/SkTable.vue'

const props = defineProps<{
	query: Record<string, string>
}>()

const columns = [
	{
		name: 'Country',
		key: 'country'
	},
	{
		name: 'OS',
		key: 'os'
	},
	{
		name: 'Software',
		key: 'software'
	}
]

const { el: scrollContainer, items } = useScrollPagination<ISession>(() => useFetch("/api/sessions", {
	query: props.query,
	headers: {
		'x-timezone': getCurrentTimeZone()
	}
}))
</script>

<template>
	<section ref="scrollContainer">
		<SkTable 
			v-if="items"
			:data="items" 
			class="px-1"
			:columns="columns" 
		>
			<template #cell(country)="{ value }">
				<p class="flex ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>

			<template #cell(os)="{ value }">
				<p class="flex ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>

			<template #cell(software)="{ value }">
				<p class="flex ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>
		</SkTable>
	</section>
</template>