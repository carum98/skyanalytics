# Get All Sessions
This endpoint returns all sessions in the database.

## Request
- Method: `GET`
- URL: `/sessions`

## Headers
| Field | Type | Required | Default |
| ----- | ---- | -------- | ------- |
| X-TimeZone | string | false | `UTC+0` |

[TimeZones](../../pages/time-zones.md)

### Query Parameters
| Name | Type | Description |
| --- | --- | --- |
| country | string | Filter by country |
| os | string | Filter by operating system |
| software | string | Filter by software |

```http
GET /sessions?country[equal]=CR&os[equal]=Windows
```

```http
GET /sessions?sources[code][equal]=123
```

[Read more](../../../packages/backend/readme.md#filters-query-parameters)

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [sessions](../../response/sessions.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)