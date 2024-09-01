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

export interface IView {
    id: number
    name: string
    created_at: string
    session: ISession
}

export interface IViewPagination {
    data: IView[]
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
}

export interface IMapLocation {
	code: string
	name: string
	locations: Array<ILocationStat>
}