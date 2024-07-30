import { onMounted, ref } from 'vue'
import { $fetch } from '@/utils/fetch'

export function useFetch<T>(url: string, options?: RequestInit) {
    const data = ref<T | null>(null)
    const error = ref<any>(null)
    const loading = ref(false)
    
    async function fetchData() {
        try {
            loading.value = true
            const response = await $fetch(url, options)
            data.value = response
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    function refresh() {
        fetchData()
    }

    onMounted(fetchData)
    
    return {
        data,
        error,
        loading,
        refresh,
    }
}