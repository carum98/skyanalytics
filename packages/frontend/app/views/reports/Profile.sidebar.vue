<script setup lang="ts">
import SourceAvatar from '@components/SourceAvatar.vue'

import type { IReport } from '@shared/types'
import { formatDate } from '@/utils'

defineProps<{
	item: IReport
}>()
</script>

<template>
	<div class="reports-profile">
		<section class="flex justify-space-between">
			<div class="flex align-center ga-1">
				<SourceAvatar 
					:size="35" 
					:icon_path="item.source.icon_path" 
					style="background-color: var(--table-color);"
				></SourceAvatar>
				<p>{{ item.source.name }}</p>
			</div>

			<div>
				<span :class="`bug-report-status status-${item.status}`">{{ item.status }}</span>
			</div>
		</section>

		<section class="container">
			<label>Description</label>

			<p style="min-height: 150px;">
				{{ item.description }}
			</p>
		</section>

		<section class="container">
			<label>Date</label>
			<p>{{ formatDate(item.created_at) }}</p>
		</section>
	</div>
</template>

<style lang="css">
.reports-profile {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;

	.container {
		border-radius: var(--border-radius);
    	background-color: var(--table-color);
		padding: 10px 20px;

		label {
			color: gray;
		}
	}
}
</style>