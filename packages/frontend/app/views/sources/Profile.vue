<script setup lang="ts">
import { ref, computed } from 'vue'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import SourceAvatar from '@components/SourceAvatar.vue'
import SourceCurrentVisitors from '@/components/SourceCurrentVisitors.vue'
import ViewsChart from '@components/ViewsChart.vue'
import CountersList from '@components/CountersList.vue'
import MapLocations from '@/components/MapLocations.vue'
import StatCard from '@components/StatCard.vue'

import { useFetch } from '@composables/useFetch'
import type { ApiStats, IStats } from '@shared/types'

import { useRoute } from 'vue-router'
import { useSidebar } from '@composables/useSidebar'

const filters = ref<DateSelectorValue>()

const route = useRoute()
const sidebar = useSidebar()

const item = JSON.parse(window.history.state.item) as ApiStats[0]

const { data: stat } = useFetch<IStats>(`/api/sources/${route.params.code}/stats`, {
    query: computed(() => {
        return {
            ...filters?.value || {},
            stats: 'os,software,country,navigations,events,location',
        }
    })
})

// methods
function onOpenSessions(field?: string, value?: string) {
    const query = {
        [`${field}[equal]`]: value,
        ['sources[code][equal]']: route.params.code,
        ...filters?.value || {},
    }

    sidebar.push({ 
        name: 'sessions.list',
        props: { query }
    })
}

function onOpenViews(viewName?: string) {
    const query = {
        per_page: 20,
        ['navigations[name][equal]']: viewName,
        ['sources[code][equal]']: route.params.code,
        ...filters?.value || {},
    }

    sidebar.push({ 
        name: 'views.list',
        props: { query }
    })
}

function onOpenEvents(eventName?: string) {
	const query = {
		per_page: 20,
		['events[name][equal]']: eventName,
		['sources[code][equal]']: route.params.code,
		...filters?.value || {},
	}

	sidebar.push({ 
		name: 'events.list',
		props: { query }
	})
}
</script>

<template>
<div>
    <section class="flex justify-space-between align-end mb-1">
        <div class="flex align-center ga-1">
            <SourceAvatar 
                :size="50" 
                :icon_path="item.icon_path" 
				:isMobile="item.type === 'app'"
				style="background-color: var(--table-color);"
            ></SourceAvatar>

            <div>
                <h2 style="line-height: 20px;">{{ item.name }}</h2>
                <small class="text-gray">{{ item.domain || 'not domain' }}</small>
            </div>

            <SourceCurrentVisitors :data="item.metrics" />
        </div>

        <DateSelector v-model="filters" />
    </section>

    <section v-if="item" class="grid-stats">
        <div class="placeholder box-1">
            <ViewsChart :item="item" :filters="filters" />
        </div>

        <StatCard class="box-2" title="Operating Systems" @open-external="onOpenSessions">
			<CountersList :items="stat?.os" @row-click="onOpenSessions('os', $event)" />
        </StatCard>

        <StatCard class="box-3" title="Countries" @open-external="onOpenSessions">
			<CountersList :items="stat?.country" @row-click="onOpenSessions('country', $event)" />
        </StatCard>

        <StatCard class="box-4" title="Software" @open-external="onOpenSessions">
			<CountersList :items="stat?.software" @row-click="onOpenSessions('software', $event)" />
        </StatCard>

        <StatCard class="box-5" title="Events" @open-external="onOpenEvents">
			<CountersList :items="stat?.events" disable-sprites @row-click="onOpenEvents" />
        </StatCard>

        <StatCard class="box-6" title="Views" @open-external="onOpenViews">
			<CountersList :items="stat?.navigations" disable-sprites @row-click="onOpenViews" />
        </StatCard>

        <div class="placeholder box-7">
            <MapLocations :items="stat?.location" />
        </div>
    </section>
</div>
</template>

<style lang="css">
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
