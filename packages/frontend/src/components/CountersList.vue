<script setup lang="ts">
import type { IViewsStats } from '@/types'

defineProps<{
    items?: IViewsStats
}>()
</script>

<template>
    <ul class="counter-list">
        <li v-for="(item, key) in items" :key="key">
            <i class="sprites" :class="`sprites__${key}`"></i>
            {{ key }} <span>{{ item }}</span>
        </li>
    </ul>
</template>

<style lang="css">
.counter-list {
    li {
        display: flex;
        padding: 0.5rem 1rem;
        color: #595959;
        gap: 0.5rem;

        span {
            margin-left: auto;
        }
    }

    li:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.284);
    }
}
</style>