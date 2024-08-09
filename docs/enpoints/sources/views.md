# Views Stats
Stats for specific source.

## Request
- Method: `GET`
- URL: `/sources/:code/views`

## Headers
| Field | Type | Required | Default |
| ----- | ---- | -------- | ------- |
| X-TimeZone | string | false | `UTC+0` |

[TimeZones](../../pages/time-zones.md)

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
    "2024-08-07T18": {
        "views": 0,
        "sessions": 0
    },
    "2024-08-07T19": {
        "views": 0,
        "sessions": 0
    },
    "2024-08-07T20": {
        "views": 0,
        "sessions": 0
    },
    "2024-08-07T21": {
        "views": 0,
        "sessions": 0
    },
}
```
```json
{
    "2024-08-07": {
        "views": 0,
        "sessions": 0
    },
    "2024-08-08": {
        "views": 0,
        "sessions": 0
    },
}
```

## Errors
[See here](../../response/error.md)