# Get All Events
This endpoint returns all sources in the database.

## Request
- Method: `GET`
- URL: `/events`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [events](../../response/events.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)
