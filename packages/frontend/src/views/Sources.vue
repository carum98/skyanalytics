<script setup lang="ts">
import type { ISources } from '@/types'
import { useFetch } from '@composables/useFetch'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data } = useFetch<ISources>(`/api/sources/${route.params.code}`)
</script>

<template>
    <pre>
        {{ data }}
    </pre>
</template>