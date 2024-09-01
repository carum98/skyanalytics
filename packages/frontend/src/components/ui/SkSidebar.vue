<script setup lang="ts">
import { onMounted, ref } from 'vue'

withDefaults(defineProps<{
    width?: number
    position?: 'left' | 'right'
}>(), {
    width: 600,
    position: 'right'
})

const dialog = ref<HTMLDialogElement>()

const emits = defineEmits<{
    close: []
}>()

function open() {
    dialog.value?.showModal()
}

function close() {
    dialog.value?.close()
    emits('close')
}

onMounted(() => {
    setTimeout(open, 200)

    // Close the dialog when the user clicks outside it
    dialog.value?.addEventListener('click', (event) => {
        const rect = dialog.value!.getBoundingClientRect()

        const isInDialog = (
            rect.top <= event.clientY && event.clientY <= rect.bottom &&
            rect.left <= event.clientX && event.clientX <= rect.right
        )

        if (!isInDialog) {
            dialog.value?.close()
        }
    })

    // Listen when the dialog is closed
    dialog.value?.addEventListener('close', () => setTimeout(close, 550))
})
</script>

<template>
    <dialog 
        ref="dialog" 
        class="sk-sidebar" 
        :class="position"
        :style="{ width: width + 'px' }"
    >
        <slot />
    </dialog>
</template>

<style lang="css">
.sk-sidebar {
    border: unset;
    height: 100vh;
    max-height: 100vh;

    background-color: var(--background-color);

    animation-duration: 0.5s;
    animation-fill-mode: forwards;

    &.left {
        animation-name: outLeftToRight;
    }

    &.right {
        margin-left: auto;
        animation-name: outRightToLeft;
    }

    &::backdrop {
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }

    &:focus {
        outline: none;
    }
}

.sk-sidebar[open] {
    &.left {
        animation-name: inLeftToRight;
    }

    &.right {
        animation-name: inRightToLeft;
    }

    &::backdrop {
        opacity: 1;
    }
}

.sk-sidebar, .sk-sidebar::backdrop {
    transition: opacity 0.5s, display 0.5s allow-discrete, overlay 0.5s allow-discrete;
}

@starting-style {
    .sk-sidebar[open]::backdrop {
        opacity: 0;
    }
}

@keyframes inRightToLeft {
    from { transform: translateX(100%) }
    to { transform: translateX(0) }
}

@keyframes outRightToLeft {
    from { transform: translateX(0) }
    to { transform: translateX(100%) }
}

@keyframes inLeftToRight {
    from { transform: translateX(-100%) }
    to { transform: translateX(0) }
}

@keyframes outLeftToRight {
    from { transform: translateX(0) }
    to { transform: translateX(-100%) }
}
</style>