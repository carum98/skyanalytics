<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

import type { ISources, IViewsStats } from '@/types'
import type { DateSelectorValue } from '@components/DateSelector.vue'

import { useFetch } from '@composables/useFetch'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

const props = defineProps<{
    item: ISources
    filters: DateSelectorValue | undefined
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

const { data } = useFetch<IViewsStats>(`/api/sources/${props.item.code}/views`, {
    query: computed(() => props.filters)
})

watch(data, (value) => {
    if (!value || !chart) return

    const labels = processDateLabels(Object.keys(value))
    const data = Object.values(value)

    chart.data.labels! = labels
    chart.data.datasets[0].data! = data

    chart.update()
})

// lifecycle
onMounted(() => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

    Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip)

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                borderColor: 'green',
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    min: 0
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    titleAlign: 'center',
                    bodyAlign: 'center',
                    callbacks: {
                        label: ({ parsed }) => `${parsed.y}`
                    }
                }
            }
        }
    })
})

onUnmounted(() => {
    chart?.destroy()
})

function processDateLabels(values: string[]) {
    // Hours
    if (values.at(0)?.length === 3) {
        return values.map(item => {
            const [value, _] = item.split(':')
            const hour = parseInt(value)
            // Return the hour in 12h format
            return hour > 12 ? `${hour - 12} pm` : `${hour === 0 ? 12 : hour} am`
        })
    }

    // Months
    if (values.at(0)?.length === 7) {
        return values.map(item => {
            const [year, month] = item.split('-')

            // Create a date object (day is set to 1 to avoid issues with different month lengths)
            const date = new Date(`${year}-${month}-02`)

            return date.toLocaleString('es', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())
        })
    }

    // Days
    if (values.at(0)?.length === 10) {
        return values.map(item => {
            const [year, month, day] = item.split('-')

            // Create a date object (hour is set to 13 to avoid issues with different timezones)
            const date = new Date(`${year}-${month}-${day}T13:00:00.000Z`)

            return date.toLocaleString('es', { month: 'long', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase())
        })
    }

    return values
}
</script>

<template>
    <canvas ref="canvas"></canvas>
</template>