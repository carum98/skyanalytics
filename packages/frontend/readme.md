# SkyAnalytics Frontend
Frontend for SkyAnalytics, shows the statistics of the events and navigations.

## Environment Variables
| Name | Description |
|------|-------------|
| `API_URL` | The URL of the backend API. |
| `VITE_PROXY_API_URL` | The URL of Proxy API (Nitro). |

## Backend
The frontend uses the [SkyAnalytics Backend](/packages/backend/readme.md).

## Proxy API
This frontend uses a proxy API, using [Nitro](https://github.com/unjs/nitro). The proxy API is used to handle the session and the authentication of the user.
