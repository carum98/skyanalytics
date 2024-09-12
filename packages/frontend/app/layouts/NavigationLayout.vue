<script setup lang="ts">
import { useSession } from '@shared/composables/useSession'
import { RouterLink } from 'vue-router'

const { session } = useSession()

const items = [
	{
		label: 'Dashboard',
		icon: 'icon-grid-2',
		to: { name: 'home' }
	},
	{
		label: 'Map',
		icon: 'icon-map',
		to: { name: 'map' }
	},
	{
		label: 'Bug Report',
		icon: 'icon-bug',
		to: { name: 'bug-report' }
	},
	{
		label: 'Settings',
		icon: 'icon-gear',
		to: { name: 'settings' },
		class: 'mt-auto',
		roles: ['admin']
	}
]
</script>

<template>
	<nav class="nav-sidebar">
		<RouterLink
			v-for="item in items"
			:to="item.to"
			:key="item.to.name"
			@click="() => $emit('close')"
			:class="item.class"
			v-show="!item.roles || item.roles.includes(session!.role)"
		>
			<i :class="item.icon"></i>
			{{ item.label }}
		</RouterLink>
	</nav>
</template>