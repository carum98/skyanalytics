<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'
import type { IMetrics, ISources } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
    item: ISources
}>()

const { data } = useFetch<IMetrics>(`/api/sources/${props.item.code}/metrics`, {
    query: {
        date_range: 'last_30_minutes',
    }
})

const disabled = computed(() => !Boolean(data.value?.visitors))
const value = computed(() => data.value?.visitors ?? 0)
</script>

<template>
	<p class="flex align-center justify-center" style="gap: 5px; overflow: visible;">
		<span class="green-circle" :class="{ disabled }"></span>
		{{ value }}
		<span class="text-gray">current visitors</span>
	</p>
</template>

<style lang="css">
.green-circle {
    display: inline-block;
    height: 15px;
    width: 15px;
    background-color: green;
    border-radius: 50%;
    animation: pulse 2s infinite;

    &.disabled {
        background-color: gray;
        animation: none;
    }
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 green }
    70% { box-shadow: 0 0 0 10px rgba(145, 243, 88, 0) }
    100% { box-shadow: 0 0 0 50px rgba(145, 243, 88, 0) }
}
</style>