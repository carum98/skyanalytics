import { SkyAnalyticsOptions, SkyAnalyticsPayloadEvent, SkyAnalyticsPayloadNavigation } from './types'

export class SkyAnalytics {
    private options!: SkyAnalyticsOptions

    init(options: SkyAnalyticsOptions) {
        this.options = options;
    }

    private send(payload: SkyAnalyticsPayloadEvent | SkyAnalyticsPayloadNavigation) {
        const { host, key } = this.options

        return fetch(`${host}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SkyAnalytics-Key': key,
            },
            body: JSON.stringify(payload),
        })
    }

    event(payload: { name: string }) {
        return this.send({
            event: payload.name,
        })
    }

    navigation(payload: { name: string }) {
        return this.send({
            navigation: payload.name,
        })
    }
}