<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import { useSession } from '@shared/composables/useSession'
import { useRouter } from 'vue-router'
import { type ISourcesPagination } from '@/types'

import SkPopover from '@ui/SkPopover.vue'
import CompactViewsChart from '@components/CompactViewsChart.vue'
import SourceAvatar from '@/components/SourceAvatar.vue'
import SourceCurrentVisitors from '@/components/SourceCurrentVisitors.vue'

const router = useRouter()
const { session } = useSession()

const { data, refresh: onRefresh } = useFetch<ISourcesPagination>("/api/sources", {
	transform: (data) => ({
		...data,
		data: data.data.map((item) => ({
			...item,
			icon_path: item.icon_path ? `${import.meta.env.VITE_URL_FRONTEND}/api${item.icon_path}` : null,
		}))
	})
})
</script>

<template>
	<section class="home-panel">
		<article
			v-for="item in data?.data"
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

			<CompactViewsChart :item="item"/>

			<SourceCurrentVisitors :item="item"/>
		</article>

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
	grid-template-rows: min-content;
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
	}
}
</style>