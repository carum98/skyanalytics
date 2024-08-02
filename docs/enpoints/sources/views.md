# Views Stats
Stats for specific source.

## Request
- Method: `GET`
- URL: `/sources/:code/views`

## Query Parameters
| Field | Type | Required |
| ----- | ---- | -------- |
| date_range | string | false |

`date_range` is a string with the following values:
`last_7_days`, `last_15_days`, `last_30_days`, `last_month`, `last_2_months`,`last_3_months`

## Response
Status: `200 OK`
```json
{
	"2024-07-24": 3,
    "2024-07-25": 8,
    "2024-07-26": 3,
    "2024-07-27": 5,
    "2024-07-28": 9,
    "2024-07-29": 2,
    "2024-07-30": 0,
}
```
```json
{
	"2024-07": 3,
	"2024-07": 8,
}
```

## Errors
[See here](../../response/error.md)