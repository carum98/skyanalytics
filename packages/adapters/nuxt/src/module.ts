import { defineNuxtModule, addPlugin, createResolver, addImports } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions } from './runtime/types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'skyanalytics',
  },
  defaults: {
    host: '',
    key: '',
    captureNavigation: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.skyanalytics = {
      ...nuxt.options.runtimeConfig.public.skyanalytics,
      ...options,
    };

    // Add plugin
    addPlugin({
      src: resolve('runtime/plugin.client'),
      mode: 'client',
    })

    // Add directive
    addPlugin({
      src: resolve('runtime/directives'),
    })

    // Add composable
    addImports({
      from: resolve('runtime/composables/useAnalytics'),
      name: 'useAnalytics',
    })
  },
})
