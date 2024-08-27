<script setup lang="ts">
import type { IViewsStats } from '@/types'
import { Chart, LineController, PointElement, LinearScale } from 'chart.js'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted, ref } from 'vue'
import spritesJson from '../assets/static/sprites.json'

const props = defineProps<{
    items?: IViewsStats
    disableSprites?: boolean
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

const image = new Image()
image.src = `../img/sprites.png`

// methods
const spriteImage = {
    id: 'spriteImage',
    beforeDatasetsDraw(chart: Chart) {
        const { ctx, data, scales: { x, y } } = chart

        ctx.save()

        let frameWidth = 25
        let frameHeight = 25

        data.labels?.forEach((label, index) => {
            const sprite = (spritesJson as Record<string, { x: number, y: number }>)[label as string]
            if (!sprite) return

            ctx.drawImage(
                image,
                sprite.x * frameWidth,
                sprite.y * frameHeight,
                frameWidth,
                frameHeight,
                0,
                y.getPixelForValue(index) - frameHeight / 2,
                frameWidth,
                frameHeight
            )
        })
    }
}

// lifecycle
onMounted(() => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
    Chart.register(LineController, PointElement, LinearScale)

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Counters',
                data: [],
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 15,
                borderSkipped: false,
                barPercentage: 0.95,
                categoryPercentage: 0.95,
                maxBarThickness: 60,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 5,
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        mirror: true,
                        padding: 10,
                        font: {
                            family: 'Poppins',
                            size: 15,
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        },
        plugins: [spriteImage]
    })

    watch(() => props.items, (items) => {
        if (!items) return

        chart?.data.labels?.slice(0, chart.data.labels.length)

        items = Object.fromEntries(Object.entries(items).sort((a, b) => b[1] - a[1]))

        const labels = Object.keys(items)
        const data = Object.values(items)

        chart?.data.labels?.push(...labels)
        chart?.data.datasets[0].data?.push(...data)
        chart?.update()
    }, { immediate: true })
})

onUnmounted(() => {
    chart?.destroy()
})
</script>

<template>
    <div style="height: 80%; overflow-y: auto;">
        <div>
            <canvas ref="canvas" class="counters-chart"></canvas>
        </div>
    </div>
</template>

<style lang="css">
.counters-chart {
    width: 100%;
}
</style>