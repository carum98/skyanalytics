<script setup lang="ts">
import SkTable from '@ui/SkTable.vue'
import SkPopover from '@ui/SkPopover.vue'
import SkPagination from '@ui/SkPagination.vue'
import SourceAvatar from '@components/SourceAvatar.vue'

import { getCurrentTimeZone, timeAgo } from '@/utils'
import { useFetch } from '@composables/useFetch'
import type { IReportPagination, IReport } from '@shared/types'
import { useSidebar } from '@/composables/useSidebar'

import { computed, ref } from 'vue'

const sidebar = useSidebar()
const page = ref(1)

const { query, hideSource } = defineProps<{
	query?: Record<string, string>
	hideSource?: boolean
}>()

const { data, refresh: onRefresh } = useFetch<IReportPagination>('/api/reports', {
	query: {
		...query,
		page: computed(() => page.value.toString()),
	},
	headers: {
		'x-timezone': getCurrentTimeZone()
	}
})

const columns = [
	{
		name: 'Description',
		key: 'description',
		thClass: 'text-left',
		width: '40%'
	},
	{
		name: 'Project',
		key: 'source',
		thClass: 'text-left',
		tdClass: 'flex align-center ga-1',
	},
	{
		name: 'Date',
		key: 'created_at',
		thClass: 'text-center',
		tdClass: 'text-center',
		width: '170px'
	},
	{
		name: 'Reported By',
		key: 'user.name',
		width: '200px'
	},
	{
		name: 'Status',
		key: 'status',
		width: '100px'
	},
	// {
	// 	name: '',
	// 	key: 'actions',
	// 	width: '30px'
	// }
]

function onRowClick(item: IReport) {
	sidebar.push({
		name: 'reports.profile',
		props: { item },
		listeners: { onRefresh }
	})
}

if (hideSource) {
	const sourceIndex = columns.findIndex(column => column.key === 'source')
	columns.splice(sourceIndex, 1)
}
</script>

<template>
	<SkTable
		v-if="data"
		:data="data.data"
		:columns="columns"
		@on-row-click="onRowClick"
	>
		<template #cell(description)="{ value }">
			<p class="text-overflow">{{ value }}</p>
		</template>

		<template #cell(source)="{ value }">
			<SourceAvatar 
				:size="35" 
				:icon_path="(value as IReport['source']).icon_path" 
				style="background-color: var(--background-color); "
			></SourceAvatar>
			<p>{{ (value as IReport['source']).name }}</p>
		</template>	

		<template #cell(created_at)="{ value }">
			<p class="text-gray">{{ timeAgo(value as string) }}</p>
		</template>

		<template #cell(status)="{ value }">
			<div class="flex justify-center">
				<span :class="`bug-report-status status-${value}`">{{ value }}</span>
			</div>
		</template>

		<template #cell(user.name)="{ value }">
			<div class="flex justify-center">
				<span class="badge-role">{{ value }}</span>
			</div>
		</template>

		<template #cell(actions)="{ item }">
			<SkPopover position="bottom" :key="item.code">
				<template #target="{ props }">
					<button @click.stop class="sk-dropdown__button" v-bind="props">
						<i class="icon-ellipsis-vertical"></i>
					</button>
				</template>
				<template #popover="{ props }">
					<div class="sk-dropdown__options" v-bind="props">
						<button v-dialog="{ name: 'remove', props: { path: '/api/reports/:code', code: item.code, name: item.description }, listeners: { onRefresh } }">
							<i class="icon-trash"></i>
							Delete
						</button>
					</div>
				</template>
			</SkPopover>
		</template>
	</SkTable>
	<SkPagination 
		:total_pages="data?.pagination.total_pages" 
		v-model:page="page" 
	></SkPagination>
</template>

<style lang="css">
.bug-report-status {
	padding: 5px 10px 5px 27px;
	border-radius: 10px;
	font-weight: 500;
	text-transform: capitalize;
	position: relative;

	&.status-open {
		color: green;
		background-color: color-mix(in lab, black 70%, currentColor);
	}

	&.status-closed {
		color: var(--primary-color);
		background-color: color-mix(in lab, black 70%, currentColor);
	}

	&::before {
		content: '';
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: currentColor;
	}
}
</style>