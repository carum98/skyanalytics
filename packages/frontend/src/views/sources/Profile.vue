<script setup lang="ts">
import { provide, ref } from 'vue'
import type { IMetrics, ISources } from '@/types'

import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import SourceAvatar from '@components/SourceAvatar.vue'
import SkTabs from '@ui/SkTabs.vue'

const route = useRoute()

const item = JSON.parse(window.history.state.item) as ISources

// data
const filters = ref<DateSelectorValue>()

const { data: metrics } = useFetch<IMetrics>(`/api/sources/${route.params.code}/metrics`, {
    query: {
        date_range: 'last_30_minutes',
    }
})

// provide
provide('filters', filters)
</script>

<template>
<div>
    <section class="flex justify-space-between align-end mb-1">
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

        <!-- <SkTabs 
            :tabs="[
                { label: 'Summary', to: { name: 'sources.summary', params: { code: item.code } } },
                { label: 'Views', to: { name: 'sources.views', params: { code: item.code } } },
                { label: 'Events', to: { name: 'sources.events', params: { code: item.code } } },
                { label: 'Sessions', to: { name: 'sources.sessions', params: { code: item.code } } },
            ]"
        ></SkTabs> -->

        <DateSelector v-model="filters" />
    </section>

    <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
            <KeepAlive>
                <Component :is="Component" />
            </KeepAlive>
        </Transition>
    </RouterView>
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
</style>