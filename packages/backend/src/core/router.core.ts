import util from 'node:util'
import { RequestHandler, Router, RequestParamHandler } from 'express'

type RouteCoreMethod = 'get' | 'post' | 'put' | 'delete'

type RouteCoreMiddleware = RequestParamHandler[] | RequestParamHandler

interface RouteCoreParams {
    name: string
    middlewares?: RouteCoreMiddleware
    handler: RequestParamHandler
}

type RouterCoreRequestHandler = (params: RouteCoreParams) => void

interface IRouterCoreConstructor {
    path: string
    middlewares?: RouteCoreMiddleware
}

interface IRouterCore {
    readonly path: string
    readonly router: Router

    get: RouterCoreRequestHandler
    post: RouterCoreRequestHandler
    put: RouterCoreRequestHandler
    delete: RouterCoreRequestHandler
}

export abstract class RouterCore implements IRouterCore {
    public readonly path: string
    public readonly router: Router

    private readonly _middlewares?: RouteCoreMiddleware

    constructor (params: IRouterCoreConstructor) {
        this.path = params.path
        this.router = Router()

        this._middlewares = params.middlewares
    }

    public get (params: RouteCoreParams): void {
        this._requestHandler('get', params)
    }

    public post (params: RouteCoreParams): void {
        this._requestHandler('post', params)
    }

    public put (params: RouteCoreParams): void {
        this._requestHandler('put', params)
    }

    public delete (params: RouteCoreParams): void {
        this._requestHandler('delete', params)
    }

    private _requestHandler (method: RouteCoreMethod, params: RouteCoreParams): void {
        this.router[method](
            params.name,
            this._combineMiddlewares(params.middlewares),
            util.callbackify(params.handler) as RequestHandler
        )
    }

    private _combineMiddlewares(localMiddlewares?: RouteCoreMiddleware): RequestHandler[] {
        const globalMiddlewares = Array.isArray(this._middlewares)
            ? this._middlewares
            : this._middlewares ? [this._middlewares] : [];

        const combinedMiddlewares = Array.isArray(localMiddlewares)
            ? localMiddlewares
            : localMiddlewares ? [localMiddlewares] : [];

        return [...globalMiddlewares, ...combinedMiddlewares] as RequestHandler[];
    }
}