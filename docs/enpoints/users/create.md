# Create User
Create a new user.

## Request
- Method: `POST`
- URL: `/users`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| name | string | true |
| email | string | true |
| password | string | true |
| role | 'admin' | 'guest' | true |

## Response
Status: `200 OK`

[Users](../../response/users.md)

## Errors
[See here](../../response/error.md)
