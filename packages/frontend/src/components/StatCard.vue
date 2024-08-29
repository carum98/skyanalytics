<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    title: string
}>()

defineEmits<{
    'openExternal': []
}>()

const view = ref('list')
</script>

<template>
    <div class="placeholder stats-card">
        <header v-if="title">
            <p>
                {{ title }}
                <button 
                    @click="$emit('openExternal')"
                    class="open-external"
                >
                    <i class="icon-arrow-up-right"></i>
                </button>
            </p>

            <button 
                @click="view = view === 'list' ? 'chart' : 'list'"
                class="toogle-view"
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

        .open-external {
            color: gray;
        }

        .toogle-view {
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