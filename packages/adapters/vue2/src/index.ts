import type { DirectiveBinding, VueConstructor } from 'vue'
import type { SkyAnalyticsOptions } from '@skyanalytics/js/dist/types'

import skyanalytics from '@skyanalytics/js'

type HTMLElementWithRemoveListener = HTMLElement & { $removeListener: Function }

export default {
    install(vue: VueConstructor, options: SkyAnalyticsOptions & { enabled?: boolean }) {
        vue.prototype.$skyAnalytics = skyanalytics

        vue.directive('sk-analytics', {
            bind: (el: HTMLElementWithRemoveListener, binding: DirectiveBinding<{ event: string, data?: object }>) => {
                if (!skyanalytics.isInitialized) return

                function send() {
                    skyanalytics.event({ name: binding.value.event })
                }

                el.addEventListener('click', send)
                el.$removeListener = () => el.removeEventListener('click', send)
            },
            unbind: (el: HTMLElementWithRemoveListener) => {
                if (!skyanalytics.isInitialized) return

                el.$removeListener()
            }
        })

        // Initialize the analytics instance
        if (options.enabled !== false) {
            skyanalytics.init(options)
        }
    }
}

export function useAnalytics() {
    const analytics = skyanalytics.isInitialized 
        ? skyanalytics 
        : undefined

    function event(name: string) {
        analytics?.event({ name })
    }

    function navigate(name: string, metadata?: Record<string, string>) {
        analytics?.navigation({ name, metadata })
    }

    function bugReport(description: string, user: { name: string, contact: string }, metadata?: Record<string, string>, files?: File[]) {
        analytics?.bugReport({ description, user }, metadata, files)
    }

    function metadata(data: Record<string, string>) {
        analytics?.metadata(data)
    }

    return {
        event,
        navigate,
        metadata,
        bugReport,
    }
}