<script setup lang="ts">
import { useLinkPopover, type Position } from '@composables/useLinkPopover'

const props = defineProps<{
    position: Position
}>()

const { anchor, positionedElement } = useLinkPopover({ position: props.position })
</script>

<template>
    <slot name="target" :props="anchor" />
    <slot name="popover" :props="positionedElement" />
</template>