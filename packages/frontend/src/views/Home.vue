<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import { type ISourcesPagination } from '@/types'

import SkPopover from '@ui/SkPopover.vue'
import CompactViewsChart from '@components/CompactViewsChart.vue'

const { data, refresh: onRefresh } = useFetch<ISourcesPagination>("/api/sources")
</script>

<template>
	<section>
		<article
			v-for="item in data?.data"
			:key="item.code"
			@click="$router.push({ name: 'sources', params: { code: item.code } })"
		>
			<header class="flex justify-space-between mb-1">
				<div class="flex ga-1">
					<div class="avatar-source"></div>
					<h2>{{ item.name }}</h2>
				</div>

				<SkPopover position="bottom">
					<template #target="{ props }">
						<button @click.stop class="sk-dropdown__button" v-bind="props">
							<i class="icon-ellipsis-vertical"></i>
						</button>
					</template>
					<template #popover="{ props }">
						<div class="sk-dropdown__options" v-bind="props">
							<button v-dialog="{ name: 'sources.key', props: { item } }">
								<i class="icon-key"></i>
								Key
							</button>
							<button v-dialog="{ name: 'sources.form', props: { item }, listeners: { onRefresh } }">
								<i class="icon-pen-to-square"></i>
								Edit
							</button>
							<button v-dialog="{ name: 'sources.delete', props: { item }, listeners: { onRefresh } }">
								<i class="icon-trash"></i>
								Delete
							</button>
						</div>
					</template>
				</SkPopover>
			</header>

			<CompactViewsChart :item="item"/>
		</article>

		<button class="sk-button-fab" v-dialog="{ name: 'sources.form', listeners: { onRefresh } }">
			<i class="icon-plus"></i>
		</button>
	</section>
</template>

<style lang="css">
section {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	grid-template-rows: minmax(150px, auto);
	align-items: start;

	article {
		padding: 1rem;
		border-radius: 5px;
		margin: 0.5rem;
		text-decoration: none;
		background-color: var(--table-color);
		border-radius: var(--border-radius);
		transition: background-color 0.2s, box-shadow 0.2s;

		position: relative;

		h2 {
			font-size: 1.3rem;
		}

		&:hover:not(:has(button:hover)) {
			cursor: pointer;
        	background-color: rgba(var(--table-color-rgb), 0.8);
			box-shadow: var(--shadow);
		}
	}
}
</style>