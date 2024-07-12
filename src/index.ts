import { Database } from '@core/database.core'
import { Server } from '@core/server.core'
import { DepencyInjection } from '@core/di.core'

import { EventsRepository } from '@repositories/events.repositories'
import { EventsService } from '@services/events.service'

import { EventsRouter } from '@routes/events.routes'
import { SendRouter } from '@routes/send.routes'
import { errorMiddleware } from '@middlewares/error.middleware'

const di = DepencyInjection.getInstance()

// Register the Database
di.register(() => new Database())

// Register Repositories
di.register(() => new EventsRepository(di.resolve(Database).db))

// Register Services
di.register(() => new EventsService(di.resolve(EventsRepository)))

const server = new Server()

server.routes([
    new EventsRouter(di),
    new SendRouter(di)
])

server.middleware(errorMiddleware)

server.listen(3000)