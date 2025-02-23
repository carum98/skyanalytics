<script setup lang="ts">
const props = defineProps<{
	total_pages?: number
}>()

const page = defineModel<number>('page', {
	required: true,
})

function onPageChange(newPage: number) {
	page.value = newPage
}

function onPrev() {
	if (page.value > 1) {
		page.value--
	}
}

function onNext() {
	if (page.value < (props.total_pages ?? 0)) {
		page.value++
	}
}
</script>

<template>
	<div class="sk-pagination">
		<button @click="onPrev" :disabled="page === 1">
			<i class="icon-chevron-left"></i>
		</button>
		
		<button 
			v-for="i in total_pages" 
			:key="i" @click="onPageChange(i)" 
			:class="{ active: i === page }"
		>
			{{ i }}
		</button>

		<button @click="onNext" :disabled="page === total_pages">
			<i class="icon-chevron-right"></i>
		</button>
	</div>
</template>

<style>
.sk-pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;

	button {
		width: 35px;
		height: 35px;
		border-radius: 10px;
		font-size: 16px;

		&.active {
			background-color: var(--primary-color);
			color: white;
		}
	}

	button:last-of-type, button:first-of-type {
		background-color: var(--table-color);
	}
}
</style>