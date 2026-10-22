<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	total_pages?: number
}>()

const page = defineModel<number>('page', {
	required: true,
})

// First, last and current ±1; null marks a gap rendered as "…"
const pages = computed(() => {
	const total = props.total_pages ?? 0
	const result: (number | null)[] = []

	for (let i = 1; i <= total; i++) {
		if (i === 1 || i === total || Math.abs(i - page.value) <= 1) {
			result.push(i)
		} else if (result.at(-1) !== null) {
			result.push(null)
		}
	}

	return result
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
		
		<template v-for="(i, index) in pages" :key="i ?? `gap-${index}`">
			<span v-if="i === null">…</span>
			<button
				v-else
				@click="onPageChange(i)"
				:class="{ active: i === page }"
			>
				{{ i }}
			</button>
		</template>

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