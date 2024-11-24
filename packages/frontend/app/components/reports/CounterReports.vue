<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '@composables/useFetch'
import type { IMetrics, ISources } from '@shared/types'

import BadgeCounter from '@components/BadgeCounter.vue'

const props = defineProps<{
    data?: IMetrics
    item?: ISources
}>()

const { data } = useFetch<IMetrics>(`/api/sources/${props.item?.code}/metrics`, {
    query: {
        date_range: 'last_30_minutes',
    },
    immediate: props.data === undefined,
})

const value = computed(() => props.data?.visitors ?? data.value?.visitors ?? 0)

function onClick() {

}
</script>

<template>
    <BadgeCounter 
        :value="value" 
        text="bug reports" 
        color="red" 
        @click.native="onClick"
    />
</template>
