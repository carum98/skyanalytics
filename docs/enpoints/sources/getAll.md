# Get All Sources
This endpoint returns all sources in the database.

## Request
- Method: `GET`
- URL: `/api/sources`
- Headers:
  - Authorization: Bearer

## Response
- Status: `200 OK`
- Body:
  ```json
  [
    {
      "id": 1,
      "name": "source name"
    }
  ]
  ```

## Errors
[See here](../../response/error.md)
