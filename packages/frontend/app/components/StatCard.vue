<script setup lang="ts">
defineProps<{
    title: string
	disableExternal?: boolean
}>()

defineEmits<{
    'openExternal': []
}>()
</script>

<template>
    <div class="placeholder stats-card">
        <header v-if="title">
            <p>
                {{ title }}
                <button 
					v-if="!disableExternal"
                    @click="$emit('openExternal')"
                    class="open-external"
                >
                    <i class="icon-arrow-up-right"></i>
                </button>
            </p>
        </header>
		<slot></slot>
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
    }
}
</style>