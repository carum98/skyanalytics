<script setup lang="ts">
import { onMounted, ref } from 'vue'

withDefaults(defineProps<{
    width?: number
}>(), {
    width: 400
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

function closeButton() {
    // Create form with dialog method and submit it to close the dialog
    const form = document.createElement('form')
    form.style.display = 'none'
    form.method = 'dialog'
    dialog.value?.appendChild(form)
    form.submit()   
}

onMounted(() => {
    setTimeout(open, 200)

    // Listen when the dialog is closed
    dialog.value?.addEventListener('close', () => setTimeout(close, 550))
})
</script>

<template>
    <dialog ref="dialog" class="sk-dialog">
        <button id="close" @click="closeButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L12 13.4Z"/></svg>
        </button>

        <main :style="{ width: width + 'px' }">
            <slot />
        </main>
    </dialog>
</template>

<style lang="css">
.sk-dialog {
    border: unset;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    overflow: visible;

    margin: auto;
    padding: 25px;
    background-color: var(--background-color);

    &::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }

    & #close {
        position: absolute;
        top: -35px;
        right: -45px;
        color: #fff;

        & svg {
            width: 40px;
            height: 40px;
        }
    }
}

.sk-dialog {
    transform: translateY(-50px);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s, display 0.5s allow-discrete;
}

.sk-dialog[open] {
    transform: translateY(0);
    opacity: 1;
}

@starting-style {
    .sk-dialog[open] {
        transform: translateY(20px);
        opacity: 0;
    }
}
</style>