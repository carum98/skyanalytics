<script setup lang="ts">
import type { ISources } from '@/types'
import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'

import DateSelector from '@components/DateSelector.vue'

const route = useRoute()
const { data } = useFetch<ISources>(`/api/sources/${route.params.code}`)
</script>

<template>
<div>
    <section class="flex justify-space-between mb-2">
        <div class="flex align-center ga-1">
            <div class="avatar-source"></div>
            <h2>{{ data?.name }}</h2>
        </div>

        <DateSelector />
    </section>
    
    <section class="grid-stats">
        <div class="placeholder box-1"></div>
        <div class="placeholder box-2"></div>
        <div class="placeholder box-3"></div>
        <div class="placeholder box-4"></div>
    </section>
</div>
</template>

<style lang="css">
.grid-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    grid-template-rows: repeat(4, minmax(280px, 1fr));
    gap: 1rem;
    width: 100%;

    grid-template-areas:
        'box-1 box-1 box-1'
        'box-2 box-3 box-3'
        'box-4 . .';

    /* Areas */
    .box-1 {
        grid-area: box-1;
    }

    .box-2 {
        grid-area: box-2;
    }

    .box-3 {
        grid-area: box-3;
    }

    .box-4 {
        grid-area: box-4;
    }
}
</style>