| Field | Type |
| ----- | ---- |
| code | string |
| description | string |
| created_at | string |
| status | string |
| session | object |
| session.country | string |
| session.os | string |
| session.software | string |
| source | object |
| source.code | string |
| source.name | string |
| source.icon_path | string |

```json
{
	"code": "report-1",
	"description": "Report 1",
	"created_at": "2021-01-01T00:00:00.000Z",
	"status": "open",
	"session": {
		"country": "CR",
		"os": "MacOS",
		"software": "chrome_127.0.0.0"
	},
	"source": {
		"code": "source-1",
		"name": "Source 1",
		"icon_path": "/sources/source-1/icon"
	}
}
```