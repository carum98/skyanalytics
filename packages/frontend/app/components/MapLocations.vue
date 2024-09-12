<script setup lang="ts">
import type { ILocationStat } from '@/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { watch } from 'vue'
import { onMounted } from 'vue'

const props = defineProps<{
    items?: Array<ILocationStat>
}>()

// data
let map: L.Map | null = null

const customCircleIcon = L.divIcon({
    className: 'custom-circle-icon',
    iconSize: [20, 20],
    iconAnchor: [5, 5],
})

watch(() => props.items, (value) => {
    if (!value?.length || !map) return

    const markers = value.map((item) => L.marker(
        [item.latitude, item.longitude], 
        { icon: customCircleIcon }
    ))

    map.setView(markers[0].getLatLng(), 13)

    // Center map
    map.fitBounds(L.featureGroup(markers).getBounds())

    // Add markers
    markers.forEach((marker) => {
        marker.addTo(map!)
    })
})

onMounted(() => {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
    })

    L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=83c91e5e-5fc6-4702-9c2d-ca29e4d54a2f`)
        .addTo(map)
})
</script>

<template>
    <div id="map"></div>
</template>

<style lang="css">
#map {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

.custom-circle-icon {
    background-color: #0e5db7;
    border-radius: 50%; 
    width: 100%;
    height: 100%;
    border: 2px solid white;
    box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5);
}
</style>