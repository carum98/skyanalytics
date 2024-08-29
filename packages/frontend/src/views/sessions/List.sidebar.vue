<script setup lang="ts">
import type { ISessionPagination } from '@/types'
import { useFetch } from '@composables/useFetch'
import SkTable from '@/components/ui/SkTable.vue'
import { getCurrentTimeZone } from '@/utils'

const props = defineProps<{
    query: Record<string, string>
}>()

const { data } = useFetch<ISessionPagination>("/api/sessions", {
    query: props.query,
    headers: {
        'x-timezone': getCurrentTimeZone()
    }
})
</script>

<template>
    <SkTable 
        v-if="data"
        :data="data.data" 
        class="p-1"
        :columns="[
            {
                name: 'Country',
                key: 'country'
            },
            {
                name: 'OS',
                key: 'os'
            },
            {
                name: 'Software',
                key: 'software'
            }
        ]" 
    >
        <template #cell(country)="{ value }">
            <p class="flex ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>

        <template #cell(os)="{ value }">
            <p class="flex ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>

        <template #cell(software)="{ value }">
            <p class="flex ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>
    </SkTable>
</template>