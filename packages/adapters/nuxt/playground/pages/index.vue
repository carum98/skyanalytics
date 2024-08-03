<template>
  <div>
    Nuxt module playground!

    <button @click="sendComposable">
      Send composable
    </button>

    <button v-sk-analytics="{ event: 'sendDirective' }">
      Send directive
    </button>

    <RouterLink :to="{ name: 'page1' }">
      Go to Page 1
    </RouterLink>

    <RouterLink :to="{ name: 'page2' }">
      Go to Page 2
    </RouterLink>
  </div>
</template>

<script setup>
const analytics = useAnalytics()

function sendComposable() {
  analytics.event('sendComposable')
}
</script>
