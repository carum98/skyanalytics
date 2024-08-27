<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    title: string
}>()

const view = ref('list')
</script>

<template>
    <div class="placeholder stats-card">
        <header v-if="title">
            <p>{{ title }}</p>

            <button 
                @click="view = view === 'list' ? 'chart' : 'list'"
                class="btn btn-sm btn-outline"
            >
                <i :class="view === 'list' ? 'icon-chart-bar' : 'icon-list'"></i>
            </button>
        </header>
        <Transition name="fade" mode="out-in">
            <slot v-if="view === 'list'" name="list"></slot>
            <slot v-else name="chart"></slot>
        </Transition>
    </div>
</template>

<style lang="css">
.stats-card {
    padding: 1rem;

    header {
        font-size: 1.25rem;
        margin-left: 10px;
        margin-bottom: 10px;

        display: flex;
        justify-content: space-between;

        button {
            width: 33px;
            height: 33px;
            border-radius: 10px;
            background-color: var(--background-color);
            font-size: 15px;
            transition: opacity 0.3s;

            opacity: 0.3;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>