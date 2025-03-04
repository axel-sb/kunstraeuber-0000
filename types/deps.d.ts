// This module should contain type definitions for modules which do not have
// their own type definitions and are not available on DefinitelyTyped.

// declare module 'some-untyped-pkg' {
// 	export function foo(): void;
// }
declare module 'react-leaflet-markercluster' {
	import { MarkerClusterGroupOptions } from 'leaflet.markercluster'
	import { ReactNode } from 'react'

	interface MarkerClusterGroupProps extends MarkerClusterGroupOptions {
		children?: ReactNode
	}

	export default function MarkerClusterGroup(
		props: MarkerClusterGroupProps,
	): JSX.Element
}

declare module '#app/components/puzzle.client.js'

