# Get All Sessions
This endpoint returns all sessions in the database.

## Request
- Method: `GET`
- URL: `/sessions`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [sessions](../../response/sessions.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)