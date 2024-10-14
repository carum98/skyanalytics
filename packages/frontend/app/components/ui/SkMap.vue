<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type WatchStopHandle } from 'vue'
import type { ILocationStat } from '@shared/types'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet.heat/dist/leaflet-heat.js'

import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

const props = defineProps<{
    items?: Array<ILocationStat>
}>()

// data
let map: L.Map | null = null
const element = ref<HTMLElement>()

const layer = ref('normal')
const overlay = ref(['heat', 'markers'])
const clusters = ref(true)

const watcher: WatchStopHandle[] = []

// watch
watch(() => props.items, (value) => {
	if (!value?.length || !map) return

	// Remove all layers
	map.eachLayer((layer) => {
		if (!(layer instanceof L.TileLayer)) {
			map?.removeLayer(layer)
		}
	})

	// Clear watchers
	watcher.forEach((stop) => stop())
	watcher.slice(0, watcher.length)

	let layer: L.Layer | null = null

	const markers = value.map((item) => {
		return L.marker([item.latitude, item.longitude], {
			icon: L.divIcon({
				className: 'custom-circle-icon',
				iconSize: [20, 20],
				iconAnchor: [5, 5],
			})
		})
	}).flat()

	const group = L.featureGroup(markers)

	const cluster = L.markerClusterGroup().addLayer(group)
	const heat = L.heatLayer(value.map((item) => [item.latitude, item.longitude]), {
		radius: 25,
		blur: 15,
		maxZoom: 10,
		minOpacity: 0.5
	})

	// Center map
	map.fitBounds(group.getBounds())

	// Add markers
	const clusterWatcher = watch(clusters, (value) => {
		if (layer != null) {
			map?.removeLayer(layer)
		}

		layer = value ? cluster : group

		map?.addLayer(layer!)
	}, { immediate: true })

	const overlayWatcher = watch(overlay, (newValue, oldValue) => {
		const addedValues = newValue.filter(value => !oldValue?.includes(value)) ?? []
		const removedValues = oldValue?.filter(value => !newValue.includes(value)) ?? []

		removedValues.forEach((value) => {
			if (value === 'heat') {
				map?.removeLayer(heat)
			} else if (value === 'markers') {
				map?.removeLayer(layer!)
			}
		})

		addedValues.forEach((value) => {
			if (value === 'heat') {
				map?.addLayer(heat)
			} else if (value === 'markers') {
				map?.addLayer(layer!)
			}
		})
	}, { immediate: true })

	watcher.push(clusterWatcher, overlayWatcher)
})

// lifecycle
onMounted(() => {
	if (!element.value) return

    map = L.map(element.value, {
        zoomControl: false,
        attributionControl: false,
    })

	watch(layer, (value) => {
		if (!map) return

		// Clear map
		map.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				map?.removeLayer(layer)
			}
		})

		if (value === 'normal') {
			L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=83c91e5e-5fc6-4702-9c2d-ca29e4d54a2f`)
				.addTo(map)
		} else if (value === 'satellite') {
			L.tileLayer('https://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',{
                maxZoom: 20,
                subdomains:['mt0','mt1','mt2','mt3'],
                attribution: '© Google'
            }).addTo(map)
		}
	}, { immediate: true })
})

onUnmounted(() => {
	map?.remove()
})
</script>

<template>
    <section class="map-container">
        <div ref="element" class="map"></div>

        <div class="zoom-controls">
            <button @click="map?.zoomIn()">+</button>
            <button @click="map?.zoomOut()">-</button>
        </div>

        <div class="top-left">
			<slot name="top-left"></slot>
        </div>

		<div class="configuration">
			<p>Map</p>
			<fieldset>
				<label>
					<input type="radio" name="layer" value="normal" v-model="layer">
					<span><i class="icon-earth-americas"></i></span>
					Normal
                </label>
				<label>
					<input type="radio" name="layer" value="satellite" v-model="layer">
					<span><i class="icon-satellite"></i></span>
					Satélite
                </label>
			</fieldset>

			<hr>

			<p>Layers</p>
			<fieldset>
				<label>
					<input type="checkbox" name="overlay" value="heat" v-model="overlay"> 
					<span><i class="icon-fire"></i></span>
					Heatmap
                </label>
				<label>
					<input type="checkbox" name="overlay" value="markers" v-model="overlay"> 
					<span><i class="icon-location-dot"></i></span>
					Markers
				</label>
			</fieldset>

			<hr>

			<label>
				<input type="checkbox" v-model="clusters" /> Clusters
			</label>
		</div>
    </section>
</template>

<style lang="css">
.custom-circle-icon {
    background-color: #0e5db7;
    border-radius: 50%; 
    width: 100%;
    height: 100%;
    border: 2px solid white;
}

.map-container {
    height: 100%;
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    /* padding: 15px; */
    background-color: var(--table-color);
    position: relative;

	.map {
    	width: 100%;
    	height: 100%;
    	border-radius: 10px;
	}

    .zoom-controls {
        z-index: 999;
        position: absolute;
        right: 15px;
        bottom: 15px;

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

    .top-left {
        z-index: 999;
        position: absolute;
        top: 15px;
        right: 20px;
    }

	.configuration {
		z-index: 999;
		position: absolute;
		bottom: 15px;
		left: 15px;
		padding: 10px 20px;
        background-color: var(--table-color);
		border-radius: 10px;

		p {
			margin-bottom: 7px;
		}

		hr {
			border: none;
			border-top: 1px solid rgba(128, 128, 128, 0.4);
			margin: 10px 0;
		}

		input[type="checkbox"] {
			accent-color: var(--primary-color);
		}

		fieldset {
			border: none;
			display: flex;
			justify-content: space-around;
			gap: 15px;
			margin-bottom: 10px;

			label {
				font-size: 12px;
				color: gray;
				text-align: center;
				cursor: pointer;
			}

			input[type="radio"],
			input[type="checkbox"] {
				display: none;

			}

			i {
				font-size: 25px;
			}

			input[type="radio"]:checked + span,
			input[type="checkbox"]:checked + span {
				color: var(--primary-color);
			}

			span {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--background-color);
				border-radius: 10px;
				width: 55px;
				height: 55px;
				margin: auto;
			}
		}
	}
}
</style>