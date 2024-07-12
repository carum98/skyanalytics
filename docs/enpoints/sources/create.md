# Create Source
Create a new source.

## Request
- Method: `POST`
- URL: `/api/sources`
- Headers:
  - Authorization: Bearer

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| name | string | true |

## Response
- Status: `201 Created`
- Body:
  ```json
  {
    "id": 1,
    "name": "source name"
  }
  ```

## Errors
[See here](../../response/error.md)


