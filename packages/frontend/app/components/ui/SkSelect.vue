<script setup lang="ts">
import SkPopover from './SkPopover.vue';
import { ref, onMounted } from 'vue'

const props = defineProps<{
    options: Array<{ name: string, value: string }>
    name: string
    value?: string | null
    placeholder?: string | null
}>()

const selected = ref()

onMounted(() => {
    selected.value = props.options.find(option => option.value === props.value)
})
</script>

<template>
    <SkPopover position="bottom span-right">
        <template #target="{ props }">
            <input type="hidden" :name="name" :value="selected?.value" />
            <button type="button" class="sk-select" v-bind="props">
                <span :class="{ 'text-gray': !selected }">
                    {{ selected?.name ?? placeholder }}
                </span>
                <i class="icon-caret-down"></i>
            </button>
        </template>
        <template #popover="{ props }">
            <div class="sk-select__options" v-bind="props">
                <button
                    v-for="option in options"
                    :key="option.value"
                    :class="{ active: selected?.value === option.value }"
                    @click="selected = option"
                    type="button"
                >
                    {{ option.name }}
                </button>
            </div>
        </template>
    </SkPopover>
</template>

<style lang="css">
.sk-select {
    border: 2px solid rgba(177, 177, 177, 0.301);
    width: 100%;
    background-color: var(--table-color);
    border-radius: 15px;
    padding: 12px 20px;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;

    display: flex;
    justify-content: space-between;
}

.sk-select__options {
    width: anchor-size(width);

    button {
        white-space: nowrap;
        align-items: center;
        border-radius: 10px;
        color: rgba(var(--text-color-rgb), .9);
        display: flex;
        font-size: 15px;
        gap: 10px;
        padding: 8px 10px;
        min-width: 100%;

        background-color: #1a1c1eba;

        &:hover {
            background-color: #1a1c1e;
        }

        &:not(:last-of-type) {
            margin-bottom: 0.5rem;
        }

        &.active {
            background-color: var(--primary-color);
            color: var(--text-color);
        }
    }
}
</style>