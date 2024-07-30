<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import { type ISourcesPagination } from '@/types'
import SkPopover from '@components/SkPopover.vue'

const { data, loading } = useFetch<ISourcesPagination>("/api/sources")
</script>

<template>
	<section v-if="!loading">
		<RouterLink
			v-for="item in data?.data"
			:key="item.code"
			:to="{ name: 'sources', params: { code: item.code } }"
		>
			{{ item.name }}

			<SkPopover position="bottom">
            	<template #target="{ props }">
            		<button v-bind="props">
                    	V
                	</button>
            	</template>
            	<template #popover="{ props }">
            		<div v-bind="props">
                    	<button>
                        	Delete
                    	</button>
						<button>
							Edit
						</button>
                	</div>
            	</template>
        	</SkPopover>
		</RouterLink>
	</section>
</template>

<style lang="css" scoped>
section {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	grid-template-rows: minmax(150px, auto);

	a {
		padding: 1rem 1.5rem;
		border-radius: 5px;
		margin: 0.5rem;
		text-decoration: none;
		background-color: var(--table-color);
		border-radius: 15px;
		transition: background-color 0.2s, box-shadow 0.2s;

		&:hover {
			cursor: pointer;
        	background-color: rgba(var(--table-color-rgb), 0.8);
			box-shadow: var(--shadow);
		}
	}
}
</style>