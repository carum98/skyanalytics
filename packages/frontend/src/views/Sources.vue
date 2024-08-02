<script setup lang="ts">
import type { ISources } from '@/types'
import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'

import DateSelector from '@components/DateSelector.vue'
import ViewsChart from '@/components/ViewsChart.vue'
import CountersList from '@/components/CountersList.vue'

const route = useRoute()
const { data } = useFetch<ISources>(`/api/sources/${route.params.code}`)

const os = {
    "MacOS": 1,
    "Windows": 2,
    "Linux": 3,
}

const country = {
    "US": 1,
    "BR": 2,
    "CA": 3,
    "DE": 4,
    "FR": 5,
    "IT": 6,
    "JP": 7,
    "MX": 8,
    "RU": 9,
    "ES": 10,
}

const navigations = {
    "login": 1,
    "register": 2,
    "forgot-password": 3,
    "reset-password": 4,
}

const softwares = {
    "Chrome": 1,
    "Firefox": 2,
    "Safari": 3,
    "Edge": 4,
    "Opera": 5,
    "IE": 6,
}
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
        <div class="placeholder box-1">
            <ViewsChart v-if="data" :item="data"/>
        </div>
        <div class="placeholder box-2">
            <CountersList :items="os"></CountersList>
        </div>
        <div class="placeholder box-3">
            <CountersList :items="country"></CountersList>
        </div>
        <div class="placeholder box-4">
            <CountersList :items="navigations"></CountersList>
        </div>
        <div class="placeholder box-5">
            <CountersList :items="softwares"></CountersList>
        </div>
    </section>
</div>
</template>

<style lang="css">
.grid-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    /* grid-template-rows: repeat(4, minmax(380px, 1fr)); */
    gap: 1rem;
    width: 100%;

    grid-template-areas:
        'box-1 box-1 box-1'
        'box-2 box-3 box-4';

    /* Areas */
    .box-1 {
        grid-area: box-1;
        height: 480px;
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

    > div {
        padding: 1rem;
    }
}
</style>