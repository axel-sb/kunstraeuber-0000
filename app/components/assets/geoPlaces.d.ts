export interface GeoPlace {
	geoId: Key | null | undefined
	position: [number, number]
	name: string
}

export const geoPlaces: ArtworkPlace[]
