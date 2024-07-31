<script setup lang="ts">
import { shallowRef, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const layouts: Record<string, any> = {
	default: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
	login: defineAsyncComponent(() => import('@/layouts/LoginLayout.vue')),
}

router.beforeEach((to, _from, next) => {
	const layoutName = to.meta.layout as string || 'default'
	layout.value = layouts[layoutName]
	next()
})

const layout = shallowRef(layouts.default)

router.afterEach((to, from) => {
  	const toDepth = to.path.split('/').length
  	const fromDepth = from.path.split('/').length
  	to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
</script>

<template>
  	<component :is="layout">
		<RouterView v-slot="{ Component }">
    		<Transition :name="route.meta.transition as string" mode="out-in">
				<KeepAlive>
					<Component :is="Component" />
				</KeepAlive>
			</Transition>
  		</RouterView>
  	</component>
</template>
