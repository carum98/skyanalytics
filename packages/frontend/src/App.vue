<script setup lang="ts">
import { shallowRef, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const layouts = {
	default: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
	login: defineAsyncComponent(() => import('@/layouts/LoginLayout.vue')),
}

router.beforeEach((to, from, next) => {
	const layoutName = to.meta.layout || 'default'
	layout.value = layouts[layoutName]
	next()
})

const layout = shallowRef(layouts.default)
</script>

<template>
  	<component :is="layout">
		<RouterView />
  	</component>
</template>
