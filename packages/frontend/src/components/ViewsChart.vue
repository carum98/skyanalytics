<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

import type { ISources } from '@/types'
import type { DateSelectorValue } from '@components/DateSelector.vue'

import { useFetch } from '@composables/useFetch'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import { getCurrentTimeZone } from '@/utils'

const props = defineProps<{
    item: ISources
    filters: DateSelectorValue | undefined
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

const { data } = useFetch<{ [key: string]: { views: number, sessions: number } }>(`/api/sources/${props.item.code}/views`, {
    query: computed(() => props.filters),
    headers: {
        'x-timezone': getCurrentTimeZone()
    }
})

watch(data, (value) => {
    if (!value || !chart) return

    const labels = processDateLabels(Object.keys(value))
    const data = Object.values(value)

    chart.data.labels! = labels
    chart.data.datasets[0].data! = data.map(item => item.sessions)
    chart.data.datasets[1].data! = data.map(item => item.views)

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
            datasets: [
                {
                    label: 'Sessions',
                    data: [],
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.5)',
                    borderRadius: 10
                },
                {
                    label: 'Views',
                    data: [],
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.3)',
                    borderRadius: 10
                }
            ]
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
                    stacked: true,
                    min: 0,
                    suggestedMax: 5,
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    stacked: true,
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleAlign: 'center',
                }
            }
        },
        plugins: [
            {
                id: 'hoverSegment',
                beforeEvent(chart: Chart<"bar"> & { _hoverX?: number | null }, args: any) {
                    if (args.inChartArea) {
                        // Check if the mouse is inside one bar
                        const mouseHoverBarArea = chart.getElementsAtEventForMode(args.event, 'nearest', { intersect: true }, false)
                            .length > 0

                        if (!mouseHoverBarArea) {
                            chart._hoverX = chart.scales.x.getValueForPixel(args.event.x)
                        } else {
                            chart._hoverX = null
                        }
                    } else {
                        chart._hoverX = null
                    }

                    args.changed = true
                },
                beforeDatasetsDraw(chart: Chart<"bar"> & { _hoverX?: number | null }) {
                    const { ctx, chartArea: { width, height, top }, scales: { x }, _hoverX } = chart

                    if (_hoverX != null) {
                        const segment = width / (x.max + 1)

                        const x2 = x.getPixelForValue(_hoverX) - (segment / 2)

                        ctx.save()
                        ctx.fillStyle = 'rgba(242, 245, 252, 0.06)'
                        ctx.fillRect(x2, top, segment, height)
                        ctx.restore()
                    }
                }
            }
        ]
    })
})

onUnmounted(() => {
    chart?.destroy()
})

function processDateLabels(values: string[]) {
    // Hours
    if (values.at(0)?.length === 13) {
        return values.map(item => {
            const [_, hours] = item.split('T')
            const hour = parseInt(hours)
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