# SkyAnalytics Backend
API REST for SkyAnalytics, a service that allows you to track the behavior of your users.

## Endpoints
SkyAnalytics exposes an API that allows you to interact with the service. The following are the available endpoints:

[Read more](/docs/enpoints/index.md)

## Send Events
To send events to SkyAnalytics, you must use the following endpoint [[POST /send]](/docs/enpoints/send.md) and send the events, this endpoint allows you to send events, navigations or metadata.

This endpoint requires the `X-SkyAnalytics-Key` header, this Key is provided when you create a new [POST /sources](/docs/enpoints/sources/create.md) and is unique to each source. If you do not send this header, the request will be rejected. This key is used to identify the source that is sending the events.

The events and navigations can have metadata, this metadata can be global or specific to the event or navigation. If you send only metadata, it will be set as global metadata and all next events/navigations will inherit it. If you send metadata with event or navigation, it will be merged with global metadata.

## Geolocation
The API can determine the geolocation of the user based on the IP address, through the [[POST /send]](/docs/enpoints/send.md) endpoint. The backend determines the geolocation of the users looking up the IP address in the [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/) database using [MaxMind](https://github.com/runk/node-maxmind).

The geolocation is determined by the `country`, `city`, `latitude`, and `longitude` fields. If the IP address is not found in the database, the fields will be empty.

To download the GeoLite2 database, run the following command:
```bash
npm run download-geo-db
```

## User Agent
Through the `user-agent` in the endpoint [[POST /send]](/docs/enpoints/send.md), the backend can determine the `operating system`, `browser` and `software version`

## Time Zones
The API can support multiple time zones. The default time zone is UTC. You can change the time zone by setting the `X-TimeZone` header in the request. The time zone must be a valid IANA time zone identifier. For example, `America/Costa_Rica`/`Europe/London` or the UTC offset, such as `UTC+0`/`UTC-5`.

The time zone is used to calculate the time in the response. For example, if you request the stats for a source and set the time zone to `America/Costa_Rica`, the response will show the stats in the `America/Costa_Rica` time zone.

The time zone is also used to calculate the date range in the request. For example, if you request the stats for a source and set the time zone to `America/Costa_Rica`, and set the date range to `last_7_days`, the response will show the stats for the last 7 days in the `America/Costa_Rica` time zone.

If you don't set the `X-TimeZone` header, the API will use the default time zone, which is UTC.

## Docker
This monorepo uses Docker. 

[Read more](/docs/pages/docker.md)

## Filters (Query Parameters)
The API supports filters in the query parameters. The syntax is `?column[operator]=value`. The following are the available operators:

- `equal`: '='
- `like`: 'LIKE'
- `not_equal`: '!='
- `is_null`: 'IS NULL'
- `is_not_null`: 'IS NOT NULL'
- `in`: 'IN'
- `not_in`: 'NOT IN'

For example, to filter the events by the `sessions` field, you can use the following query parameter: `?country[equal]=CR`. This will return the events where the `country` field is equal to `CR`. 

For nested fields, you can use this syntax: `?sources[code][equal]=123`. This will return the events where the `sources.code` field is equal to `123`.

## Stack
- [Express](https://github.com/expressjs/express)
- [PostgreSQL](https://www.postgresql.org)
- [Drizzle](https://github.com/drizzle-team/drizzle-orm)
- [Zod](https://github.com/colinhacks/zod)