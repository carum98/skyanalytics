# Update Report
Update a report.

## Request
- Method: `PUT`
- URL: `/reports/:code`

## Parameters
| Name | Type | Description |
| --- | --- | --- |
| code | string | Report code |

## Body
| Name | Type | Description |
| --- | --- | --- |
| description | string | Report description |

## Success Response
Status: `200 OK`
[Reports](../../response/reports.md)