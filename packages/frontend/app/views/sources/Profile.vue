<script setup lang="ts">
import { ref, computed } from 'vue'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import SourceAvatar from '@components/SourceAvatar.vue'
import SourceCurrentVisitors from '@/components/SourceCurrentVisitors.vue'
import ViewsChart from '@components/ViewsChart.vue'
import CountersList from '@components/CountersList.vue'
import StatCard from '@components/StatCard.vue'
import SkMap from '@/components/ui/SkMap.vue'

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
            stats: 'os,software,country,navigations,events,location,metadata',
        }
    })
})

// methods
function onOpenSessions(field?: string, value?: string) {
    const query = {
        [`${field}[equal]`]: value,
        ...filters?.value || {},
    }

    sidebar.push({ 
        name: 'sessions.list',
        props: { 
            query,
            sourceCode: route.params.code
        }
    })
}

function onOpenViews(viewName?: string) {
    const query = {
        ['navigations[name][equal]']: viewName,
        ...filters?.value || {},
    }

    sidebar.push({ 
        name: 'views.list',
        props: { 
            query,
            sourceCode: route.params.code
        }
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

function onOpenMedata(medataValue?: string, medataKey?: string) {
    const query = {
        per_page: 20,
        [`metadata[${medataKey}][json_equal]`]: medataValue,
        ...filters?.value || {},
    }

    sidebar.push({ 
        name: 'views.list',
        props: { 
            query,
            sourceCode: route.params.code
        }
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

            <SourceCurrentVisitors 
                :item="item"
                style="font-size: 16px;"
            ></SourceCurrentVisitors>
        </div>

        <DateSelector v-model="filters" />
    </section>

    <section v-if="item" class="grid-stats">
        <div class="placeholder box-1">
            <ViewsChart :item="item" :filters="filters" />
        </div>

        <StatCard title="Operating Systems" @open-external="onOpenSessions">
			<CountersList :items="stat?.os" @row-click="onOpenSessions('os', $event)" />
        </StatCard>

        <StatCard title="Countries" @open-external="onOpenSessions">
			<CountersList :items="stat?.country" @row-click="onOpenSessions('country', $event)" />
        </StatCard>

        <StatCard title="Software" @open-external="onOpenSessions">
			<CountersList :items="stat?.software" @row-click="onOpenSessions('software', $event)" />
        </StatCard>

        <StatCard title="Events" @open-external="onOpenEvents">
			<CountersList :items="stat?.events" disable-sprites @row-click="onOpenEvents" />
        </StatCard>

        <StatCard title="Views" @open-external="onOpenViews">
			<CountersList :items="stat?.navigations" disable-sprites @row-click="onOpenViews" />
        </StatCard>

		<template v-if="stat?.metadata">
			<StatCard v-for="(item, value) in stat.metadata" disable-external :title="value">
				<CountersList disable-sprites :items="item" @row-click="onOpenMedata($event, value)" />
			</StatCard>
		</template>

        <div class="placeholder box-2">
            <SkMap :items="stat?.location" />
        </div>
    </section>
</div>
</template>

<style lang="css">
.grid-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    align-items: stretch;
    gap: 1rem;
    width: 100%;
    margin-bottom: 20px;

    /* Areas */
    .box-1 {
		height: 480px;
		grid-column: span 3;
    }

    .box-2 {
		height: 750px;
		grid-column: span 3;
    }

    > div {
        height: 350px;
        padding: 1rem;
    }
}
</style>
