# Get All Reports
This endpoint returns all reports in the database.

## Request
- Method: `GET`
- URL: `/reports`

## Success Response
Status: `200 OK`

| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [reports](../../response/reports.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

## Errors
[See here](../../response/error.md)