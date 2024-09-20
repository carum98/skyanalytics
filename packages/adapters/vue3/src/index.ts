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
    function event(name: string, data?: Object) {
        skyanalytics.event({ name }).then()
    }

    function navigate(name: string) {
        skyanalytics.navigation({ name }).then()
    }

    return {
        event,
        navigate
    }
}