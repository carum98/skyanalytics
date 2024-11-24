<script setup lang="ts">
import SourceAvatar from '@components/SourceAvatar.vue'

import type { IReport } from '@shared/types'

defineProps<{
	item: IReport
}>()

function formatDate(dateString: string) {
    const date = new Date(dateString)

    return date.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
		year: 'numeric',
		weekday: 'long',
        hour12: true
    }).toLowerCase()
}
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

		<section class="container">
			<label>Metadata</label>

			<div class="metadata">
				<p v-for="(value, key) in item.metadata" :key="key">
					{{ key }}: <span>{{ value }}</span>
				</p>
			</div>
		</section>

		<section class="container">
			<label>Attachments</label>

			<div style="height: 100px;"></div>
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

	.metadata {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 10px 0;

		span {
			background-color: var(--background-color);
			padding: 3px 10px;
			border-radius: 10px;
		}
	}
}
</style>