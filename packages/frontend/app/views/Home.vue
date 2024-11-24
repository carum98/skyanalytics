<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import { useSession } from '@shared/composables/useSession'
import { getCurrentTimeZone } from '@/utils'
import { useRouter } from 'vue-router'

import SkPopover from '@ui/SkPopover.vue'
import CompactViewsChart from '@components/CompactViewsChart.vue'
import SourceAvatar from '@components/SourceAvatar.vue'
import SourceCurrentVisitors from '@components/SourceCurrentVisitors.vue'
import CounterReports from '@components/reports/CounterReports.vue'
import type { ApiStats } from '@shared/types'

const router = useRouter()
const { session } = useSession()

const { data, refresh: onRefresh, loading } = useFetch<ApiStats>("/api/stats", {
	headers: {
		'x-timezone': getCurrentTimeZone()
	}
})
</script>

<template>
	<section class="home-panel">
		<article
			v-for="item in data"
			:key="item.code"
			@click="router.push({ name: 'sources', params: { code: item.code }, state: { item: JSON.stringify(item) } })"
		>
			<header>
				<SourceAvatar 
					:size="35" 
					:icon_path="item.icon_path" 
					:isMobile="item.type === 'app'"
					style="background-color: var(--background-color); "
				></SourceAvatar>

				<div style="max-width: 200px;">
					<h2>
						{{ item.name }}
					</h2>
					<p class="text-gray">{{ item.domain ?? 'not domain' }}</p>
				</div>

				<SkPopover v-if="session?.role === 'admin'" position="bottom">
					<template #target="{ props }">
						<button @click.stop class="sk-dropdown__button" v-bind="props">
							<i class="icon-ellipsis-vertical"></i>
						</button>
					</template>
					<template #popover="{ props }">
						<div class="sk-dropdown__options" v-bind="props">
							<button v-dialog="{ name: 'sources.key', props: { item } }" v-sk-analytics="{ event: 'get-key-project' }">
								<i class="icon-key"></i>
								Key
							</button>
							<button v-dialog="{ name: 'sources.form', props: { item }, listeners: { onRefresh } }" v-sk-analytics="{ event: 'edit-project' }">
								<i class="icon-pen-to-square"></i>
								Edit
							</button>
							<button v-dialog="{ name: 'remove', props: { path: '/api/sources/:code', code: item.code, name: item.name }, listeners: { onRefresh } }" v-sk-analytics="{ event: 'remove-project' }">
								<i class="icon-trash"></i>
								Delete
							</button>
						</div>
					</template>
				</SkPopover>
			</header>

			<CompactViewsChart :data="item.views" />

			<div class="flex justify-center ga-1">
				<SourceCurrentVisitors :data="item.metrics" :item="item" />
				<CounterReports :data="item.metrics" :item="item" />
			</div>
		</article>

		<template v-if="loading">
			<article v-for="i in 11" :key="i">
				<header>
					<div class="skeleton" style="width: 35px; height: 35px;"></div>
					<div class="skeleton" style="width: 150px; height: 40px;"></div>
				</header>
				<div class="skeleton" style="height: 160px;"></div>
				<div>
					<div class="skeleton" style="width: 150px; height: 20px; margin: auto;"></div>
				</div>
			</article>
		</template>

		<button 
			v-if="session?.role === 'admin'" 
			class="sk-button-fab" 
			v-dialog="{ name: 'sources.form', listeners: { onRefresh } }"
			v-sk-analytics="{ event: 'add-project' }"
		>
			<i class="icon-plus"></i>
		</button>
	</section>
</template>

<style lang="css">
.home-panel {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	grid-auto-rows: min-content;
	align-items: start;
	gap: 1rem;

	article {
		padding: 1.1rem;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: var(--table-color);
		border-radius: var(--border-radius);
		transition: background-color 0.2s, box-shadow 0.2s;

		header {
			display: grid;
			grid-template-columns: min-content auto min-content;
			gap: 15px;
		}

		h2 {
			font-weight: 300;
    		line-height: 20px;
    		font-size: 22px;
			text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
		}

		p {
    		text-overflow: ellipsis;
    		overflow: hidden;
    		white-space: nowrap;
			font-size: smaller;
		}

		&:hover:not(:has(button:hover)) {
			cursor: pointer;
        	background-color: rgba(var(--table-color-rgb), 0.8);
			box-shadow: var(--shadow);
		}

		.skeleton {
			background: linear-gradient(90deg, var(--background-color) 25%, #272727 50%, var(--background-color) 75%);
			border-radius: 10px;
			background-size: 200% 100%;
  			animation: skeleton-loading 1s infinite;
		}
	}
}

@keyframes skeleton-loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>