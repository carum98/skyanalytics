<script setup lang="ts">
import type { ISession } from '@shared/types'
import { getCurrentTimeZone } from '@/utils'
import { useScrollPagination } from '@composables/useScrollPagination'

import SkTable from '@components/ui/SkTable.vue'

const props = defineProps<{
	query: Record<string, string>
	sourceCode: string
}>()

const columns = [
	{
		name: 'Country',
		key: 'country',
		thClass: 'text-left'
	},
	{
		name: 'OS',
		key: 'os',
		thClass: 'text-left'
	},
	{
		name: 'Software',
		key: 'software',
		thClass: 'text-left'
	}
]

const { el: scrollContainer, items } = useScrollPagination<ISession>(["/api/sessions", {
	query: {
		...props.query,
		per_page: '25',
		['sources[code][equal]']: props.sourceCode,
	},
	headers: {
		'x-timezone': getCurrentTimeZone()
	}
}])
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