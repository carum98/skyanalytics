<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import type { IMetrics, ISources } from '@shared/types'
import { useSidebar } from '@/composables/useSidebar'

const props = defineProps<{
    data?: IMetrics
    item?: ISources
}>()

const sidebar = useSidebar()

const { data } = useFetch<IMetrics>(`/api/sources/${props.item?.code}/metrics`, {
    query: {
        date_range: 'last_30_minutes',
    },
    immediate: props.data === undefined,
})

const value = computed(() => props.data?.visitors ?? data.value?.visitors ?? 0)
const disabled = computed(() => !Boolean(value.value))

function onClick() {
    const { start, end } = getLast30Minutes()

    sidebar.push({
        name: 'sessions.list',
        props: {
            sourceCode: props.item?.code,
            query: {
                start,
                end,
            }
        }
    })
}

function getLast30Minutes() {
    const now = new Date()

    return {
        start: formatDate(new Date(now.getTime() - 30 * 60 * 1000)),
        end: formatDate(now),
    }
}

function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const time = date.toTimeString().split(' ').at(0)

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${time}`
}
</script>

<template>
	<button 
        class="source-visitors-badge" 
        :disabled="disabled"
        @click.stop="onClick"
    >
        <span class="green-circle" :class="{ disabled }"></span>
        {{ value }}
        <span class="text-gray">current visitors</span>
    </button>
</template>

<style lang="css">
.source-visitors-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    overflow: visible;
    border-radius: 5px;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        cursor: pointer;
        background-color: var(--background-color);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

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