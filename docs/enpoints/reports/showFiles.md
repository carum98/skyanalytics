## Get files from a report
This endpoint returns the files from a report in the database.

### Request
- Method: `GET`
- URL: `/reports/:code/files`

### Success Response
Status: `200 OK`
| Field | Type | Description |
| ----- | ---- | ----------- |
| file | string | File name |
| size | number | File size in bytes |

```json
[
	{
		"file": "screenshot.png",
		"size": 49415
	},
	{
		"file": "test.txt",
		"size": 20
	}
]
```

## Errors
[See here](../../response/error.md)