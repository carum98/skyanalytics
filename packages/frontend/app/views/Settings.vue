<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<div class="flex ga-1">
		<nav class="nav-sidebar">
			<RouterLink :to="{ name: 'settings.users' }">
				<i class="icon-users"></i>
				Users
			</RouterLink>
			<RouterLink :to="{ name: 'settings.summary' }">
				<i class="icon-envelope"></i>
				Summary
			</RouterLink>
			<RouterLink :to="{ name: 'settings.bug-report' }">
				<i class="icon-bug"></i>
				Bug Report
			</RouterLink>
		</nav>

		<div class="w-100">
			<RouterView />
		</div>
	</div>
</template>

<style scoped lang="css">
.nav-sidebar {
	width: 250px;
	background-color: var(--table-color);
	border-radius: 15px;
}
</style>