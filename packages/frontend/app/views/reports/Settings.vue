<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import type { ApiSettingsBugReport } from '@shared/types'

const { data, refresh, loading } = useFetch<ApiSettingsBugReport>('/api/settings/email_bug_report')
</script>

<template>
	<div class="placeholder p-1" style="width: 80%;">
		<div class="summary-profile">
			<div>
				<p>Enabled</p>
				<p>{{ data?.enabled ? 'Yes' : 'No' }}</p>
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
				class="sk-button" 
				v-dialog="{ name: 'bug-report.form-settings', props: { item: data }, listeners: { onRefresh: refresh } }"
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
</style>