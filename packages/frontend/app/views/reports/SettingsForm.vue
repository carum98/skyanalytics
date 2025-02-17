<script setup lang="ts">
import { $fetch } from '@/utils/fetch'
import SkSelect from '@/components/ui/SkSelect.vue'
import type { ApiSettingsBugReport } from '@shared/types'
import { useFetch } from '@/composables/useFetch'

const props = defineProps<{
	item: ApiSettingsBugReport
}>()

const emits = defineEmits<{
    close: []
    refresh: []
}>()

const { data: options } = useFetch<Array<{id: number; name: string; value: string }>>('/api/users', {
	transform: (data: any) => data.data,
	query: { options: 'true' },
})

async function send(event: Event) {
	const data = Array
		.from(new FormData(event.target as HTMLFormElement))
		.filter(([k, v]) => v)
		.map(([k, v]) => {
			if (k === 'enabled') return [k, v === 'true']
			if (k === 'users') return [k, v.toString().split(',').map((item) => options.value?.find((i: any) => i.value === item)?.id)]
			return [k, v]
		})

	const value = Object.fromEntries(data)

	await $fetch('/api/settings/email_bug_report', {
		method: 'POST',
		body: JSON.stringify(value),
		headers: { 'Content-Type': 'application/json' },
	})

	emits('refresh')
    emits('close')
}
</script>

<template>
	<form class="sk-form" @submit.prevent="send">
		<label>Enabled</label>
		<SkSelect
			name="enabled"
			:value="`${props.item.enabled}`"
			:options="[
				{ value: 'true', name: 'Yes' },
				{ value: 'false', name: 'No' }
			]"
		></SkSelect>

		<label>Users</label>
		<SkSelect
			name="users"
			multiple
			:value="props.item.users.toString()"
			:options="options as any ?? []"
		></SkSelect>

		<button type="submit" class="sk-button">Save</button>
	</form>
</template>