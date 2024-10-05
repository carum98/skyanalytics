<script setup lang="ts">
import type { ISources } from '@shared/types'

const props = defineProps<{
    item: ISources
}>()

function onCopy() {
    navigator.clipboard.writeText(props.item.key)
}
</script>

<template>
    <div class="source-key">
        {{ item.key }}
        
        <button @click="onCopy">
            <i class="icon-copy"></i>
        </button>
    </div>
</template>

<style lang="css">
.source-key {
    padding: 1rem;
    border-radius: 15px;
    background-color: var(--table-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: space-between;

    button {
        visibility: hidden;
    }

    &:hover button {
        visibility: visible;
    }
}
</style>