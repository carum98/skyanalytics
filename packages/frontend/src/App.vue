<template>
	<nav>
		<RouterLink :to="{ name: 'home' }">Go to Home</RouterLink>
		<RouterLink :to="{ name: 'login' }">Go to Login</RouterLink>
  	</nav>
  	<main>
		<RouterView />
  	</main>
</template>
