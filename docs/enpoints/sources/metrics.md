# Metrics
Metrics for sources

## Request
- Method: `GET`
- URL: `/sources/:code/metrics`

## Headers
| Field | Type | Required | Default |
| ----- | ---- | -------- | ------- |
| X-TimeZone | string | false | `UTC+0` |

[TimeZones](../../../packages/backend/readme.md#timezones)

## Query Parameters
| Field | Type | Required |
| ----- | ---- | -------- |
| date_range | string | false |

`date_range` is a string with the following values:
`last_30_minutes`, `last_hour`

## Response
Status: `200 OK`
```json
{
    "views": 4,
    "visitors": 1,
    "reports": 0,
}
```

## Errors
[See here](../../response/error.md)