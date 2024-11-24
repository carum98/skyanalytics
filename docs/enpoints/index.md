# Endpoint SkyAnalytics

## Authentication
- [[POST /login] - Login](auth/login.md)
- [[POST /refresh-token] - Refresh Token](auth/refresh-token.md)

## Sources
- [[GET /sources] - Get Sources](sources/getAll.md)
- [[POST /sources] - Create Source](sources/create.md)
- [[PUT /sources/:code] - Update Source](sources/update.md)
- [[DELETE /sources/:code] - Remove Source](sources/remove.md)
- [[GET /sources/:code/views] - Views Stats](sources/views.md)
- [[GET /sources/:code/stats] - Stat Sources](sources/stats.md)
- [[GET /sources/:code/metrics] - Metrics](sources/metrics.md)

## Events
- [[GET /events] - Get Events](events/getAll.md)
- [[POST /events] - Create Event](events/create.md)
- [[PUT /events/:code] - Update Event](events/update.md)
- [[DELETE /events/:code] - Remove Event](events/remove.md)

## Views
- [[GET /views] - Get Views](views/getAll.md)
- [[POST /views] - Create View](views/create.md)
- [[PUT /views/:code] - Update View](views/update.md)
- [[DELETE /views/:code] - Remove View](views/remove.md)

## Reports
- [[GET /reports] - Get Reports](reports/getAll.md)
- [[POST /reports] - Create Report](reports/create.md)
- [[GET /reports/:code] - Get One Report](reports/getOne.md)
- [[PUT /reports/:code] - Update Report](reports/update.md)
- [[DELETE /reports/:code] - Remove Report](reports/remove.md)

## Sessions
- [[GET /sessions] - Get All Sessions](sessions/getAll.md)

## Locations
- [[GET /locations] - Get All Locations](locations/getAll.md)

## Users
- [[GET /users] - Get All Users](users/getAll.md)
- [[POST /users] - Create User](users/create.md)
- [[POST /users/:code] - Get One User](users/getOne.md)
- [[PUT /users/:code] - Update User](users/update.md)
- [[DELETE /users/:code] - Remove User](users/remove.md)
- [[GET /users/:code] - Get One User](users/getOne.md)

## Settings
- [[GET /settings/:key] - Get Settings](settings/get.md)
- [[POST /settings/:key] - Update Settings](settings/update.md)

## Tasks Scheduler
- [[GET /tasks-scheduler] - Get All Tasks](tasks-scheduler/getAll.md)
- [[POST /tasks-scheduler/:name/run] - Run Task](tasks-scheduler/run.md)