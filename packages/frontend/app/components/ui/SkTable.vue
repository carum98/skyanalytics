<script setup lang="ts" generic="T">
import { getCurrentInstance } from 'vue'

type Column = {
    name: string
    key: string
    thClass?: string
    tdClass?: string
	width?: string
}

defineProps<{
    data: Array<T>
    columns: Array<Column>
}>()

defineEmits<{
    onRowClick: [T]
}>()

function rowContent(row: T, column: string) {
    if (column.includes('.')) {
        const [parent, child] = column.split('.')
        const parentObj = (row as Record<string, unknown>)[parent] as Record<string, unknown>
        return parentObj[child]
    }

    return (row as Record<string, unknown>)[column]
}

const hasRowClick = !!getCurrentInstance()?.vnode?.props?.onOnRowClick
</script>

<template>
    <table class="sk-table">
        <thead>
            <tr>
                <th 
					v-for="column in columns" 
					:key="column.key" 
					:class="column.thClass"
					:style="{ width: column.width }"
				>
                    {{ column.name }}
                </th>
            </tr>
        </thead>
        <tbody :class="{ 'table-hover': hasRowClick }">
            <tr v-for="row in data" @click="$emit('onRowClick', row)">
                <td v-for="column in columns" :key="column.key" :class="column.tdClass">
                    <slot
                        :name="`cell(${column.key})`"
                        :value="rowContent(row, column.key)"
                        :item="row"
                        :column="column"
                    >
                        {{ rowContent(row, column.key) }}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="css">
.sk-table {
    border-collapse: separate;
    border-spacing: 0 10px;
    width: 100%;

    --border-radius: 12px;
    --padding: 15px;

    &.hover tbody tr:hover:not(:has(a:hover), .table-empty, :has(button:hover)) {
        cursor: pointer;
        background-color: rgba(var(--table-color-rgb), 0.4);

        & .sk-avatar {
            view-transition-name: avatar;
        }
    }

    & tr {
        background-color: var(--table-color);
        transition: background-color 0.2s;
    }

    & th, & td {
        line-height: 1.5;
        vertical-align: middle;
    }

    & th {
        padding: 8px var(--padding);
        color: rgba(var(--text-color-rgb), 0.8);
        font-weight: 600;
    }

    & td {
        padding: var(--padding);
    }

    & th:first-child, & td:first-child {
        border-bottom-left-radius: var(--border-radius);
        border-top-left-radius: var(--border-radius);
        padding-left: var(--padding);
    }

    & th:last-child, & td:last-child {
        border-bottom-right-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        padding-right: var(--padding);
    }

    thead {
        position: sticky;
        top: 10px;
        z-index: 2;
    }

    & .table-empty td {
        height: 200px;
        text-align: center;
    }

    & .table-hover tr:hover {
        cursor: pointer;
        background-color: rgba(var(--table-color-rgb), 0.5);
    }
}

</style>