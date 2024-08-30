import type { IPagination } from '@/types'
import { onMounted, ref, watch, type Ref } from 'vue'
import type { useFetch } from './useFetch'

interface Response<T> {
    data: T[]
    pagination: IPagination
}

export function useScrollPagination<T>(callback: () => ReturnType<typeof useFetch<Response<T>>>) {
	const el = ref<HTMLElement | null>(null)
	const items = ref<T[]>()
	
	let pagination: IPagination

	const { data, refresh } = callback()

	function scroll(event: Event) {
		const target = event.target as HTMLElement

		if (target.scrollHeight - target.scrollTop === target.clientHeight) {
			console.log('Bottom reached')
			console.log(pagination.total, items.value?.length)

			if (pagination.total === items.value?.length) return

			refresh()
		}
	}

	watch(data, (newData) => {
		if (newData) {
			items.value = [...items?.value ?? [], ...newData.data]
			pagination = newData.pagination
		}
	})

	onMounted(() => {
		if (!el.value) return

		el.value.addEventListener('scroll', scroll)

		el.value.style.overflowY = 'scroll'
		el.value.style.height = '100%'
	})

	return {
		el,
		items
	}
}