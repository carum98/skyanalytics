# Get All Sources
This endpoint returns all sources in the database.

## Request
- Method: `GET`
- URL: `/sources`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [sources](../../response/sources.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)
