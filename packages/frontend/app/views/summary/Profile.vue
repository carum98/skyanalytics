<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import { useFetch } from '@composables/useFetch'
import type { ApiSettingsSummary } from '@shared/types'

const { data, refresh, loading } = useFetch<ApiSettingsSummary>('/api/settings/email_summary')

function send() {
	$fetch('/api/tasks-scheduler/SummaryTask/run', {
		method: 'POST',
	})
}
</script>

<template>
	<div class="placeholder p-1" style="width: 80%;">
		<div class="summary-profile">
			<div>
				<p>Enabled</p>
				<p>{{ data?.enabled ? 'Yes' : 'No' }}</p>
			</div>
			<div>
				<p>Range</p>
				<p>{{ data?.date_range.name }}</p>
			</div>
			<div>
				<p>Users emails</p>
				<div>
					<span v-for="item in data?.users">{{ item }}</span>
				</div>
			</div>
		</div>

		<div class="flex justify-end align-center" style="gap: 10px;" v-if="!loading">
			<button 
				class="action-button"
				v-dialog="{ name: 'summary.preview' }"
			>
				<i class="icon-eye"></i>
			</button>

			<button 
				class="action-button"
				v-dialog="{ name: 'confirm', props: { text: 'Send summary email' }, listeners: { onConfirm: send } }"
			>
				<i class="icon-send"></i>
			</button>

			<button 
				class="sk-button" 
				v-dialog="{ name: 'summary.form', props: { item: data }, listeners: { onRefresh: refresh } }"
			>
				Update
			</button>
		</div>
	</div>
</template>

<style lang="css">
.summary-profile {
	display: grid;
	grid-template-columns: repeat(2, 1fr);

	> div p:first-child {
		color: gray;
	}

	> div:nth-child(3) {
		grid-column: 1 / -1;
	}

	span {
		background-color: var(--background-color);
		padding: 2px 10px;
		border-radius: 10px;
		margin-right: 10px;
	}
}

.action-button {
	background-color: var(--background-color);
	width: 40px;
	height: 40px;
	border-radius: 10px;
}
</style>