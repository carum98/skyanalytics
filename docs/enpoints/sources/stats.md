# Stat Sources
Stats for specific source.

## Request
- Method: `GET`
- URL: `/sources/:code/stats`

## Headers
| Field | Type | Required | Default |
| ----- | ---- | -------- | ------- |
| X-TimeZone | string | false | `UTC+0` |

[TimeZones](../../../packages/backend/readme.md#timezones)

## Query Parameters
| Field | Type | Required |
| ----- | ---- | -------- |
| date_range | string | false |
| start | string | false |
| end | string | false |
| stats | string | false |

`stats` is a string with the following values:
`os`, `software`, `country`, `location`, `events`, `navigations`

## Response
Status: `200 OK`
```json
{
    "os": {
        "MacOS": 1
    },
    "country": {
        "CR": 1,
        "US": 4
    },
    "software": {
        "chrome_127.0.0.0": 1
    },
    "location": [
        {
            "latitude": 9.935,
            "longitude": -84.0841,
        },
        {
            "latitude": 37.751,
            "longitude": -97.822,
        }
    ],
    "navigations": {
        "tickets.list": 1,
        "tickets.profile.activity": 2
    },
    "events": {
        "create.ticket": 1,
        "update.ticket": 1
    }
}
```

## Errors
[See here](../../response/error.md)