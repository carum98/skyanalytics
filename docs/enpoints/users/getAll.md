# Get All Users
This endpoint returns all users in the database.

## Request
- Method: `GET`
- URL: `/users`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [sources](../../response/users.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)