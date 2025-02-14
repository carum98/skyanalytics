# SkyAnalytics Frontend
Frontend for SkyAnalytics, shows the statistics of the events and views.

## Stack
- [Vite](https://github.com/vitejs/vite)
- [Vue 3](https://github.com/vuejs/core)
- [Nitro](https://github.com/unjs/nitro)

## Environment Variables
| Name | Description |
|------|-------------|
| `URL_BACKEND` | The URL of the backend API. |
| `VITE_URL_FRONTEND` | The URL of Proxy API (Nitro). |

## Backend
The frontend uses the [SkyAnalytics Backend](/packages/backend/readme.md).

## Proxy API
This frontend uses a proxy API, using [Nitro](https://github.com/unjs/nitro). The proxy API is used to handle the session and the authentication of the user.
