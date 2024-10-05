<script setup lang="ts">
import type { IViewsStats } from '@shared/types'
import { computed } from 'vue'

const props = defineProps<{
    items?: IViewsStats
    disableSprites?: boolean
}>()

defineEmits<{
    rowClick: [string]
}>()

const itemsSorted = computed(() => {
    if (!props.items) return []
    return Object.fromEntries(Object.entries(props.items).sort((a, b) => b[1] - a[1]))
})
</script>

<template>
    <ul class="counter-list">
        <li v-for="(value, key) in itemsSorted" :key="key" @click="$emit('rowClick', key as string)">
            <i v-if="!disableSprites" class="sprites" :class="`sprites__${key}`"></i>
            {{ key }} <span>{{ value }}</span>
        </li>
    </ul>
</template>

<style lang="css">
.counter-list {
    height: 80%;
    overflow-y: auto;

    li {
        display: flex;
        padding: 0.5rem 1rem;
        gap: 0.5rem;
        cursor: pointer;

        span {
            margin-left: auto;
            background-color: var(--background-color);
            width: 30px;
            height: 30px;
            border-radius: 10px;
            display: grid;
            place-items: center;
        }

        &:hover {
            background-color: rgba(242, 245, 252, 0.06);
        }
    }

    li:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.284);
    }
}

.counter-list:empty::after {
    content: 'No data';
    display: flex;
    padding: 1rem;
    text-align: center;
    color: gray;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>