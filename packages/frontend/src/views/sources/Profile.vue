<script setup lang="ts">
import { provide, ref } from 'vue'
import type { ISources } from '@/types'

import DateSelector, { type DateSelectorValue } from '@components/DateSelector.vue'
import SourceAvatar from '@components/SourceAvatar.vue'
import SourceCurrentVisitors from '@/components/SourceCurrentVisitors.vue'

const item = JSON.parse(window.history.state.item) as ISources

// data
const filters = ref<DateSelectorValue>()

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

            <SourceCurrentVisitors :item="item" />
        </div>

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
