<script setup lang="ts">
import { type ISources } from '@/types'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
    item: ISources
}>()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

// methods
async function getData() {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
    const labels = processDateLabels(Array.from({ length: 24 }, (_, i) => `i-${i.toString().padStart(2, '0')}`))

    chart?.data.labels?.push(...labels)
    chart?.data.datasets[0].data?.push(...data)
    chart?.update()
}

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

    getData()
})

onUnmounted(() => {
    chart?.destroy()
})

function processDateLabels(values: string[]) {
    // Hours
    if (values.at(0)?.length === 4) {
        return values.map(item => {
            const [_, value] = item.split('-')
            const hour = parseInt(value)
            // Return the hour in 12h format
            return hour > 12 ? `${hour - 12} pm` : `${hour === 0 ? 12 : hour} am`
        })
    }

    // Months
    if (values.at(0)?.length === 7) {
        return values.map(item => {
            const [month, year] = item.split('-')

            // Create a date object (day is set to 1 to avoid issues with different month lengths)
            const date = new Date(`${year}-${month}-02`)

            return date.toLocaleString('es', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())
        })
    }

    // Days
    if (values.at(0)?.length === 10) {
        return values.map(item => {
            const [day, month, year] = item.split('-')

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