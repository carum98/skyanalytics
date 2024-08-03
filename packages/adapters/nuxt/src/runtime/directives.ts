import type { DirectiveBinding } from 'vue'
import type { SkyAnalytics } from '@skyanalytics/js/dist/skyanalytics'
import { defineNuxtPlugin, useNuxtApp } from '#app'

type HTMLElementWithRemoveListener = HTMLElement & { $removeListener: () => void }

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('sk-analytics', {
    created: (el: HTMLElementWithRemoveListener, binding: DirectiveBinding<{ event: string, data?: object }>) => {
      const skyanalytics = useNuxtApp().$skyanalytics as SkyAnalytics

      async function send() {
        await skyanalytics.event({
          name: binding.value.event,
        })
      }

      el.addEventListener('click', send)

      el.$removeListener = () => {
        el.removeEventListener('click', send)
      }
    },
    unmounted: (el: HTMLElementWithRemoveListener) => {
      el.$removeListener()
    },
    getSSRProps: () => {
      return {}
    },
  })
})
