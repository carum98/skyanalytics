import { SkyAnalyticsOptions, SkyAnalyticsPayloadBugReport, SkyAnalyticsPayloadEvent, SkyAnalyticsPayloadMetadata, SkyAnalyticsPayloadNavigation } from './types'

export class SkyAnalytics {
    private options: SkyAnalyticsOptions | undefined

    init(options: SkyAnalyticsOptions) {
        this.options = options;
    }

    get isInitialized() {
        return Boolean(this.options)
    }

    private send(payload: SkyAnalyticsPayloadEvent | SkyAnalyticsPayloadNavigation | SkyAnalyticsPayloadMetadata | SkyAnalyticsPayloadBugReport) {
        if (!this.isInitialized) {
            throw new Error('SkyAnalytics not initialized')
        }

        const { host, key } = this.options as SkyAnalyticsOptions

        return fetch(`${host}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SkyAnalytics-Key': key,
            },
            body: JSON.stringify(payload),
            credentials: 'include',
        })
    }

    event(payload: { name: string }) {
        return this.send({
            event: payload.name,
        })
    }

    navigation(payload: { name: string, metadata?: Record<string, string> }) {
        return this.send({
            navigation: payload.name,
			metadata: payload.metadata
        })
    }

    bugReport(payload: { description: string, user: { name: string, contact: string } }, metadata?: Record<string, string>) {
        return this.send({
            bug_report: {
                description: payload.description,
                user: {
                    name: payload.user.name,
                    contact: payload.user.contact,
                },
            },
            metadata,
        })
    }

    metadata(payload: Record<string, string>) {
        return this.send({
            metadata: payload,
        })
    }
}