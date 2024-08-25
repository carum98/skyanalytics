<script setup lang="ts" generic="T">
defineProps<{
    data: Array<T>
    columns: Array<string>
}>()
</script>

<template>
    <table class="sk-table">
        <thead>
            <tr>
                <th v-for="column in columns" :key="column">{{ column }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data">
                <td v-for="column in columns" :key="column">
                    {{ (row as Record<string, unknown>)[column] }}
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
        text-align: left;
    }

    & th {
        padding: 8px var(--padding);
        color: rgba(var(--text-color-rgb), 0.8);
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

    & .table-empty td {
        height: 200px;
        text-align: center;
    }
}

</style>