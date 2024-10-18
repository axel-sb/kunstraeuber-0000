import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useNavigate, useLoaderData } from '@remix-run/react'
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
	console.log('🟡 data →', data)

	// return a default picture if no image_url is found or if the image_url is nullish.
	const src = data
		? data.image_url ??
			'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg'
		: 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg'

	console.log('🟢 src →', src, typeof src)

	const identifier = src.split('/full/')[0]
	console.log('🔴 identifier →', identifier)
	/* typeof identifier === 'string'
		? identifier
		: 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27' */

	const colorHsl = data ? data.colorHsl ?? data.colorHsl : 'hsl(0 0% 100%)'

	return json({ identifier, colorHsl })
}

export default function Zoom() {
	const navigate = useNavigate()
	const { identifier } = useLoaderData() as { identifier: string }
	const { colorHsl } = useLoaderData() as { colorHsl: string }
	const colorStyle = { '--color': colorHsl } as React.CSSProperties
	return (
		<>
			<div className="rounded-full backdrop-filter absolute bottom-6 left-8 z-10 inline-flex h-9 w-9  text-xl backdrop-brightness-[4] [box-shadow:0_0_0_0.5px_#000]">
				<Icon
					name="x"
					className="backdrop-brightness-500 h-9 w-9"
					size="font"
					style={{}}
					onClick={() => navigate(-1)}
				/>
			</div>
			<ClientOnly fallback={<div>Loading...</div>}>
				{() => <Viewer src={identifier} isTiledImage={true} />}
			</ClientOnly>
		</>
	)
}
