<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import type { IMapLocation } from '@shared/types'

import DateSelector, { type DateSelectorValue } from '@/components/DateSelector.vue'
import SkMap from '@/components/ui/SkMap.vue'

// data
const filters = ref<DateSelectorValue>()

// methods
const { data } = useFetch<IMapLocation[]>("/api/locations", {
	query: filters,
})

const items = computed(() => {
	return data.value?.map((item) => item.locations.map((location) => location)).flat()
})
</script>

<template>
	<section class="placeholder p-1">
		<SkMap :items="items">
			<template #top-left>
				<DateSelector v-model="filters" />
			</template>
		</SkMap>
	</section>
</template>
