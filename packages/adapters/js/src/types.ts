export interface SkyAnalyticsOptions {
    key: string
    host: string
}

export interface SkyAnalyticsPayloadEvent {
    event: string
}

export interface SkyAnalyticsPayloadNavigation {
    navigation: string
	metadata?: Record<string, string>
}

export interface SkyAnalyticsPayloadMetadata {
    metadata: Record<string, string>
}