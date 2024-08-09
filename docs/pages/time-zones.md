# Time Zones
The API can support multiple time zones. The default time zone is UTC. You can change the time zone by setting the `X-TimeZone` header in the request. The time zone must be a valid IANA time zone identifier. For example, `America/Costa_Rica`/`Europe/London` or the UTC offset, such as `UTC+0`/`UTC-5`.

The time zone is used to calculate the time in the response. For example, if you request the stats for a source and set the time zone to `America/Costa_Rica`, the response will show the stats in the `America/Costa_Rica` time zone.

The time zone is also used to calculate the date range in the request. For example, if you request the stats for a source and set the time zone to `America/Costa_Rica`, and set the date range to `last_7_days`, the response will show the stats for the last 7 days in the `America/Costa_Rica` time zone.

If you don't set the `X-TimeZone` header, the API will use the default time zone, which is UTC.
