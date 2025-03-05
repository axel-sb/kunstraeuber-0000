// #region  import export
import { type Artwork } from '@prisma/client'
import React from 'react'
import {
	Link,
	type LinksFunction,
	NavLink,
	useLoaderData,
	useNavigate,
	useSearchParams,
} from 'react-router'
import { Button } from '#app/components/ui/button.js'
import SVGComponent from '#app/components/ui/eye1.tsx'
import { Icon } from '#app/components/ui/icon.js'
import  { type Route } from '../../+types/root'
import { searchArtworks } from '../resources+/search-data.server'
import artworks from './artworks.index.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: artworks },
]

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const query = url.searchParams.get('search') ?? ''
	const searchType =
		url.searchParams.get('searchType') ?? 'search type is not yet selected'
	const limit = 6
	const page = url.searchParams.get('page')
	const pageNumber: number = page !== null ? Number(page) : 1
	console.log('🔢 pageNumber', pageNumber)
	const data = await searchArtworks(query, searchType, limit, pageNumber)

	return {
		query,
		searchType,
		limit: Number(limit),
		page: pageNumber,
		data,
	}
}
// #endregion

// MARK: export default

export default function Index() {
	// #region Index
	const {
		data: artworks,
		page,
		query,
		searchType,
	} = useLoaderData<typeof loader>()
	console.log('artworks, page', artworks, page)

	const [searchParams] = useSearchParams()
	const nextPage = page + 1
	const nextPageUrl = new URLSearchParams(searchParams)
	nextPageUrl.set('page', nextPage.toString())

	const handleNextPageClick = () => {
		window.location.search = nextPageUrl.toString()
	}

	const navigate = useNavigate()
	// #endregion Index
	// #region radio btns

	const [grid, setGrid] = React.useState('')

	const handleGrid1Change = () => {
		setGrid('grid-1')
	}
	const handleGrid2Change = () => {
		setGrid('grid-2')
	}
	const handleGrid3Change = () => {
		setGrid('grid-3')
	}

	type RadioButtonProps = {
		value: string
		name: 'grid-1' | 'grid-2' | 'grid-3'
		onChange: () => void
		className?: string
	}
	const RadioButton = ({
		value,
		name,
		onChange,
		className,
	}: RadioButtonProps) => {
		const checked = value === name

		return (
			<label className={className}>
				<input
					type="radio"
					name={name}
					checked={checked}
					onChange={() => onChange()}
					className="group invisible h-0 w-0 has-[input[type='radio']:checked]:text-yellow-300"
				/>
				<Icon
					name={name}
					size="font"
					className="!group-has-[input[type='radio']:checked]:text-yellow-300 visible w-12 px-1 text-yellow-100/50 group-has-[input[type='radio']:checked]:inline-flex group-has-[input[type='radio']:checked]:animate-pulse"
				/>
			</label>
		)
	}
	// #endregion radio btns
	// MARK: return

	return (
		<>
			<main className="artworks-fade-in p-4 pb-8 sm:p-10 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
				<header className="mx-auto grid h-16 w-full grid-cols-3 place-content-center text-lg 2xl:text-xl">
					<Logo />

					<div className="navlink-map flex h-10 w-14 -translate-x-2 cursor-pointer justify-center self-center justify-self-start rounded-md">
						<NavLink
							className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' z-10 inline-flex h-10 w-10 justify-center text-foreground`}
							to={`../artworks/cluster/?search=${query}&searchType=${searchType}`}
						>
							<Icon name="map" className="text-[1.7rem]" size="font" />
						</NavLink>
					</div>

					<form className="form col-[3/4] grid h-12 self-center justify-self-end">
						<div className="group/radio flex justify-around place-self-center rounded-md pb-2 pr-1 pt-1 text-xl text-yellow-50/50 md:gap-4 2xl:text-2xl">
							<RadioButton
								name="grid-1"
								value={grid}
								onChange={handleGrid1Change}
								className="place-self-center"
							/>
							<RadioButton
								name="grid-2"
								value={grid}
								onChange={handleGrid2Change}
								className="place-self-center"
							/>
							<RadioButton
								name="grid-3"
								value={grid}
								onChange={handleGrid3Change}
								className="place-self-center"
							/>
						</div>
					</form>
				</header>

				<ul className="relative min-h-[calc(100vh-8rem)] w-full gap-x-[3%] overflow-auto pt-4 [column-count:1] group-has-[label:nth-child(1)>input[type='radio']:checked]/body:[column-count:1] group-has-[label:nth-child(2)>input[type=radio]:checked]/body:[column-count:2] group-has-[label:nth-child(3)>input[type=radio]:checked]/body:[column-count:3] md:py-8 md:[column-count:2] lg:gap-x-12 lg:pt-10 lg:[column-count:4] xl:gap-x-[4%] xl:pt-14 xl:[column-count:5] 2xl:gap-x-20 2xl:pt-20">
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
								to={`./${artwork.id}`}
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
												<SVGComponent />
											</span>
										</div>
									</figcaption>
								</figure>
							</NavLink>
						</li>
					))}
					<li>
						<Button
							className="btn-back absolute bottom-0 left-0 inline-flex h-10 w-10 cursor-pointer justify-center justify-self-center rounded-full p-0"
							variant="ghost"
							size="ghost"
							onClick={() => {
								/* navigate('../artworks') */
								void navigate(-1)
							}}
						>
							<Icon name="arrow-left" size="font" className="text-3xl" />
							{/* <NavLink
						className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' transition-x-0 relative col-[1_/_2] inline-flex h-10 w-10 translate-y-0 place-items-center justify-center justify-self-center rounded-full p-0 p-1.5`}
						to={'./'}
					>
						<Icon name="arrow-left" size="font" className="text-3xl" />
					</NavLink> */}
						</Button>
					</li>
				</ul>
			</main>
			{/* //+ MARK: Next Page
			 */}
			<button
				className="group sticky top-[100dvh] z-10 mb-4 ml-auto flex h-12 w-1/2 items-center justify-end rounded-lg px-4 text-base leading-none text-yellow-100/50 opacity-60 transition hover:opacity-100 sm:h-16 md:px-12 lg:px-16 xl:px-24 2xl:px-32 2xl:text-xl"
				onClick={handleNextPageClick}
			>
				<span className="leading-none text-yellow-100/80 opacity-60 duration-200 group-hover:translate-x-0 group-hover:opacity-100">
					next page
				</span>
				<Icon
					name="arrow-right"
					size="font"
					className="group-hover: ml-3 scale-x-110 pt-1 text-4xl leading-none text-yellow-100/80 duration-300 group-hover:translate-x-2 group-hover:stroke-cyan-200 group-hover:stroke-1"
				/>
			</button>{' '}
			<Footer />
		</>
	)
}

// #region Logo, Footer

function Logo() {
	return (
		<Link
			to="/"
			className="logo justify-self-startpr-3 group inline-grid py-4 leading-tight"
		>
			<span className="font-bold leading-none text-cyan-200 transition group-hover:-translate-x-1">
				kunst
			</span>
			<span className="pl-3 font-light leading-none text-yellow-100 transition group-hover:translate-x-1">
				räuber
			</span>
		</Link>
	)
}

function Footer() {
	const { searchType, query } = useLoaderData<typeof loader>()
	return (
		<footer className="search-params sticky top-[100dvh] mb-4 flex items-center justify-between gap-4 rounded-lg bg-black p-4 text-base leading-none sm:p-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 2xl:text-xl">
			<div className="text-left leading-none text-yellow-100/50">
				{/* <Icon
					name="magnifying-glass"
					className="text-[x-large] leading-[.75] opacity-60"
				/> */}
				<span>
					<em className="font-normal leading-none opacity-60">
						{searchType}:{' '}
					</em>{' '}
				</span>
				{query || ' '}
			</div>
		</footer>
	)
}
// #endregion Logo, Footer
