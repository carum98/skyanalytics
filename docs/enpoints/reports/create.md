# Create reports
Create a new report.

## Request
- Method: `POST`
- URL: `/reports`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| description | string | true |
| user | object | true |
| user.name | string | true |
| user.contact | string | true |
| session_id | string | true |
| files | array | false |

## Response
Status: `200 OK`
[Reports](../../response/reports.md)

### Errors
[See here](../../response/error.md)