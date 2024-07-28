import express, { ErrorRequestHandler, Express, RequestHandler } from 'express'

import { RouterCore } from '@core/router.core'
import { sessionConfig } from 'config/session.config'

import session from 'express-session'
import cors from 'cors'

export class Server {
    public readonly app: Express

    constructor () {
        this.app = express()

        this.app.set('trust proxy', true)
        this.app.use(cors())
        this.app.use(session(sessionConfig))

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        console.log('Server initialized')
    }

    public listen (port: number | string): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }

    public routes (routes: RouterCore[]): void {
        routes.forEach(item => {
            this.app.use(item.path, item.router)
        })
    }

    public middleware (middleware: RequestHandler | ErrorRequestHandler): void {
        this.app.use(middleware)
    }
}