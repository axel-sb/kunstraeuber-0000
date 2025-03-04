import Cluster from '#app/components/markercluster.client.tsx'
import { Combobox } from '#app/components/search-combobox.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import ToggleButton from '#app/components/ui/ToggleButton.tsx'
import { useCallback, useState } from 'react'
import {
    MetaFunction,
    NavLink,
    useLoaderData,
    useSearchParams
} from 'react-router'
import { ClientOnly } from 'remix-utils/client-only'
import { type Route } from '../../+types/root.ts'
import { searchArtworks } from '../resources+/search-data.server.tsx'
import clusterStyles from './artworks.cluster.css?url'

export const links: Route.LinksFunction = () => [
	{ rel: 'stylesheet', href: clusterStyles },
]

export const meta: MetaFunction = () => {
	return [
		{ title: '*🗺️ Artwork Location' },
		{
			name: 'Markercluster',
			content: `a world map showing search-related locations`,
		},
	]
}

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const query = url.searchParams.get('search') ?? ''
	const searchType =
		url.searchParams.get('searchType') ?? 'search type is not yet selected'
	const limit = 6
	const page = url.searchParams.get('page')
	const pageNumber: number = page !== null ? Number(page) : 1
	console.log('🔢 pageNumber', pageNumber)
	const artworksData = await searchArtworks(
		query,
		searchType,
		limit,
		pageNumber,
	)

	return {
		query,
		searchType,
		limit: Number(limit),
		page: pageNumber,
		data: artworksData,
	}
}
export default function Index() {
	const {
		data: artworks,
		page,
		query,
		searchType,
	} = useLoaderData<typeof loader>()
	console.log('page, artworks ', artworks, page)
	console.log('page, artworks ', page, artworks)

	const [searchParams] = useSearchParams()
	const nextPage = page + 1
	const nextPageUrl = new URLSearchParams(searchParams)
	nextPageUrl.set('page', nextPage.toString())

	const handleNextPageClick = () => {
		window.location.search = nextPageUrl.toString()
	}

	const combobox = <Combobox status="idle" />

	const places = [
		...artworks.map(
			(place) =>
				(place.place_of_origin ?? 'unknown') +
				' - ' +
				(place.title ?? 'untitled'),
		),
	]
	console.log('🌎📍', { places })

	// remove all empty items from an array https://michaeluloth.com/javascript-filter-boolean/
	const placesFound = places.filter(Boolean)

    const [show, setShow] = useState(true)
		const handleToggle = useCallback(() => setShow((show) => !show), [])

	return (
		<>
			<header className="absolute flex w-full items-center justify-between">
				<Logo />
				<ToggleButton
					className="z-[1000000001] ml-auto mr-4 h-8 w-8 min-w-fit text-2xl "
					onToggle={handleToggle}
					isActive={show}
				>
					<Icon name="magnifying-glass"></Icon>{' '}
				</ToggleButton>
			</header>
			<fieldset
				className={`bg-slate-95 combobox max-w-screen ${show ? 'opacity-100' : 'opacity-0'} absolute z-[500] hidden w-[clamp(21rem,30rem,97vw)] flex-1 bg-black px-0.5 pb-2 pt-1 md:block`}
			>
				{combobox}
			</fieldset>

			<ClientOnly fallback={<div>Loading...</div>}>
				{() => <Cluster places={placesFound} artworks={artworks} />}
			</ClientOnly>
		</>
	)
}

function Logo() {
	return (
		<NavLink
			to="/"
			className="logo group inline-grid justify-self-start py-4 pl-4 leading-tight"
		>
			<span className="font-bold leading-none text-cyan-200 transition group-hover:-translate-x-1">
				kunst
			</span>
			<span className="pl-3 font-light leading-none text-yellow-100 transition group-hover:translate-x-1">
				räuber
			</span>
		</NavLink>
	)
}
