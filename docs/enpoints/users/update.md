# Update user
Update a user.

## Request
- Method: `PUT`
- URL: `/users/:code`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| name | string | false |
| email | string | false |
| password | string | false |
| role | 'admin' | 'guest' | false |

## Response
Status: `200 OK`

[Users](../../response/users.md)

## Errors
[See here](../../response/error.md)