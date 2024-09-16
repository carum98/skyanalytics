| Field | Type |
| ----- | ---- |
| id | number |
| name | string |
| created_at | string |
| session | object |
| session.country | string |
| session.os | string |
| session.software | string

```json
{
    "id": 1,
    "name": "Event 1",
    "created_at": "2021-01-01T00:00:00.000Z",
    "session": {
        "country": "CR",
        "os": "MacOS",
        "software": "chrome_127.0.0.0"
    }
}
```