// #region  import export
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import { Link, NavLink, useLoaderData, useLocation } from '@remix-run/react'
import chalk from 'chalk'
import React from 'react'
import SVGComponent from '#app/components/ui/eye.tsx'
import { Icon } from '#app/components/ui/icon.js'
import {
	getAny,
	getArtist,
	getStyle,
	getPlace,
	getDate,
	getColor,
} from '../resources+/search-data.server'
import artworks from './artworks.index.css?url'
export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: artworks },
]

/* //§   _________________________________ MARK: Loader
   This function is only ever run on the server. On the initial server render, it will provide data to the HTML document. On navigations in the browser, Remix will call the function via fetch from the browser. This means you can talk directly to your database, use server-only API secrets, etc. Any code that isn't used to render the UI will be removed from the browser bundle. */
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const query =
		url.searchParams.get('search') ?? 'search query input is missing'
	const searchType =
		url.searchParams.get('searchType') ?? 'search type is not yet selected'

	let data
	switch (searchType) {
		case 'all':
			data = await getAny(query)
			break
		case 'artist':
			data = await getArtist(query)
			break
		case 'style':
			data = await getStyle(query)
			break
		case 'place':
			data = await getPlace(query)
			break
		case 'date':
			data = await getDate(Number(query))
			break
		case 'color':
			data = await getColor((query ?? '').toString())
			break

		default:
			data = await getAny('Picasso') // break
	}
	// const colorHsl = Array.isArray(data) ? '' : (data as unknown as { colorHsl?: string })?.colorHsl ?? ''
	return json({ searchType, query, data })
}

// #endregion import export

//+                                            export default
// MARK: Export default
export default function ArtworksPage() {
	const { data, query } = useLoaderData<typeof loader>()
	const location = useLocation()
	const searchType = useLoaderData<typeof loader>().searchType
	const colorHsl =
		(useLoaderData<typeof loader>().data as { colorHsl?: string })?.colorHsl ??
		''
	console.log('🟡 colorHsl →', colorHsl)

	console.log(
		chalk.blue(
			console.group('Object.entries(location).map(([k, v]) ➜ '),
			Object.entries(location).map(([k, v]) => `${chalk.red(k)}: ${v}  \n`),
		),
	)
	//§  .............................  MARK: radio btns hook
	const [grid, setgrid] = React.useState('')

	const handleGrid1Change = () => {
		setgrid('grid-1')
	}
	const handleGrid2Change = () => {
		setgrid('grid-2')
	}
	const handleGrid3Change = () => {
		setgrid('grid-3')
	}

	type RadioButtonProps = {
		value: string
		name: 'grid-1' | 'grid-2' | 'grid-3'
		onChange: () => void
	}
	const RadioButton = ({ value, name, onChange }: RadioButtonProps) => {
		const checked = value === name

		return (
			<label>
				<input
					type="radio"
					name={name}
					checked={checked}
					onChange={() => onChange()}
					className="group invisible h-0 has-[input[type='radio']:checked]:text-yellow-300"
				/>
				<Icon
					name={name}
					size="font"
					className="text-yellow-100/50 group-has-[input[type='radio']:checked]:inline-flex group-has-[input[type='radio']:checked]:animate-pulse !group-has-[input[type='radio']:checked]:text-yellow-300"
				/>
			</label>
		)
	}

	return (
		<>
			{/*
           //§   ............................................   MARK:👑 Main
        */}
			<main className="artworks-fade-in flex-col items-center justify-start px-4 pb-8 pt-0 sm:p-10 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
				{/*
           //§   ...........................................   MARK: Header
        */}

				<header className="mx-auto grid w-full max-w-[clamp(843px+4rem)] grid-cols-2 justify-between gap-4 rounded-bl-2xl rounded-br-2xl bg-black py-6 pb-8 md:pt-4 md:pb-12">
					<Logo />

					{/*
           //§   ...........................................   MARK: 🔘 btns
        */}

					<form className="form align-self-center col-[2/3] w-fit justify-self-end">
						<div className="group/radio grid grid-cols-3 place-items-center rounded border-[0.5px] border-solid border-yellow-50/25 pb-2 pt-1 pr-3 text-xl text-yellow-50/50 md:gap-4 md:text-3xl">
							<RadioButton
								name="grid-1"
								value={grid}
								onChange={handleGrid1Change}
							/>
							<RadioButton
								name="grid-2"
								value={grid}
								onChange={handleGrid2Change}
							/>

							<RadioButton
								name="grid-3"
								value={grid}
								onChange={handleGrid3Change}
							/>
						</div>
					</form>
				</header>
				<ul className="3xl:gap-x-[5%] w-full gap-x-[3%] [column-count:1] group-has-[label:nth-child(1)>input[type='radio']:checked]/body:[column-count:1] group-has-[label:nth-child(2)>input[type=radio]:checked]/body:[column-count:2] group-has-[label:nth-child(3)>input[type=radio]:checked]/body:[column-count:3] md:[column-count:2] lg:gap-x-12 lg:[column-count:4] xl:gap-x-[4%] xl:[column-count:5] 2xl:gap-x-20">
					{data !== undefined && data.length > 0 ? (
						data.map((artwork) => (
							<li
								key={artwork.id}
								className="flex w-full items-center justify-center"
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
									<figure className="group-has-[input[type=radio]]:grid-cols-1]:mb-40 relative mb-8 flex break-inside-avoid flex-col items-center justify-between xl:mb-20">
										<img
											alt={artwork.alt_text ?? undefined}
											key={artwork.id}
											src={artwork.image_url ?? '../dummy.jpeg'}
											className="hover-[gradient-border] w-full max-w-full rounded-md object-contain object-center md:rounded-lg"
										/>

										{/*
                       //§   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .    MARK: Figcaption
                  */}
										<figcaption
											className="z-50 my-4 flex w-full flex-wrap justify-between overflow-hidden rounded-md py-4 backdrop-blur-sm"
											style={{
                                                backgroundColor: '#0000',
												backgroundImage:
													(('linear-gradient(180deg, #0008 0% 5%, #0003 45%, #0000, #0002 55%, #0008 95% 100%), linear-gradient(#000b, #000b), radial-gradient(farthest-corner circle at -25% 0% in oklab, #0000 0% 45%, ' +
														artwork.colorHsl) as string) +
													'  50%, #0000 55% 100%)',
												backgroundSize: '250%',
											}}
										>
											<div className="group-has-[input[type=radio]]:grid-cols-2]:justify-self-start relative flex w-full flex-wrap font-light tracking-[-0.020rem] text-[#f2ece2]">
												<div className="w-full">
													{artwork.title} {'  '}
												</div>
												<div className="figcaption-artist w-[calc(100%-2rem)] font-medium leading-snug tracking-[-0.020rem] opacity-70">
													{artwork.artist_title}
												</div>
												<span
													className="ml-auto self-end overflow-hidden"
													style={{
														color: artwork.colorHsl as string,
													}}
												>
													<SVGComponent className="h-[1lh] w-[1lh] sm:h-[.9lh] sm:w-[.9lh]" />
													{/* h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 */}
												</span>
											</div>
										</figcaption>
									</figure>
								</NavLink>
							</li>
						))
					) : (
						<div className="section-wrapper backgroundImage: 'url(avatars/sad-thief.png)', objectFit: 'contain', w-full">
							<section
								className="w-full p-6 font-semibold text-yellow-50"
								style={{
									columnSpan: 'all',
								}}
							>
								<h2 className="mx-auto text-lg">
									... couldn't find anything for <br />
									{'  '}
									<span className="inline-block pr-1 pt-3 opacity-80">
										{' '}
										Search term:{'  '}
									</span>
									<strong>
										<em>
											{' '}
											{'  '}'{query} {'  '}'
										</em>{' '}
									</strong>
									<br />
									<span className="opacity-80">
										{'  '}
										Search type:{'  '}
									</span>
									<strong>
										<em>'{searchType}'</em>
									</strong>
								</h2>
							</section>
						</div>
					)}
				</ul>
				<Footer />
			</main>
		</>
	)
}

//§   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .    MARK: Logo

function Logo() {
	return (
		<Link to="/" className="group/logo col-[1/2] grid leading-snug md:text-2xl">
			<span className="font-light leading-none text-cyan-200 transition group-hover/logo:-translate-x-1">
				kunst
			</span>
			<span className="font-bold leading-none text-yellow-100 transition group-hover/logo:translate-x-1">
				räuber
			</span>
		</Link>
	)
}
//§   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .    MARK: Footer

function Footer() {
	const searchType = useLoaderData<typeof loader>().searchType
	const query = useLoaderData<typeof loader>().query
	return (
		<footer className="search-params mt-4 flex  translate-y-4 items-center justify-between gap-4 rounded-lg bg-black py-4">
			<div className="text-left leading-none">
				<span className="font-semibold opacity-50">search </span>
				<span>
					<em className="font-normal opacity-100">
						{searchType}
						{': '}
					</em>{' '}
				</span>
				{query || ' '}{' '}
				{/* same as: {location.search.split('&')[0].split('=')[1]} */}
			</div>

			<div className="text-right leading-none">
				<span className="font-semibold opacity-50">page: </span>{' '}
				<em className="font-normal opacity-100">{useLocation().pathname} </em>{' '}
			</div>
		</footer>
	)
}
