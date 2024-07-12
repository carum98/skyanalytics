# Update Source
Update an existing source.

## Request
- Method: `PUT`
- URL: `/api/sources/:id`
- Headers:
  - Authorization: Bearer

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| name | string | false |

## Response
- Status: `200 OK`
- Body:
  ```json
  {
    "id": 1,
    "name": "source name"
  }
  ```

## Errors
[See here](../../response/error.md)
