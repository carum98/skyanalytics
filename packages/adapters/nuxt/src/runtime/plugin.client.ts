import skyanalytics from '@skyanalytics/js'
import type { ModuleOptions } from './types'
import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#app'
import { nextTick } from '#imports'

export default defineNuxtPlugin({
  name: 'skyanalytics',
  setup() {
    // Get the module options
    const options = useRuntimeConfig().public.skyanalytics as ModuleOptions

    // Initialize the analytics client
    skyanalytics.init(options)

    // Capture navigation events
    if (options.captureNavigation) {
      const router = useRouter()

      router.afterEach((to, from, failure) => {
        if (!failure) {
          nextTick(() => {
            if (to.name !== from.name) {
              skyanalytics.navigation({
                name: to.name?.toString() || to.path
              })
            }
          })
        }
      })
    }

    return {
      provide: {
        skyanalytics,
      },
    }
  },
})
