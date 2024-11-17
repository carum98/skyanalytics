## Get All Tasks
Get all registered tasks scheduled to run.

## Request
- Method: `GET`
- URL: `/tasks-scheduler`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| name | string | Task name |
| schedule | string | Task schedule |

```json
[
	{
		"name": "task1",
		"schedule": "0 0 * * *"
	},
	{
		"name": "task2",
		"schedule": "0 0 * * *"
	}
],
```