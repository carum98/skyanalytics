<script setup lang="ts">
import { type IView } from '@shared/types'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, type ChartArea } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
	data: IView
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

// lifecycle
onMounted(() => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Views',
                data: [],
                fill: true,
                borderColor: (context) => {
                    const chart = context.chart
                    const { ctx, chartArea } = chart

                    if (!chartArea) return
                    return getGradient(ctx, chartArea)
                },
				backgroundColor: (context) => {
                    const chart = context.chart
                    const { ctx, chartArea } = chart

                    if (!chartArea) return
                    return getGradient(ctx, chartArea, true)
                },
                tension: 0.3,
                pointRadius: 0
            },{
                label: 'Bug Reports',
                data: [],
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
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
                    min: 0,
                    beginAtZero: true,
                    suggestedMax: 10
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

	const labels = Object.keys(props.data)
    const sessions = Object.values(props.data).map(item => item.sessions)
    const bugReports = Object.values(props.data).map(item => item.reports)

    chart?.data.labels?.push(...labels)
    chart?.data.datasets[0].data?.push(...sessions)
    chart?.data.datasets[1].data?.push(...bugReports)
    chart?.update()
})

onUnmounted(() => {
    chart?.destroy()
})

let width: number, height: number, gradient: any, gradientOpacity: any

function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea, withOpacity = false) {
    const chartWidth = chartArea.right - chartArea.left
    const chartHeight = chartArea.bottom - chartArea.top

    if (!gradient || !gradientOpacity || width !== chartWidth || height !== chartHeight) {
        width = chartWidth
        height = chartHeight

		if (withOpacity) {
			gradientOpacity = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)

			gradientOpacity.addColorStop(0, `rgba(212, 239, 223, 0)`)
			gradientOpacity.addColorStop(0.5, `rgba(39, 174, 96, 0.4)`)
			gradientOpacity.addColorStop(1, 'rgba(14, 98, 81, 0.7)')
		} else {
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)

			gradient.addColorStop(0, '#d4efdf')
        	gradient.addColorStop(0.5, '#27ae60')
        	gradient.addColorStop(1, '#0e6251')
		}
    }

    return withOpacity ? gradientOpacity : gradient
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