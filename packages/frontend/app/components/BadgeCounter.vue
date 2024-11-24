<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    value: number
    text: string
    color: string
}>()

const disabled = computed(() => !Boolean(props.value))
</script>

<template>
	<button 
        class="badge-counter" 
        :disabled="disabled"
    >
        <span class="badge-counter__circle" :class="{ disabled }"></span>
        {{ value }}
        <span class="text-gray">{{ text }}</span>
    </button>
</template>

<style lang="css">
.badge-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    overflow: visible;
    border-radius: 5px;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        cursor: pointer;
        background-color: var(--background-color);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.badge-counter__circle {
    display: inline-block;
    height: 13px;
    width: 13px;
    background-color: v-bind(color);
    border-radius: 50%;
    animation: pulse 2s infinite;

    &.disabled {
        background-color: gray;
        animation: none;
    }
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 v-bind(color) }
    70% { box-shadow: 0 0 0 10px rgba(145, 243, 88, 0) }
    100% { box-shadow: 0 0 0 50px rgba(145, 243, 88, 0) }
}
</style>