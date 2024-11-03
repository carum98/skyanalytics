<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

import type { ISources } from '@shared/types'
import type { DateSelectorValue } from '@components/DateSelector.vue'

import { useFetch } from '@composables/useFetch'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Interaction, type InteractionOptions, type ChartEvent, type InteractionModeFunction } from 'chart.js'
import { getCurrentTimeZone } from '@/utils'
import { useSidebar } from '@composables/useSidebar'

declare module 'chart.js' {
  interface InteractionModeMap {
    pointIndex: InteractionModeFunction;
  }
}

const props = defineProps<{
    item: ISources
    filters: DateSelectorValue | undefined
}>()

const sidebar = useSidebar()

// data
let chart: Chart | null = null
const canvas = ref<HTMLCanvasElement | null>(null)

const datasets = [
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

const { data } = useFetch<{ [key: string]: { views: number, sessions: number } }>(`/api/sources/${props.item.code}/views`, {
    query: computed(() => props.filters),
    headers: {
        'x-timezone': getCurrentTimeZone()
    }
})

// hooks
watch(data, (value) => {
    if (!value || !chart) return

    const labels = processDateLabels(Object.keys(value))
    const data = Object.values(value)

    chart.data.labels! = labels
    chart.data.datasets[0].data! = data.map(item => item.sessions)
    chart.data.datasets[1].data! = data.map(item => item.views)

    chart.update()
})

// methods
function handleClick(context: ChartEvent & { chart: Chart, native: PointerEvent }) {
    const { chart, native } = context
    const datasets = chart.data.datasets

    const element = chart.getElementsAtEventForMode(native, 'nearest', { intersect: true }, false)

    if (element.length === 1) {
        const datasetIndex = element.at(0)!.datasetIndex
        const index = element.at(0)!.index
        const dataset = datasets.at(datasetIndex)

        const value = Object.entries(data.value as any)[index]
        const key = value[0]

        if (dataset?.label === 'Sessions') {
            onOpenSessions(key)
        } else if (dataset?.label === 'Views') {
            onOpenViews(key)
        }
    }
}

function handleToggleDataset(event: Event ,index: number) {
    const dataset = chart?.data.datasets[index]

    if (dataset) {
        dataset.hidden = !dataset.hidden
        chart?.update()
    }

    // Toggle opacity of the button
    const button = (event.target as HTMLElement)
    button.style.opacity = dataset?.hidden ? '0.5' : '1'
}

// lifecycle
onMounted(() => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

    Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip)

    // Custom interaction mode to show one dataset inside tooltip if it's hovered inside the bar or line
    // and multiple if it's hovered on the section
    Interaction.modes.pointIndex = function(chart: Chart, e: ChartEvent, options: InteractionOptions, useFinalPosition?: boolean) {
        const pointItems = Interaction.modes.nearest(chart, e, { intersect: true }, useFinalPosition)

        if (!pointItems.length) {
            return Interaction.modes.index(chart, e, { intersect: false }, useFinalPosition)
        }

        return pointItems
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'pointIndex',
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
                    position: 'nearest',
                    usePointStyle: true,
                    titleAlign: 'center',
                    xAlign: 'center',
                    yAlign: 'bottom',
                }
            },
            onClick: handleClick,
            onHover: (event, chartElement) => {
                (event?.native!.target as HTMLElement)!.style.cursor = chartElement[0] ? 'pointer' : 'default'
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

function onOpenViews(date: string) {
    const { start, end } = formatRange(date)

    sidebar.push({ 
        name: 'views.list',
        props: { 
            sourceCode: props.item.code,
            query: {
                start,
                end
            }
        }
    })
}

function onOpenSessions(date: string) {
    const { start, end } = formatRange(date)

    sidebar.push({ 
        name: 'sessions.list',
        props: { 
            sourceCode: props.item.code,
            query: {
                start,
                end
            }
        }
    })
}

function formatRange(value: string) {
    let start = value
    let end = value

    if (start.length === 7) {
        start += '-01'
        end += '-31'
    }

    if (start.length === 10) {
        start += 'T00'
        end += 'T23'
    }

    if (start.length === 13) {
        start += ':00:00'
        end += ':59:59'
    }

    return { start, end }
}
</script>

<template>
    <section style="height: 100%; position: relative;">
        <canvas ref="canvas"></canvas>

        <div class="views-chart__actions">
            <button 
                v-for="(item, index) in datasets" 
                @click="handleToggleDataset($event, index)"
            >
                <span :style="{ backgroundColor: item.backgroundColor?.toString() }"></span>
                {{ item.label }}
            </button>
        </div>
    </section>
</template>

<style lang="css">
.views-chart__actions {
    position: absolute;
    display: flex;
    gap: 10px;
    top: 0;
    right: 0;

    button {
        padding: 0.5rem 1rem;
        background-color: var(--background-color);
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;

        span {
            width: 15px;
            height: 15px;
            display: inline-block;
            border-radius: 50%;
        }
    }
}
</style>