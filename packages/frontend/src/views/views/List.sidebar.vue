<script setup lang="ts">
import type { IViewPagination } from '@/types'
import { useFetch } from '@composables/useFetch'
import SkTable from '@/components/ui/SkTable.vue'
import { getCurrentTimeZone, formatDate } from '@/utils'

const props = defineProps<{
    query: Record<string, string>
}>()

const { data } = useFetch<IViewPagination>("/api/views", {
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
                name: 'Name',
                key: 'name',
                thClass: 'text-left'
            },
            {
                name: 'Date',
                key: 'created_at'
            },
            {
                name: 'Country',
                key: 'session.country',
            },
            {
                name: 'OS',
                key: 'session.os',
            },
            {
                name: 'Software',
                key: 'session.software',
            }
        ]" 
    >
        <template #cell(created_at)="{ value }">
            <p class="text-gray">{{ formatDate(value as string) }}</p>
        </template>

        <template #cell(session.country)="{ value }">
            <p class="flex justify-center ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>

        <template #cell(session.os)="{ value }">
            <p class="flex justify-center ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>

        <template #cell(session.software)="{ value }">
            <p class="flex justify-center ga-05">
                <i v-if="value" class="sprites" :class="`sprites__${value}`"></i> {{ value }}
            </p>
        </template>
    </SkTable>
</template>