<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFetch } from '@/composables/useFetch'
import type { IMapLocation } from '@/types'

import DateSelector, { type DateSelectorValue } from '@/components/DateSelector.vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet.heat/dist/leaflet-heat.js'

import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

// data
let map: L.Map | null = null
const filters = ref<DateSelectorValue>()

// methods
const { data } = useFetch<IMapLocation[]>("/api/locations", {
	query: filters,
})

// watch
watch(() => data.value, (value) => {
	if (!value?.length || !map) return

	// Clear map
	map.eachLayer((layer) => {
		if (layer instanceof L.Marker) {
			map?.removeLayer(layer)
		}
	})

	const markers = value.map((item) => {
		return item.locations.map((location) => {
			return L.marker([location.latitude, location.longitude], {
				icon: L.divIcon({
					className: 'custom-circle-icon',
					iconSize: [20, 20],
					iconAnchor: [5, 5],
				})
			})
		})
	}).flat()

	const group = L.featureGroup(markers)

	const cluster = L.markerClusterGroup().addLayer(group)
	const heat = L.heatLayer(value.map((item) => item.locations.map((location) => [location.latitude, location.longitude])).flat(), {
		radius: 25,
		blur: 15,
		maxZoom: 17,
	})

	// Center map
	map.fitBounds(group.getBounds())

	// Add markers
	map.addLayer(cluster)
	map.addLayer(heat)
})

// lifecycle
onMounted(() => {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
    })

    // Center map
    map.setView([9.934739, -84.087502], 13)

    L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=83c91e5e-5fc6-4702-9c2d-ca29e4d54a2f`)
        .addTo(map)
})
</script>

<template>
    <section class="map-container">
        <div id="map"></div>

        <div class="zoom-controls">
            <button @click="map?.zoomIn()">+</button>
            <button @click="map?.zoomOut()">-</button>
        </div>

        <div class="date-selector">
            <DateSelector v-model="filters" />
        </div>
    </section>
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

.map-container {
    height: 100%;
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    padding: 25px;
    background-color: var(--table-color);
    position: relative;

    .zoom-controls {
        z-index: 999;
        position: absolute;
        right: 35px;
        bottom: 35px;

        background-color: var(--table-color);
        border-radius: 10px;

        display: flex;
        flex-flow: column;

        button {
            font-size: 20px;
            width: 35px;
            height: 35px;
            cursor: pointer;
        }
    }

    .date-selector {
        z-index: 999;
        position: absolute;
        top: 20px;
        right: 20px;
    }
}
</style>