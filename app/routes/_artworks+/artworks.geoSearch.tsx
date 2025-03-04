import { ClientOnly } from 'remix-utils/client-only'
import GeoSearchMap from '#app/components/geo-search.client'
import clusterStyles from './artworks.cluster.css?url'
import { LinksFunction } from '@remix-run/react/dist/routeModules'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: clusterStyles },
]

export default function GeoSearch() {
	return (
		<>
			<ClientOnly
				fallback={
					<div className="mt-12 grid h-fit w-screen place-items-center">
						<div className="mx-auto -translate-y-8 text-lg">Loading ... </div>
						<div className="mx-auto text-[6rem] text-[#84e0ff]">🗺️</div>
					</div>
				}
			>
				{() => <GeoSearchMap />}
			</ClientOnly>
		</>
	)
}
