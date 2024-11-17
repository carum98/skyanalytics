# Run task
Run a scheduled task immediately.

## Request
- Method: `POST`
- URL: `/tasks-scheduler/:name/run`

## URL Parameters
| Name | Type | Description |
| --- | --- | --- |
| name | string | Task name |

## Success Response
Status: `200 OK`

```json
{
	"message": "Task task1 has been run"
}
```