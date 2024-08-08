<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ISources, IStats } from '@/types'

import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import ViewsChart from '@components/ViewsChart.vue'
import CountersList from '@components/CountersList.vue'

const route = useRoute()

// data
const filters = ref<DateSelectorValue>()

const { data: item } = useFetch<ISources>(`/api/sources/${route.params.code}`)
const { data: stat } = useFetch<IStats>(`/api/sources/${route.params.code}/stats`, {
    query: computed(() => {
        return {
            ...filters.value,
            stats: 'os,software,country,navigations,events',
        }
    })
})
</script>

<template>
<div>
    <section class="flex justify-space-between mb-1">
        <div class="flex align-center ga-1">
            <div class="avatar-source"></div>
            <h2>{{ item?.name }}</h2>
        </div>

        <DateSelector v-model="filters" />
    </section>
    
    <section v-if="item" class="grid-stats">
        <div class="placeholder box-1">
            <ViewsChart :item="item" :filters="filters" />
        </div>
        <div class="placeholder box-2">
            <p>Operating Systems</p>
            <CountersList :items="stat?.os" />
        </div>
        <div class="placeholder box-3">
            <p>Countries</p>
            <CountersList :items="stat?.country" />
        </div>
        <div class="placeholder box-4">
            <p>Software</p>
            <CountersList :items="stat?.software" />
        </div>
        <div class="placeholder box-5">
            <p>Events</p>
            <CountersList :items="stat?.events" disable-sprites></CountersList>
        </div>
        <div class="placeholder box-6">
            <p>Navigations</p>
            <CountersList :items="stat?.navigations" disable-sprites></CountersList>
        </div>
    </section>
</div>
</template>

<style lang="css">
.grid-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    gap: 1rem;
    width: 100%;

    grid-template-areas:
        'box-1 box-1 box-1'
        'box-2 box-3 box-4'
        'box-5 box-6 .';

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

    .box-5 {
        grid-area: box-5;
    }

    .box-6 {
        grid-area: box-6;
    }

    > div {
        padding: 1rem;
        height: 480px;

        > p {
            font-size: 1.25rem;
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
}
</style>