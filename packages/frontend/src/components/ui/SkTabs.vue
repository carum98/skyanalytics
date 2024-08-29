<script setup lang="ts">
import { onMounted } from 'vue'
import { watch, ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'

const router = useRouter()

const gutter = ref<HTMLSpanElement | null>(null)

defineProps<{
    tabs: Array<{ label: string, to: RouteLocationRaw }>
}>()

onMounted(() => {
    watch(router.currentRoute, () => {
        if (!gutter.value) return

        const { offsetLeft, offsetWidth } = document.querySelector('.sk-tabs__item.router-link-active') as HTMLElement
        gutter.value.style.left = `${offsetLeft}px`
        gutter.value.style.width = `${offsetWidth}px`
    }, { immediate: true, flush: 'post' })
})
</script>

<template>
    <nav class="sk-tabs">
        <RouterLink
            v-for="tab in tabs"
            :key="tab.label"
            :to="tab.to"
            class="sk-tabs__item"
            replace
        >
            {{ tab.label }}
        </RouterLink>

        <span ref="gutter" class="sk-tabs__gutter"></span>
    </nav>
</template>

<style lang="css">
.sk-tabs {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    align-items: center;
    gap: 10px;

    background-color: var(--table-color);
    padding: 5px;
    border-radius: 30px;

    position: relative;

    height: 40px;
}

.sk-tabs__item {
    padding: 0px 15px;
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    z-index: 2;
}

.sk-tabs__gutter {
    position: absolute;
    inset: 6px;
    background-color: var(--primary-color);
    border-radius: 30px;
    transition: left 0.3s, width 0.3s;
    z-index: 1;
}
</style>