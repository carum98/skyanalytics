import { isRef, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref, type UnwrapRef } from 'vue'
import { $fetch, type FetchRequestOptions } from '@/utils/fetch'

type UseFetchRequestOptions<T> = Omit<FetchRequestOptions, 'query'> & { 
    query?: Record<string, Ref<string | undefined>> | Ref<Record<string, string | undefined> | undefined> | Record<string, string>
    watch?: Ref<string | undefined>[]
    immediate?: boolean
    transform?: (data: T) => any
}

export function useFetch<T>(url: string, options?: UseFetchRequestOptions<T>) {
    // data
    const data = ref<T>()
    const error = ref<any>(null)
    const loading = ref(false)

    let _watchers: ReturnType<typeof watch>[] = []
    
    // methods
    async function fetchData() {
        let _options: FetchRequestOptions | undefined

        if (options) {
            const { query, watch, immediate, ...rest } = options
            _options = { ...rest }
            if (query) {
                _options.query = processQuery({ query })
            }
        }

        try {
            loading.value = true
            const response = await $fetch<T>(url, _options)

            if (options?.transform) {
                data.value = options.transform(response)
            } else {
                data.value = response
            }
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    function processQuery(query: Pick<UseFetchRequestOptions<T>, 'query'>) {
        if (!query.query) {
            return undefined
        }

        if (isRef(query.query)) {
            return query.query.value
        }

        if (Object.values(query.query).some(isRef)) {
            return Object.fromEntries(
                Object.entries(query.query).map(([key, value]) => {
                    if (isRef(value)) {
                        return [key, value.value]
                    }

                    return [key, value]
                })
            ) as Record<string, string | undefined>
        }

        return query.query as Record<string, string | undefined>
    }

    // lifecycle
    onMounted(() => {
        if (options?.immediate === true || options?.immediate === undefined) {
            fetchData()
        }

        if (options?.watch) {
            _watchers = options.watch.map(w => watch(w, fetchData))
        }

        if (options?.query) {
            if (isRef(options.query)) {
                _watchers.push(watch(options.query, fetchData))
            } else {
                _watchers = Object.entries(options.query)
                    .filter(([_, value]) => isRef(value))
                    .map(([_, value]) => watch(value as Ref, fetchData)
                )
            }
        }
    })

    onUnmounted(() => {
        _watchers.forEach(w => w())
    })
    
    return {
        data,
        error,
        loading,
        refresh: () => fetchData(),
    }
}