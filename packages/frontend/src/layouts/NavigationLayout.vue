<script setup lang="ts">
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
	}
]
</script>

<template>
	<nav class="sidebar-navigation">
		<RouterLink
			v-for="item in items"
			:to="item.to"
			:key="item.to.name"
			@click="() => $emit('close')"
		>
			<i :class="item.icon"></i>
			{{ item.label }}
		</RouterLink>
	</nav>
</template>

<style lang="css">
.sidebar-navigation {
	display: flex;
	flex-flow: column;
	gap: 1rem;

	padding: 1rem;

	a {
		background-color: var(--table-color);
		padding: 0.5rem 1rem;
		text-decoration: none;
		border-radius: 10px;

		transition: background-color 0.2s;

		i {
			margin-right: 10px;
		}

		&:hover {
			background-color: rgba(242, 245, 252, 0.06);
		}

		&.router-link-active {
			background-color: var(--primary-color);
			color: white;
		}
	}
}
</style>