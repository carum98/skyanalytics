import { TasksCore } from './tasks.core'

export class TasksScheduler {
	private map = new Map<string, TasksCore>()

	public tasks(items: TasksCore[]) {
		items.forEach(task => {
			this.map.set(task.name, task)
		})
	}

	public start() {
		this.map.forEach(task => task.start())

		console.log('Tasks scheduler started')
	}

	public stop(name: string) {
		const task = this.map.get(name)
		task?.stop()
	}

	public run(name: string) {
		const task = this.map.get(name)
		task?.run()
	}

	public call(name: string, query?: Record<string, any>) {
		const task = this.map.get(name)
		return task?.call(query)
	}

	public getTasks() {
		return Array.from(this.map.values()).map(task => ({
			name: task.name,
			schedule: task.schedule,
		}))
	}
}