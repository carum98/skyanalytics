import type { InternalApi } from 'nitropack'

export interface IMetrics {
    views: number
    visitors: number
}

export interface ISources {
    code: string
    name: string
    key: string
    icon_path: string | null
    domain: string | null
    type: 'web' | 'app' | null
}

export interface ISourcesPagination {
    data: ISources[]
    pagination: IPagination
}

export interface IPagination {
    page: number
    total: number
    per_page: number
    total_pages: number
}

export interface IView {
	[key: string]: { views: number, sessions: number, reports: number }
}

export interface ISources {
    code: string
    name: string
    key: string
    icon_path: string | null
    domain: string | null
    type: 'web' | 'app' | null
}

export interface ISourcesPagination {
    data: ISources[]
    pagination: IPagination
}

export interface ISession {
    country: string
    os: string
    software: string
}

export interface ISessionPagination {
    data: ISession[]
    pagination: IPagination
}

export interface IViewPagination {
    data: {
		id: number
		name: string
		created_at: string
		session: ISession
	}[]
    pagination: IPagination
}

export interface IEvent {
	id: number
	name: string
	created_at: string
	session: ISession
}

export interface IEventPagination {
	data: IEvent[]
	pagination: IPagination
}

export interface IPagination {
    page: number
    total: number
    per_page: number
    total_pages: number
}

export interface IMetrics {
    views: number
    visitors: number
    reports: number
}

export interface IViewsStats {
    [key: string]: number
}

export interface ILocationStat {
    latitude: number
    longitude: number
}

export interface IStats {
    os: IViewsStats
    software: IViewsStats
    country: IViewsStats
    navigations: IViewsStats
    events: IViewsStats
    location: Array<ILocationStat>
	metadata: Record<string, IViewsStats> | null
}

export interface IMapLocation {
	code: string
	name: string
	locations: Array<ILocationStat>
}

export interface IUser {
	code: string
	email: string
	name: string
	role: string
}

export interface IUserPagination {
	data: IUser[]
	pagination: IPagination
}

export interface IReport {
    code: string
    description: string
    created_at: string
    source: Pick<ISources, 'code' | 'name' | 'icon_path'>
    session: ISession
}

export interface IReportPagination {
    data: IReport[]
    pagination: IPagination
}

// Types route
type ApiRoutes = keyof InternalApi
type ApiResponse<T extends ApiRoutes, M extends keyof InternalApi[T]> = InternalApi[T][M]

// Auto-generated types don't work outside of server folder so we need to manually define them
export type ApiStats = 
	// ApiResponse<'/api/stats', 'get'> // Auto-generated type for '/api/stats' GET
	Array<ISources & {
		metrics: IMetrics;
		views: IView;
	}>

export type ApiSettingsSummary = {
    enabled: boolean
    date_range: {
        value: string
        name: string
    }
    users: string[]
}