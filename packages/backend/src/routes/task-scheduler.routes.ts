import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { TasksScheduler } from '@core/tasks-scheduler.core'
import { authMiddleware } from '@middlewares/auth.middleware'

export class TasksSchedulerRouter extends RouterCore {
	constructor(di: DepencyInjection) {
		super({
			path: '/tasks-scheduler',
			middlewares: [authMiddleware]
		})

		const tasksScheduler = di.resolve(TasksScheduler)

		this.get({
			name: '/',
			handler: (_, res) => {
				const tasks = tasksScheduler.getTasks()
				res.send(tasks)
			}
		})

		this.post({
			name: '/:name/run',
			handler: async (req, res) => {
				const { name } = req.params
				const query = req.query as Record<string, any>

				const response = await tasksScheduler.call(name, query)
				res.send(response)
			}
		})
	}
}