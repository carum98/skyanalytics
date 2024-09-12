import { $fetch } from '@/utils/fetch'
import { onMounted, ref } from 'vue'

type Session = {
	name: string
	role: 'admin' | 'guest'
}

const session = ref<Session>()

export function useSession() {
	const loading = ref(true)

	onMounted(async () => {
		if (session.value) {
			return
		}

		try {
			session.value = await $fetch<Session>('/api/session')
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
		}
	})

	return {
		session,
		loading
	}
}