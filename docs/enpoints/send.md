# Send Events or View

## Request
- Method: `POST`
- URL: `/send`
- Headers:
  - X-SkyAnalytics-Key: `YOUR_API_KEY`

## Request Body
| Field | Type | Required |
| ----- | ---- | -------- |
| event | string | false |
| navigation | string | false |
| bug_report | object | false |
| metadata | object | false |

## Response
- Status: `201 Created`

## Example
```json
{
  "navigation": "login",
  "metadata": {
    "user": "john.doe"
  }
}
```

```json
{
  "event": "click",
  "metadata": {
    "element": "button"
  }
}
```

```json
{
  "bug_report": {
    "description": "The button is not working",
  }
}
```

## Info
- Can't send `event`, `navigation` or `bug_report` at the same time.
- If you send only `metadata`, will be set as global metadata and all next events/nativations will inherit it.
- If you send `metadata` with `event` or `navigation`, will be merged with global metadata.
