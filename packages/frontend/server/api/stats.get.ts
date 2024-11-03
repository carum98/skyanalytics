export default defineEventHandler(async (event) => {
	const timezone = getRequestHeader(event, 'x-timezone')

	const sources = await useApiFetch<ISourcesPagination>(event, '/sources', {
		query: {
			per_page: 15,
			sort_order: 'asc',
		}
	})

	const metricsPromise = sources.data
		.map(({ code }) => useApiFetch<IMetrics>(event, `/sources/${code}/metrics`, {
			query: {
				date_range: 'last_30_minutes'
			}
		}))

	const viewsPromise = sources.data
		.map(({ code }) => useApiFetch<IView>(event, `/sources/${code}/views`, {
			query: {
				date_range: 'last_7_days'
			},
			headers: {
				'x-timezone': timezone
			}
		}))

	const [metrics, views] = await Promise.all([
		Promise.all(metricsPromise),
		Promise.all(viewsPromise)
	])

	return sources.data.map((source, index) => ({
		...source,
		metrics: metrics[index],
		views: views[index]
	}))
})