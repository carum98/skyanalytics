<script setup lang="ts">
import { useFetch } from '@composables/useFetch'
import type { ILog, IReport } from '@shared/types'
import { computed, reactive } from 'vue'

const props = defineProps<{
	report: IReport
}>()

const path = reactive({
	folder: '',
	date: '',
})

const { data } = useFetch<Record<string, ILog[]>>(`/api/reports/${props.report.code}/logs`)

const folders = computed(() => Object.entries(data.value ?? {}).map(([name, value]) => ({name, count: value.length})))
const logs = computed(() => data.value?.[path.folder].map(log => ({date: log.date, count: log.logs.length, logs: log.logs})) ?? [])
const content = computed(() => logs.value.find(log => log.date === path.date)?.logs ?? [])

const relativePath = computed(() => {
	return Object.values(path).filter(Boolean).join('/')
})

function back() {
	if (path.date !== '') {
		path.date = ''
	} else {
		path.folder = ''
	}
}
</script>

<template>
	<section class="logs-view">
		<header>
			<button @click="back">
				<i class="icon-chevron-left"></i>
			</button>

			<p>{{ relativePath }}</p>
		</header>
		<main>
			<template v-if="path.folder === ''">
				<button v-for="{ name, count } in folders" @click="path.folder = name">
					{{ name }}
					<span>{{ count }}</span>
				</button>
			</template>

			<template v-else-if="path.date === ''">
				<button v-for="log in logs" @click="path.date = log.date">
					{{ log.date }}
					<span>{{ log.count }}</span>
				</button>
			</template>

			<div v-else class="logs">
				<div v-for="log in content" class="log">
					<div>
						<p>{{ log.time }}</p>
						<p :class="log.type">{{ log.type }}</p>
					</div>
					<p>{{ log.message }}</p>
				</div>
			</div>
		</main>
	</section>
</template>

<style>
.logs-view {
	header {
		display: flex;
        align-items: center;
        justify-content: start;
		gap: 20px;

		button {
			background-color: var(--table-color);
			border-radius: 15px;
			width: 40px;
			height: 40px;
		}

		p {
			font-size: 20px;
		}
	}

	main {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		padding-top: 20px;

		button {
			padding: 15px 15px 15px 20px;
			border-radius: 15px;
			background-color: var(--table-color);
			font-size: 16px;
			text-transform: capitalize;

			span {
				margin-left: 10px;
				background-color: var(--primary-color);
				border-radius: 10px;
				padding: 5px 10px;
			}
		}

		.logs {
			display: flex;
			flex-direction: column;
			gap: 10px;
			height: 80vh;
			width: 100%;
			overflow-y: auto;
		}

		.log {
			padding: 15px;
			border-radius: 15px;
			text-align: left;
			background-color: var(--table-color);

			div {
				display: flex;
				justify-content: space-between;
				gap: 20px;
				margin-bottom: 15px;

				p {
					font-size: 16px;
					border-radius: 10px;
					padding: 5px 10px;
				}

				p:first-child {
					background-color: var(--background-color);
					color: gray;
				}

				p:last-child {
					&.error {
						color: rgba(255, 0, 0, 0.52);
						background-color: color-mix(in lab, black 70%, currentColor);
					}

					&.debug {
						color: gray;
						background-color: color-mix(in lab, black 70%, currentColor);
					}

					&.info {
						color: blue;
						background-color: color-mix(in lab, black 70%, currentColor);
					}

					&.warning {
						color: rgba(255, 255, 0, 0.52);
						background-color: color-mix(in lab, black 70%, currentColor);
					}
				}
			}
		}
	}
}
</style>