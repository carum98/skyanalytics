<script setup lang="ts">
import type { IEvent } from '@/types'
import { getCurrentTimeZone, formatDate } from '@/utils'
import { useScrollPagination } from '@composables/useScrollPagination'

import SkTable from '@ui/SkTable.vue'

const columns = [
	{
		name: 'Date',
		key: 'created_at',
		thClass: 'text-left'
	},
	{
		name: 'Name',
		key: 'name',
		thClass: 'text-left'
	},
	{
		name: 'Country',
		key: 'session.country',
	},
	{
		name: 'OS',
		key: 'session.os',
	},
	{
		name: 'Software',
		key: 'session.software',
	}
]

const props = defineProps<{
	query: Record<string, string>
}>()

const { el: scrollContainer, items } = useScrollPagination<IEvent>(["/api/events", {
	query: props.query,
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
			:columns="columns"
			class="px-1"
		>
			<template #cell(created_at)="{ value }">
				<p class="text-gray">{{ formatDate(value as string) }}</p>
			</template>

			<template #cell(session.country)="{ value }">
				<p class="flex justify-center ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>

			<template #cell(session.os)="{ value }">
				<p class="flex justify-center ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>

			<template #cell(session.software)="{ value }">
				<p class="flex justify-center ga-05">
					<i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
				</p>
			</template>
		</SkTable>
	</section>
</template>