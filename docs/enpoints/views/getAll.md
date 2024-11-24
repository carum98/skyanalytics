# Get All Views
This endpoint returns all views in the database.

## Request
- Method: `GET`
- URL: `/views`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [views](../../response/views.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)