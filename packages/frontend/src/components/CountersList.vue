<script setup lang="ts">
defineProps<{
    items: Record<string, number>
}>()
</script>

<template>
    <ul class="counter-list">
        <li v-for="(item, key) in items" :key="key">
            <span>{{ key }}</span> <span>{{ item }}</span>
        </li>
    </ul>
</template>

<style lang="css">
.counter-list {
    li {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        color: #595959;
    }

    li:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.284);
    }
}
</style>