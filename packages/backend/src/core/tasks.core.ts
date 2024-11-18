import cron from 'node-cron'

type FuntionCallback = Parameters<typeof cron.schedule>[1]

interface ITaskCore {
	readonly name: string
	readonly schedule: string
	readonly task: FuntionCallback

	start(): void
}

export class TasksCore implements ITaskCore {
	private instance?: cron.ScheduledTask

	public readonly name: string
	public readonly schedule: string
	public readonly task: FuntionCallback

	constructor (params: Omit<ITaskCore, 'start'>) {
		this.name = params.name
		this.schedule = params.schedule
		this.task = params.task
	}

	public start (): void {
		this.instance = cron.schedule(this.schedule, this.task, {
			name: this.name,
			timezone: 'America/Costa_Rica'
		})
	}

	public stop (): void {
		this.instance?.stop()
		this.instance = undefined
	}

	/**
	 * Run the task through the schedule task
	 */
	public run (): void {
		this.instance?.now()
	}

	/**
	 * Call the callback function directly
	 */
	public call(params?: Record<string, any>): any {
		return (this.task as Function)(params)
	}

	public isRunning (): boolean {
		return this.instance !== undefined
	}
}