# SkyAnalytics Documentation

SkyAnalytics is a service that allows you to track the behavior of your users.

## Endpoints

SkyAnalytics exposes an API that allows you to interact with the service. The following are the available endpoints:

[Endpoints](./enpoints/index.md)

## Send Events

To send events to SkyAnalytics, you must use the following endpoint [[POST /send]](./enpoints/send.md) and send the events, this endpoint allows you to send events and navigations, to send events you must send the `event` field and to send navigations you must send the `navigation` field.

This endpoint requires the `X-SkyAnalytics-Key` header, this Key is provided when you create a new [POST /sources](./enpoints/sources/create.md) and is unique to each source. If you do not send this header, the request will be rejected. This key is used to identify the source that is sending the events.

## Adapters

To facilitate the use of the API, we have created the following adapters:
* [JavaScript](/packages/adapters/js/readme.md)
* [Vue-2](/packages/adapters/vue2/readme.md)
* [Vue-3](/packages/adapters/vue3/readme.md)
* [Nuxt](/packages/adapters/nuxt/readme.md)
* [Flutter](/packages/adapters/flutter/README.md)

## Time Zones
The API can support multiple time zones. The default time zone is UTC. You can change the time zone by setting the `X-TimeZone` header in the request.

[Time Zones](./pages/time-zones.md)

## Docker
This monorepo uses Docker. [Read more](./pages/docker.md)