import { Control, DomUtil } from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import './geolet.client.js'

function SearchFieldInner() {
	const provider = useMemo(() => new OpenStreetMapProvider(), [])
	const map = useMap()

	useEffect(() => {
		// @ts-ignore
		const searchControl = new GeoSearchControl({
			provider: provider,
			autoComplete: true,
			autoCompleteDelay: 1000,
			searchLabel: '🖋️ enter address...',
			style: 'button',
			position: 'topleft',
		})

		map.addControl(searchControl)
		return () => {
			map.removeControl(searchControl)
		}
	}, [map, provider])

	return null
}

export default function GeoSearchMap() {
	return (
		<MapContainer
			className="markercluster-map"
			center={[52, 6.8]}
			zoom={3}
			zoomControl={false}
			scrollWheelZoom={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
			/>
			<GetCoordinates />
			<SearchFieldInner />
			<ZoomControl position="bottomleft" />
		</MapContainer>
	)
}

const GetCoordinates = () => {
	const map = useMap()

	useEffect(() => {
		if (!map) return
		const info = DomUtil.create('div', 'legend')

		const positon = Control.extend({
			options: {
				position: 'bottomright',
			},

			onAdd: function () {
				info.innerHTML = `
                <div style=">Click on map to get coordinates</div>
                `
				return info
			},
		})

		map.on('click', (e) => {
			info.textContent = `${e.latlng}`
		})

		map.addControl(new positon())

		// @ts-ignore
		L.geolet({ position: 'topright' }).addTo(map)
	}, [map])

	return null
}
