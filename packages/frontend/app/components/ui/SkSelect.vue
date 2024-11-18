<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SkPopover from './SkPopover.vue'

type Option = { name: string, value: string }

const props = defineProps<{
    options: Array<Option>
    name: string
    value?: string | null
    placeholder?: string | null
    multiple?: boolean
}>()

// data
const selected = ref()

// computed
const inputValue = computed(() => {
    return props.multiple
        ? selected.value.map((item: Option) => item.value).join(',')
        : selected.value?.value
})

// methods
function onSelect(option: Option) {
    if (props.multiple) {
        const index = selected.value.findIndex((item: Option) => item.value === option.value)
        if (index === -1) {
            selected.value.push(option)
        } else {
            selected.value.splice(index, 1)
        }
    } else {
        selected.value = option
    }
}

function isActived(option: Option) {
    return props.multiple
        ? selected.value?.some((item: Option) => item.value === option.value)
        : selected.value?.value === option.value
}

// hooks
watch(() => props.options, (value) => {
    selected.value = props.multiple
        ? value.filter(option => props.value?.split(',').includes(option.value))
        : value.find(option => option.value === props.value)
}, { immediate: true })
</script>

<template>
    <SkPopover position="bottom span-right">
        <template #target="{ props }">
            <input type="hidden" :name="name" :value="inputValue" />
            <button type="button" class="sk-select" v-bind="props">
                <div v-if="multiple" class="multiple">
                    <span v-for="item in selected" :key="item.value">
                        {{ item.name }}
                    </span>
                </div>
                <span v-else :class="{ 'text-gray': !selected }">
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
                    :class="{ active: isActived(option) }"
                    @click="onSelect(option)"
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

    .multiple {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        span {
            background-color: var(--background-color);
            color: var(--text-color);
            padding: 5px 10px;
            border-radius: 10px;
        }
    }
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