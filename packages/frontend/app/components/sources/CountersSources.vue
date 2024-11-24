<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '@composables/useFetch'
import type { IMetrics, ISources } from '@shared/types'
import { useSidebar } from '@composables/useSidebar'
import { useDialog } from '@composables/useDialog'
import { getLast30Minutes } from '@/utils'

import BadgeCounter from '@components/BadgeCounter.vue'

const sidebar = useSidebar()
const dialog = useDialog()

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

const visitors = computed(() => props.data?.visitors ?? data.value?.visitors ?? 0)
const bugReports = computed(() => props.data?.reports ?? data.value?.reports ?? 0)

function onClickVisitors() {
    const { start, end } = getLast30Minutes()

    sidebar.push({
        name: 'sessions.list',
        props: {
            sourceCode: props.item?.code,
            query: {
                start,
                end,
            }
        }
    })
}

function onClickBugReports() {
	dialog.push({
		name: 'reports.list',
		props: {
			sourceCode: props.item?.code
		}
	})
}
</script>

<template>
	<div class="flex justify-center ga-1">
		<BadgeCounter 
        	:value="visitors" 
        	text="current visitors" 
        	color="green" 
        	@click.stop.native="onClickVisitors"
    	></BadgeCounter>

		<BadgeCounter 
			:value="bugReports" 
			text="bug reports" 
			color="red" 
			@click.stop.native="onClickBugReports"
		></BadgeCounter>
	</div>
</template>