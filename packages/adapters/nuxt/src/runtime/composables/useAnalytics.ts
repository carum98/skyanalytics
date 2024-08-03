import type { SkyAnalytics } from '@skyanalytics/js/dist/skyanalytics'
import { useNuxtApp } from '#imports'

export function useAnalytics() {
  if (import.meta.server) {
    return
  }

  const skyanalytics = useNuxtApp().$skyanalytics as SkyAnalytics

  function event(name: string, _data?: object) {
    skyanalytics.event({ name }).then()
  }

  function navigate(name: string) {
    skyanalytics.navigation({ name }).then()
  }

  return {
    event,
    navigate,
  }
}
