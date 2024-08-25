# Get All Navigations
This endpoint returns all navigations in the database.

## Request
- Method: `GET`
- URL: `/navigations`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [navigations](../../response/navigations.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)