
import {
	animate,
	AnimatePresence,
	motion,
	useMotionTemplate,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from 'framer-motion'
import {
	type Feature,
	type FeatureCollection,
	type GeoJsonProperties,
} from 'geojson'
import L, { divIcon } from 'leaflet'
import React, { useState } from 'react'
import { Button, Dialog, Modal, ModalOverlay } from 'react-aria-components'

import {
	GeoJSON,
	MapContainer,
	Marker,
	Tooltip,
	//  TODO: ZoomControl,                                                    ❗
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
// import redFilledMarker from '#app/assets/red-filled-marker.svg'

import { NavLink } from 'react-router'
import { geoPlaces, type GeoPlace  } from '#app/components/assets/geoPlaces.js'
import world from '#app/components/assets/world.geo.json'
import 'react-tabs/style/react-tabs.css'
import marker from '#app/routes/_artworks+/images/marker-icon-2x.png'
import SVGComponent from './ui/eye'

// Wrap React Aria modal components so they support framer-motion values.
const MotionModal = motion(Modal)
const MotionModalOverlay = motion(ModalOverlay)

const inertiaTransition = {
	type: 'inertia' as const,
	bounceStiffness: 300,
	bounceDamping: 40,
	timeConstant: 300,
}

const staticTransition = {
	duration: 0.5,
	ease: [0.32, 0.72, 0, 1],
}

const SHEET_MARGIN = 34
const SHEET_RADIUS = 12

const root = document.body.firstChild as HTMLElement
const ninjaIcon = new L.Icon({
	iconUpropertyrl: marker,
	iconRetinaUrl: marker,
	popupAnchor: [0, -18],
	iconSize: [36, 36],
})
// Function for creating custom icon for cluster group
// https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
// NOTE: iconCreateFunction is running by leaflet, which does not support ES6 arrow func syntax

//__ MARK: Clustericon
const createClusterCustomIcon = function (cluster: any) {
	const count = cluster.getChildCount()
	let size = 'xlarge'
	let radius = 100

	if (count < 2) {
		size = 'small'
		radius = 30
	} else if (count >= 2 && count < 10) {
		size = 'medium'
		radius = 40
	} else if (count >= 10 && count < 100) {
		size = 'large'
		radius = 50
	}

	return L.divIcon({
		html: `<span>${cluster.getChildCount()}</span>`,
		className: `marker-cluster-${size}`,
		iconSize: L.point(radius, radius),
	})
}

interface ClusterProps {
	places: string[]
	artworks: Artwork[]
}

//__ MARK: Featurestyles
// Style function for GeoJSON features
const getFeatureStyle = (
	feature: Feature<any, GeoJsonProperties>,
	matchingArtworkPlaces: GeoPlace[],
) => {
	const geoPlaceName = feature.properties?.name
	const isHighlighted = matchingArtworkPlaces.some(
		(country) => country.name.toLowerCase() === geoPlaceName?.toLowerCase(),
	)
	// console.log('🟠 isHighlighted', isHighlighted)

	return {
		fillColor: isHighlighted ? '#5e878c' : '#000',
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 1,
	}
}

//__ MARK: Custom Popup
function CustomPopup({ artworks }: { artworks: Artwork[] }) {
	return (
		<ul className="relative max-h-fit min-h-[calc(100vh-8rem)] max-w-[50vw] gap-x-[3%] overflow-auto pt-4 [column-count:1] group-has-[label:nth-child(1)>input[type='radio']:checked]/body:[column-count:1] group-has-[label:nth-child(2)>input[type=radio]:checked]/body:[column-count:2] group-has-[label:nth-child(3)>input[type=radio]:checked]/body:[column-count:3] md:py-8 md:[column-count:2] lg:gap-x-12 lg:pt-10 lg:[column-count:4] xl:gap-x-[4%] xl:pt-14 xl:[column-count:5] 2xl:gap-x-20 2xl:pt-20">
			{artworks.map((artwork: Artwork) => (
				<li
					key={artwork.id}
					className="my-4 w-full xl:my-10"
					style={{
						containerType: 'inline-size',
						containerName: 'list-item',
					}}
				>
					<NavLink
						className={({ isActive, isPending }) =>
							isActive ? 'active' : isPending ? 'pending' : '' + 'w-full'
						}
						to={`../artworks/${artwork.id}`}
					>
						{/*
                MARK: Figure
                */}

						<figure className="relative mx-auto mb-8 flex break-inside-avoid flex-col items-center justify-between xl:mb-20">
							<img
								alt={artwork.alt_text ?? undefined}
								key={artwork.id}
								src={artwork.image_url ?? '../dummy.jpeg'}
								className="hover-[gradient-border] w-full max-w-full rounded-md object-contain object-center md:rounded-lg"
							/>

							<figcaption className="z-50 my-4 flex w-full flex-wrap justify-between overflow-hidden rounded-md px-[1cqw] backdrop-blur-sm">
								<div className="group-has-[input[type=radio]]:grid-cols-2]:justify-self-start relative flex w-full flex-wrap justify-between font-light tracking-[-0.020rem] text-[#f2ece2]">
									<div className="w-full after:absolute after:right-0 after:h-full after:w-full after:bg-[linear-gradient(268deg,_#0c0a09,_#0c0a0920,_transparent_30%)]">
										{artwork.title} {'  '}
									</div>
									<div className="figcaption-artist bottom-0 right-0 top-0 w-[calc(100%-1.8rem)] font-medium leading-snug tracking-[-0.020rem] opacity-90 after:absolute after:left-0 after:h-full after:w-full after:bg-[linear-gradient(270deg,_#0c0a09_1rem,_#0c0a0920,_transparent_50%)] after:from-black after:from-10% after:via-20% after:to-transparent after:to-100%">
										{artwork.artist_title}
									</div>
									<span
										className="z-50 grid place-items-center rounded-full bg-black"
										style={{
											color: `hsl( from ${artwork.colorHsl} h 100% 50% )`,
										}}
									>
										<SVGComponent className="h-[1lh] w-[1lh]" />
									</span>
								</div>
							</figcaption>
						</figure>
					</NavLink>
				</li>
			))}
		</ul>
	)
}

function ArtworkModal({
	isOpen,
	setOpen,
	artworks,
}: {
	isOpen: boolean
	setOpen: (open: boolean) => void
	artworks: Artwork[]
}) {
	let h = window.innerHeight - SHEET_MARGIN
	let y = useMotionValue(h)
	let bgOpacity = useTransform(y, [0, h], [0.4, 0])
	let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`

	let bodyScale = useTransform(
		y,
		[0, h],
		[(window.innerWidth - SHEET_MARGIN) / window.innerWidth, 1],
	)
	let bodyTranslate = useTransform(y, [0, h], [SHEET_MARGIN - SHEET_RADIUS, 0])
	let bodyBorderRadius = useTransform(y, [0, h], [SHEET_RADIUS, 0])

	useMotionValueEvent(bodyScale, 'change', (v) => (root.style.scale = `${v}`))
	useMotionValueEvent(
		bodyTranslate,
		'change',
		(v) => (root.style.translate = `0 ${v}px`),
	)
	useMotionValueEvent(
		bodyBorderRadius,
		'change',
		(v) => (root.style.borderRadius = `${v}px`),
	)

	return (
		<AnimatePresence>
			{isOpen && (
				<MotionModalOverlay
					isOpen
					onOpenChange={setOpen}
					className="fixed inset-0 z-[550]"
					style={{ backgroundColor: bg as any }}
				>
					<MotionModal
						className="absolute bottom-0 w-full rounded-t-xl bg-[--page-background] shadow-lg will-change-transform"
						initial={{ y: h }}
						animate={{ y: 0 }}
						exit={{ y: h }}
						transition={staticTransition}
						style={{
							y,
							top: SHEET_MARGIN,
							paddingBottom: window.screen.height,
						}}
						drag="y"
						dragConstraints={{ top: 0 }}
						onDragEnd={(e, { offset, velocity }) => {
							if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
								setOpen(false)
							} else {
								animate(y, 0, { ...inertiaTransition, min: 0, max: 0 })
							}
						}}
					>
						<div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-400" />
						<Dialog className="px-4 pb-4 outline-none">
							<div className="flex justify-end">
								<Button
									className="mb-8 rounded border-none bg-transparent text-lg font-semibold text-blue-600 outline-none focus-visible:ring pressed:text-blue-700"
									onPress={() => setOpen(false)}
								>
									Done
								</Button>
							</div>
							<CustomPopup artworks={artworks} />
						</Dialog>
					</MotionModal>
				</MotionModalOverlay>
			)}
		</AnimatePresence>
	)
}

export default function Cluster({ places, artworks }: ClusterProps) {
	const [isOpen, setOpen] = useState(false)

	const matchingArtworkPlaces = geoPlaces.filter((artworkPlace) =>
		places.some(
			(place) =>
				artworkPlace.name.toLowerCase().includes(place.toLowerCase()) ||
				place.toLowerCase().includes(artworkPlace.name.toLowerCase()),
		),
	)

	return (
		<>
			<MapContainer
				className="markercluster-map"
				center={[45, -10] /* 51.5, 6.3 */}
				zoom={2}
				minZoom={2}
				maxZoom={6}
				maxBounds={L.latLngBounds(
					new L.LatLng(85, -210),
					new L.LatLng(-85, 210),
				)}
				scrollWheelZoom={false}
				wheelDebounceTime={500}
			>
				<MarkerClusterGroup
					iconCreateFunction={createClusterCustomIcon}
					spiderfyDistanceMultiplier={2}
				>
					<ArtworkPlacesMarkers
						geoPlaces={matchingArtworkPlaces}
						artworks={artworks}
						onMarkerClick={() => setOpen(true)}
					/>
				</MarkerClusterGroup>
				<GeoJSON
					data={world as FeatureCollection}
					style={(feature) =>
						feature ? getFeatureStyle(feature, matchingArtworkPlaces) : {}
					}
				/>
			</MapContainer>
			<ArtworkModal isOpen={isOpen} setOpen={setOpen} artworks={artworks} />
		</>
	)
}

function ArtworkPlacesMarkers({
	geoPlaces,
	onMarkerClick,
}: {
	geoPlaces: GeoPlace[]
	artworks: Artwork[]
	onMarkerClick: () => void
}) {
	return geoPlaces.map((place) => (
		<Marker
			icon={ninjaIcon}
			key={place.geoId}
			position={place.position}
			eventHandlers={{
				click: () => {
					console.log('marker clicked')
					onMarkerClick()
				},
			}}
		>
			<Tooltip>{place.name}</Tooltip>
		</Marker>
	))
}

// If you would like to pass some props to the Marker, please use react-leaflet Marker component API.
