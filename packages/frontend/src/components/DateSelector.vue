<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { DateRange, range24hours, nextDate, previousDate, formatDate } from '@/utils/dates-options'

import SkPopover from '@ui/SkPopover.vue'

type Option = {
    name: string
    value: DateRange
}

export type DateSelectorValue = {
    date_range: DateRange
    start?: string
    end?: string
}

const options: Option[] = [
    { name: 'Last 24 hours', value: DateRange.last_24_hours },
    { name: 'This week', value: DateRange.this_week },
    { name: 'Last 7 days', value: DateRange.last_7_days },
    { name: 'This month', value: DateRange.this_month },
    { name: 'Last 30 days', value: DateRange.last_30_days },
    { name: 'Last 2 months', value: DateRange.last_2_months },
    { name: 'Last 3 months', value: DateRange.last_3_months },
]

let initial = range24hours()

// data
const selected = ref<Option>(options[0])
const value = defineModel<DateSelectorValue>()
const date = ref<{ start: Date, end: Date }>({
    start: initial.start,
    end: initial.end,
})

// computed
const placeholder = computed(() => {
    if (date.value.start && date.value.end) {
        return `${date.value.start.toLocaleDateString('en-US', { dateStyle: 'medium' })} - ${date.value.end.toLocaleDateString('en-US', { dateStyle: 'medium' })}`
    }

    return selected.value.name
})

// watch
watch(() => selected.value, (newValue) => {
    value.value = {
        date_range: newValue.value,
    }
}, { immediate: true })

// methods
function next() {
    const values = nextDate(date.value.start, date.value.end, selected.value.value)

    date.value = values

    value.value = {
        date_range: selected.value.value,
        start: formatDate(date.value.start),
        end: formatDate(date.value.end),
    }
}

function back() {
    const values = previousDate(date.value.start, date.value.end, selected.value.value)

    date.value = values

    value.value = {
        date_range: selected.value.value,
        start: formatDate(date.value.start),
        end: formatDate(date.value.end),
    }
}
</script>

<template>
    <div class="date-selector">
        <SkPopover position="bottom">
            <template #target="{ props }">
                <button class="date-selector__picker" v-bind="props">
                    {{ placeholder }}
                    <i class="icon-caret-down"></i>
                </button>
            </template>
            <template #popover="{ props }">
                <div class="date-selector__options" v-bind="props">
                    <button
                        v-for="option in options"
                        :key="option.value"
                        :class="{ active: selected.value === option.value }"
                        @click="selected = option"
                    >
                        {{ option.name }}
                    </button>
                </div>
            </template>
        </SkPopover>

        <div class="date-selector__controls">
            <button @click="back">
                <i class="icon-chevron-left"></i>
            </button>
            <button @click="next">
                <i class="icon-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<style lang="css">
.date-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-selector__picker {
    min-width: 200px;
    padding: 0.5rem 1rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    background-color: var(--table-color);
    border-radius: var(--border-radius);
}

.date-selector__options {
    width: 200px;

    button {
        white-space: nowrap;
        align-items: center;
        border-radius: 10px;
        color: rgba(var(--text-color-rgb), .9);
        display: flex;
        font-size: 15px;
        gap: 10px;
        padding: 8px 10px;
        min-width: 100%;

        background-color: #1a1c1eba;

        &:hover {
            background-color: #1a1c1e;
        }

        &:not(:last-of-type) {
            margin-bottom: 0.5rem;
        }

        &.active {
            background-color: var(--primary-color);
            color: var(--text-color);
        }
    }
}

.date-selector__controls {
    display: flex;
    height: 50px;

    button {
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        width: 50px;
        background-color: var(--table-color);

        &:nth-of-type(1) {
            border-top-left-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
        }

        &:nth-of-type(2) {
            border-top-right-radius: var(--border-radius);
            border-bottom-right-radius: var(--border-radius);
        }

        &:hover {
            background-color: rgba(var(--table-color-rgb), 0.5);
        }
    }

    &::after {
        content: '';
        width: 1px;
        background-color: var(--background-color);
        translate: -50px;
    }
}
</style>