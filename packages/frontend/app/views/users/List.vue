<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import type { IUserPagination } from '@shared/types'

import SkTable from '@components/ui/SkTable.vue'
import SkPopover from '@components/ui/SkPopover.vue'

const { data, refresh: onRefresh } = useFetch<IUserPagination>('/api/users')

const columns = [
	{
		name: 'Name',
		key: 'name',
		thClass: 'text-left',
		width: '30%'
	},
	{
		name: 'Email',
		key: 'email',
		thClass: 'text-left',
		width: '50%'
	},
	{
		name: 'Role',
		key: 'role',
		tdClass: 'flex justify-center'
	},
	{
		name: '',
		key: 'actions',
		width: '100px'
	}
]
</script>

<template>
	<section>
		<SkTable
			v-if="data"
			:data="data.data"
			:columns="columns"
		>
			<template #cell(role)="{ value }">
				<span class="badge-role">{{ value }}</span>
			</template>

			<template #cell(actions)="{ item }">
				<SkPopover position="bottom" :key="item.code">
					<template #target="{ props }">
						<div class="flex">
							<button @click.stop class="sk-dropdown__button mx-auto" v-bind="props">
								<i class="icon-ellipsis-vertical"></i>
							</button>
						</div>
					</template>
					<template #popover="{ props }">
						<div class="sk-dropdown__options" v-bind="props">
							<button v-dialog="{ name: 'users.form', props: { item }, listeners: { onRefresh } }">
								<i class="icon-pen-to-square"></i>
								Edit
							</button>
							<button v-dialog="{ name: 'remove', props: { path: '/api/user-accounts/:code', code: item.code, name: item.name }, listeners: { onRefresh } }">
								<i class="icon-trash"></i>
								Delete
							</button>
						</div>
					</template>
				</SkPopover>
			</template>
		</SkTable>

		<button class="sk-button-fab" v-dialog="{ name: 'users.form', listeners: { onRefresh } }">
			<i class="icon-plus"></i>
		</button>
	</section>
</template>