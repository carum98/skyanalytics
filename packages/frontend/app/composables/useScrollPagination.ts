import type { IPagination } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { useFetch } from './useFetch'

interface Response<T> {
    data: T[]
    pagination: IPagination
}

export function useScrollPagination<T>(params: Parameters<typeof useFetch>) {
	const el = ref<HTMLElement | null>(null)
	const items = ref<T[]>()
	const page = ref('1')
	
	let pagination: IPagination

	const url = params[0]
	const options = params[1]

	const { data } = useFetch<Response<T>>(url, {
		query: {
			...options?.query,
			page,
		},
		headers: options?.headers
	})

	function scroll(event: Event) {
		const target = event.target as HTMLElement

		if (target.scrollHeight - target.scrollTop === target.clientHeight) {
			if (pagination.page === pagination.total_pages) return
			page.value = (+page.value + 1) + ''
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