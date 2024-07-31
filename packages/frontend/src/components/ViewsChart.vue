<script setup lang="ts">
import { type ISources } from '@/types';

defineProps<{
    item: ISources
}>()
</script>

<template>
    <div class="views-chart"</div>
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