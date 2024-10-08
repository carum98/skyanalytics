import type { DirectiveBinding, App } from 'vue'
import type { SkyAnalyticsOptions } from '@skyanalytics/js/dist/types'

import skyanalytics from '@skyanalytics/js'

type HTMLElementWithRemoveListener = HTMLElement & { $removeListener: Function }

export default {
    install(app: App, options: SkyAnalyticsOptions & { enabled?: boolean }) {
		if (!options.enabled) {
			return
		}

        skyanalytics.init(options)

        app.config.globalProperties.$skyAnalytics = skyanalytics

        app.provide('skyAnalytics', skyanalytics)

        app.directive('sk-analytics', {
            created: (el: HTMLElementWithRemoveListener, binding: DirectiveBinding<{ event: string, data?: object }>) => {
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
            }
        })
    }
}

export function useAnalytics() {
    function event(name: string) {
        skyanalytics.event({ name })
    }

    function navigate(name: string, metadata?: Record<string, string>) {
        skyanalytics.navigation({ name, metadata })
    }

    function metadata(data: Record<string, string>) {
        skyanalytics.metadata(data)
    }

    return {
        event,
        navigate,
        metadata
    }
}