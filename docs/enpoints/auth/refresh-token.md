# Refresh Token
This endpoint is used to refresh the access token.

## Request
- Method: `POST`
- URL: `/refresh-token`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| refresh_token | string | true |

# Response
Status: `200 OK`
[See here](../../response/auth.md)

## Errors
[See here](../../response/error.md)