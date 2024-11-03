<script setup lang="ts">
import { useLinkPopover } from '@composables/useLinkPopover'

defineProps<{
  metadata: Record<string, string> | null
}>()

const { anchor, positionedElement, show, close } = useLinkPopover({ 
	position: 'bottom span-left', 
	popoverMode: 'manual'
})
</script>

<template>
	<span 
		class="medata-badge" 
		:class="{ 'disabled': !metadata }" 
		v-bind="anchor" 
		@mouseenter="show" 
		@mouseleave="close"
	>
		<i class="icon-database"></i>
	</span>
	<div class="medata-info" v-bind="positionedElement">
		<p v-for="(value, key) in metadata" :key="key">
			{{ key }} <span>{{ value }}</span>
		</p>
	</div>
</template>

<style lang="css">
.medata-badge {
	display: inline-flex;
	width: 35px;
	height: 35px;
	border-radius: 10px;
	background-color: var(--background-color);
	font-size: 16px;
	cursor: pointer;
	justify-content: center;
	align-items: center;

	color: gray;

	&.disabled {
		cursor: not-allowed;
		opacity: 0.3;
	}
}

.medata-info {
	text-align: left;

	p {
		background-color: var(--background-color);
		border-radius: 10px;
		padding: 8px 10px;

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;

		span {
			background-color: red;
			padding: 3px 10px;
			border-radius: 10px;
			background-color: var(--table-color);
		}
	}

	p:not(:last-child) {
		margin-bottom: 10px;
	}
}
</style>