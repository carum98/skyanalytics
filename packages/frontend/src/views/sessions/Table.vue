<script setup lang="ts">
import type { ISessionPagination } from '@/types'
import { useFetch } from '@composables/useFetch'
import SkTable from '@/components/ui/SkTable.vue'

const { data } = useFetch<ISessionPagination>("/api/sessions")
</script>

<template>
    <SkTable 
        v-if="data"
        :data="data.data" 
        :columns="['country', 'os', 'software']" 
    ></SkTable>
</template>