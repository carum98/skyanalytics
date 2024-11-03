| Field | Type |
| ----- | ---- |
| id | number |
| name | string |
| created_at | string |
| metadata | object - null |
| session | object |
| session.country | string |
| session.os | string |
| session.software | string

```json
{
    "id": 1,
    "name": "Event 1",
    "created_at": "2021-01-01T00:00:00.000Z",
    "metadata": {
        "key1": "value1",
        "key2": "value2"
    },
    "session": {
        "country": "CR",
        "os": "MacOS",
        "software": "chrome_127.0.0.0"
    }
}
```