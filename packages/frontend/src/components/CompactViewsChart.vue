<script setup lang="ts">
import { type ISources, type IViewsStats } from '@/types'
import { $fetch } from '@/utils/fetch'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, type ChartArea } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
    item: ISources
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

// methods
async function getData() {
    const response = await $fetch<IViewsStats>(`/api/sources/${props.item.code}/views`, {
        query: {
            date_range: 'last_7_days'
        }
    })

    const labels = Object.keys(response)
    const data = Object.values(response)

    chart?.data.labels?.push(...labels)
    chart?.data.datasets[0].data?.push(...data)
    chart?.update()
}

// lifecycle
onMounted(() => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Views',
                data: [],
                fill: false,
                borderColor: (context) => {
                    const chart = context.chart
                    const { ctx, chartArea } = chart

                    if (!chartArea) return
                    return getGradient(ctx, chartArea);
                },
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            scales: {
                y: {
                    display: false,
                    min: 0
                },
                x: {
                    display: false
                }
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

    getData()
})

onUnmounted(() => {
    chart?.destroy()
})

let width: number, height: number, gradient: any

function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
    const chartWidth = chartArea.right - chartArea.left
    const chartHeight = chartArea.bottom - chartArea.top

    if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth
        height = chartHeight

        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, '#d4efdf')
        gradient.addColorStop(0.5, '#27ae60')
        gradient.addColorStop(1, '#0e6251')
    }

    return gradient
}
</script>

<template>
    <canvas ref="canvas" class="views-chart"></canvas>
</template>

<style lang="css">
.views-chart {
    width: 100%;
    height: 150px;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    opacity: 0.7;
}
</style>