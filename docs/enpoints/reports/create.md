# Create reports
Create a new report.

## Request
- Method: `POST`
- URL: `/reports`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| description | string | true |
| session_id | string | true |

## Response
Status: `200 OK`
[Reports](../../response/reports.md)

### Errors
[See here](../../response/error.md)