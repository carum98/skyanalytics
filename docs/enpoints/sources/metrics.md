# Metrics
Metrics for sources

## Request
- Method: `GET`
- URL: `/sources/:code/metrics`

## Headers
| Field | Type | Required | Default |
| ----- | ---- | -------- | ------- |
| X-TimeZone | string | false | `UTC+0` |

[TimeZones](../../pages/time-zones.md)

## Query Parameters
| Field | Type | Required |
| ----- | ---- | -------- |
| start | string | false |
| end | string | false |

## Response
Status: `200 OK`
```json
{
    "views": 4,
    "visitors": 1
}
```

## Errors
[See here](../../response/error.md)