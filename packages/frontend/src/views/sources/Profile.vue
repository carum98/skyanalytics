<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IMetrics, ISources, IStats } from '@/types'

import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import ViewsChart from '@components/ViewsChart.vue'
import CountersList from '@components/CountersList.vue'
import MapLocations from '@/components/MapLocations.vue'
import SourceAvatar from '@/components/SourceAvatar.vue'
import StatCard from '@components/StatCard.vue'
import CountersChart from '@components/CountersChart.vue'

const route = useRoute()
const dialog = useDialog()

const item = JSON.parse(window.history.state.item) as ISources

// data
const filters = ref<DateSelectorValue>()

const { data: stat } = useFetch<IStats>(`/api/sources/${route.params.code}/stats`, {
    query: computed(() => {
        return {
            ...filters.value,
            stats: 'os,software,country,navigations,events,location',
        }
    })
})

const { data: metrics } = useFetch<IMetrics>(`/api/sources/${route.params.code}/metrics`, {
    query: {
        date_range: 'last_30_minutes',
    }
})

// methods
function onRowClick(field: string, value: string) {
    dialog.push({ 
        name: 'sessions.table',
        props: {
            query: {
                per_page: '5',
                [`${field}[equal]`]: value,
                ['sources[code][equal]']: route.params.code,
                ...filters.value,
            }
        }
    })
}
</script>

<template>
<div>
    <section class="flex justify-space-between mb-1">
        <div class="flex align-center ga-1">
            <SourceAvatar 
                :size="50" 
                :icon_path="item.icon_path" 
                style="background-color: var(--table-color); "
            ></SourceAvatar>

            <div>
                <h2 style="line-height: 20px;">
                    {{ item.name }}
                    <span 
                        v-if="item.type === 'app'" 
                        class="text-gray" 
                        style="font-size: 15px;"
                        title="Source type `App`"
                    >
                        <i class="icon-mobile-screen"></i>	
                    </span>
                </h2>
                <small class="text-gray">{{ item.domain || 'not domain' }}</small>
            </div>

            <p class="flex align-center" style="gap: 5px;">
                <span class="green-circle"></span>
                {{ metrics?.visitors ?? 0 }}
                <span class="text-gray">current visitors</span>
            </p>
        </div>

        <DateSelector v-model="filters" />
    </section>
    
    <section v-if="item" class="grid-stats">
        <div class="placeholder box-1">
            <ViewsChart :item="item" :filters="filters" />
        </div>

        <StatCard class="box-2" title="Operating Systems">
            <template #list>
                <CountersList :items="stat?.os" @row-click="onRowClick('os', $event)" />
            </template>
            <template #chart>
                <CountersChart :items="stat?.os" />
            </template>
        </StatCard>

        <StatCard class="box-3" title="Countries">
            <template #list>
                <CountersList :items="stat?.country" @row-click="onRowClick('country', $event)" />
            </template>
            <template #chart>
                <CountersChart :items="stat?.country" />
            </template>
        </StatCard>

        <StatCard class="box-4" title="Software">
            <template #list>
                <CountersList :items="stat?.software" @row-click="onRowClick('software', $event)" />
            </template>
            <template #chart>
                <CountersChart :items="stat?.software" />
            </template>
        </StatCard>

        <StatCard class="box-5" title="Events">
            <template #list>
                <CountersList :items="stat?.events" disable-sprites />
            </template>
        </StatCard>

        <StatCard class="box-6" title="Navigations">
            <template #list>
                <CountersList :items="stat?.navigations" disable-sprites />
            </template>
        </StatCard>

        <div class="placeholder box-7">
            <MapLocations :items="stat?.location" />
        </div>
    </section>
</div>
</template>

<style lang="css">
.green-circle {
    display: inline-block;
    height: 15px;
    width: 15px;
    background-color: green;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 green }
    70% { box-shadow: 0 0 0 10px rgba(145, 243, 88, 0) }
    100% { box-shadow: 0 0 0 50px rgba(145, 243, 88, 0) }
}

.grid-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    grid-template-rows: 480px 270px 270px 550px;
    align-items: stretch;
    gap: 1rem;
    width: 100%;
    margin-bottom: 20px;

    grid-template-areas:
        'box-1 box-1 box-1'
        'box-2 box-3 box-4'
        'box-5 box-6 .'
        'box-7 box-7 box-7';

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

    .box-7 {
        grid-area: box-7;
    }

    > div {
        padding: 1rem;
    }
}
</style>