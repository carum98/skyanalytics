# Get All Locations
This endpoint returns all locations in the database.

## Request
- Method: `GET`
- URL: `/locations`

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
`last_7_days`, `last_15_days`, `last_30_days`, `last_month`, `last_2_months`,`last_3_months`

## Response
Status: `200 OK`
```json
[
    {
        "code": "3bd852",
        "name": "Admin",
        "locations": [
            {
                "city": "San José",
                "latitude": 9.9346,
                "longitude": -84.0707
            }
        ]
    },
    {
        "code": "12a052",
        "name": "SkyRadio",
        "locations": [
            {
                "city": null,
                "latitude": 34.7732,
                "longitude": 113.722
            },
            {
                "city": "San José",
                "latitude": 9.9346,
                "longitude": -84.0707
            },
            {
                "city": "San José",
                "latitude": 9.9395,
                "longitude": -84.0905
            },
            {
                "city": null,
                "latitude": 37.751,
                "longitude": -97.822
            },
            {
                "city": "San José",
                "latitude": 9.9652,
                "longitude": -84.0501
            }
        ]
    }
]
```