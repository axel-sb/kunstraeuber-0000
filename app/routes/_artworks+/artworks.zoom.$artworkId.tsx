import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData, NavLink } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'
import { Icon } from '#app/components/ui/icon.js'
import Viewer from '../../components/viewer.client'
import { getArtworkUrl } from '../resources+/search-data.server'
import zoomStyles from './artworks.zoom.artworkId.css?url'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: zoomStyles }]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariantResponse(params.artworkId, 'Missing artworkId param')
	const data = await getArtworkUrl({ id: Number(params.artworkId) })

	// return a default picture if no image_url is found or if the image_url is nullish.
	const src = data
		? (data.image_url ??
			'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg')
		: 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg'

	const artworkId = params.artworkId

	const identifier = src.split('/full/')[0]
	/* typeof identifier === 'string'
		? identifier
		: 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27' */

	// const colorHsl = data ? data.colorHsl ?? data.colorHsl : 'hsl(0 0% 100%)'

	return json({ identifier, artworkId })
}

export default function Zoom() {

	const { identifier } = useLoaderData() as { identifier: string }
	const { artworkId } = useLoaderData() as { artworkId: string }
	console.log('🧶', artworkId)
	// const { colorHsl } = useLoaderData() as { colorHsl: string }
	// const colorStyle = { '--color': colorHsl } as React.CSSProperties
	return (
		<>
			<div className="absolute bottom-6 left-8 z-10 inline-flex h-9 w-9 rounded-full text-xl">
				<NavLink
					className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' z-10 inline-flex h-10 w-10 place-items-center rounded-full `}
					to={`../artworks/${artworkId}`}
				>
					<Icon
						name="x"
						className="h-9 w-9 rounded-full"
						size="font"
						style={{background: 'radial-gradient(#fff, #000)'}}
					/>
				</NavLink>
			</div>
			<ClientOnly fallback={<div>Loading...</div>}>
				{() => <Viewer src={identifier} isTiledImage={true} />}
			</ClientOnly>
		</>
	)
}
