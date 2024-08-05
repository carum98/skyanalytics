export interface ISources {
    code: string
    name: string
    key: string
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

export interface IViewsStats {
    [key: string]: number
}

export interface IStats {
    os: IViewsStats
    software: IViewsStats
    country: IViewsStats
}