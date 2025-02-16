import { SkyAnalyticsOptions, SkyAnalyticsPayloadBugReport, SkyAnalyticsPayloadEvent, SkyAnalyticsPayloadMetadata, SkyAnalyticsPayloadNavigation } from './types'

type Payload = SkyAnalyticsPayloadEvent | SkyAnalyticsPayloadNavigation | SkyAnalyticsPayloadMetadata | SkyAnalyticsPayloadBugReport

export class SkyAnalytics {
    private options: SkyAnalyticsOptions | undefined

    init(options: SkyAnalyticsOptions) {
        this.options = options;
    }

    get isInitialized() {
        return Boolean(this.options)
    }

    private send(payload: Payload, { transformToFormData = false } = {}) {
        if (!this.isInitialized) {
            throw new Error('SkyAnalytics not initialized')
        }

        const { host, key } = this.options as SkyAnalyticsOptions

        const body = transformToFormData 
            ? this.formDataTranform(payload)
            : JSON.stringify(payload)

        return fetch(`${host}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': transformToFormData ? 'multipart/form-data' : 'application/json',
                'X-SkyAnalytics-Key': key,
            },
            body: body,
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

    bugReport(payload: { description: string, user: { name: string, contact: string } }, metadata?: Record<string, string>, files?: File[]) {
        return this.send({
            bug_report: {
                description: payload.description,
                user: {
                    name: payload.user.name,
                    contact: payload.user.contact,
                },
                files,
            },
            metadata,
        }, { transformToFormData: files && files.length > 0 })
    }

    metadata(payload: Record<string, string>) {
        return this.send({
            metadata: payload,
        })
    }

    private formDataTranform(payload: Payload) {
        const formData = new FormData()

        for (const [key, value] of Object.entries(payload)) {
            formData.append(key, value)
        }

        return formData
    }
}