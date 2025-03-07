// #region imports
// import { type Artwork } from '@prisma/client'
import { useEffect, useState } from 'react'
import {
    type LinksFunction, type LoaderFunctionArgs,
    Form,
    Link,
    NavLink,
    useLoaderData,
    useNavigation,
    useSearchParams,
    useSubmit
} from 'react-router'

import SVGComponent from '#app/components/ui/eye.tsx'
import { Icon } from '#app/components/ui/icon.js'
import { Input } from '#app/components/ui/input'
import SimpleHuePicker from '#app/components/ui/SimpleHuePicker'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { getColor } from '../resources+/search-data.server'
import colorSearch from './artworks.colorSearch.css?url'
import artworks from './artworks.index.css?url'
// #endregion imports

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: artworks },
	{ rel: 'stylesheet', href: colorSearch },
]

// #region Loader  // //§§  __________________________ Loader ⇅ ⬆︎⬇︎

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const query = url.searchParams.get('search')
	const qNumber = query !== null ? Number(query) : 0
	const searchType = 'color'
	const limit = 6
	const page = url.searchParams.get('page')
	const pageNumber: number = page !== null ? Number(page) : 1

	const data = await getColor(qNumber, )

	return {
		query,
		searchType,
		limit: Number(limit),
		page: pageNumber,
		data: data,
	}
}

// #endregion

// //§ ______________________ MARK: Export default 🌈
// https://uiwjs.github.io/react-color/#/hue

export default function ColorSearch({
	status,
	autoSubmit = true,
}: {
	status: 'idle' | 'pending' | 'success' | 'error'
	autoFocus?: boolean
	autoSubmit?: boolean
}) {
	const { data } = useLoaderData<typeof loader>()
	console.log('🚀 [colorSearch useLoaderData] data: ', {
		data,
	})
	const navigation = useNavigation()
	const [color, setcolor] = useState('')
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

	/* const handleNextPageClick = () => {
		window.location.search = nextPageUrl.toString()
	} */

	// We've seen useNavigate already, we'll use its cousin, useSubmit (https://remix.run/docs/en/main/hooks/use-submit), for this.
	const submit = useSubmit()
	const isSubmitting = useIsPending({
		formMethod: 'GET',
		formAction: '/',
	})

	// Spinner
	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has('q')

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		void submit(form)
	}, 400)

	// MARK: Hue Slider

	function HueSlider() {
		const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 })
		return (
			<SimpleHuePicker
				className="h-8 p-2 2xl:h-10 2xl:p-4"
				hue={hsva.h}
				onChange={(newHue) => {
					setHsva({ ...hsva, ...newHue })
					setcolor(JSON.stringify(newHue.h))
				}}
			/>
		)
	}

	useEffect(() => {
		const searchField = document.getElementById('query')
		if (searchField instanceof HTMLInputElement) {
			searchField.setAttribute('value', query ? query.toString() : '')
		}
	}, [query])

	//§  .............................  MARK: radio btns hook
	const [grid, setgrid] = useState('')

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
					className="group invisible h-0 w-0"
				/>
				<Icon
					name={name}
					size="font"
					className="!group-has-[label:nth-child(1)>input[type='radio']:checked]:text-slate-300 group-has-[input[type='radio']:checked]:animate-pulse![animation-duration:300ms] visible w-12 px-1 text-slate-500 group-has-[input[type='radio']:checked]:inline-flex"
				/>
			</label>
		)
	}

	// MARK: Return

	return (
		<>
			<main className="artworks-fade-in flex-col items-center justify-start p-4 pb-8 sm:p-10 md:px-12 lg:px-16 xl:px-24 2xl:px-32 2xl:py-8">
				{/*
           //§   ...........................................   MARK: Header
        */}
				<header className="mx-auto grid w-full grid-cols-3 place-content-center gap-4 rounded-md pb-6 text-lg 2xl:text-xl">
					<Logo />

					{/*
                        //§  MARK: 🔘 radio-btns
                    */}

					<form className="form col-span-2 grid h-12 grid-cols-[min-content_min-content] gap-[.5rem] self-center justify-self-end">
						<div className="navlink-map inline-flex h-10 w-14 cursor-pointer justify-center self-center justify-self-end rounded-md">
							<NavLink
								className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' z-10 inline-flex h-10 w-10 justify-center text-foreground`}
								to={`../artworks/cluster/?search=${query}&searchType=${searchType}`}
							>
								<Icon
									name="map"
									className="text-[1.7rem] text-slate-500"
									size="font"
								/>
							</NavLink>
						</div>
						<div className="inline-flex justify-around place-self-center rounded border-[0.5px] pb-2 pt-1 text-xl text-slate-500 md:gap-4 2xl:text-2xl">
							<RadioButton
								name="grid-1"
								value={grid}
								onChange={handleGrid1Change}
								className="group place-self-center"
							/>
							<RadioButton
								name="grid-2"
								value={grid}
								onChange={handleGrid2Change}
								className="group place-self-center"
							/>

							<RadioButton
								name="grid-3"
								value={grid}
								onChange={handleGrid3Change}
								className="group place-self-center"
							/>
						</div>
					</form>
				</header>

				{/*
        //§ Color Picker 🌈
        */}

				<HueSlider />

				<Form
					id="search-form"
					className="flex flex-wrap items-center justify-center gap-2 pt-2"
					onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
					role="search"
				>
					<div className="flex w-full pt-4">
						<label
							htmlFor="picker"
							className="inline-block h-12 w-full"
							/* style={{
								background: `linear-gradient(to right, hsl(${color}, 100%, 35%) 40%, hsl(${color}, 100%, 50%) 60%, hsl(${color}, 100%, 85%)`,
								color: `hsl(${color}, 100%, 50%)`,
							}} */
							style={{
								background: `transparent`,
								color: `hsl(${color}, 100%, 50%)`,
							}}
						></label>
						<Input
							autoFocus
							aria-label="Search by color"
							id="q"
							name="search"
							value={color}
							onChange={(e) => setcolor(e.target.value)}
							placeholder="Search"
							type="hidden"
						/>
					</div>
					<div>
						{/*
           //§   ...........................................   MARK: 🔎 Submit-Button
        */}
						<StatusButton
							type="submit"
							status={isSubmitting ? 'pending' : status}
							className="flex h-10 w-10 -translate-y-14 items-center justify-center rounded-full border-none hover:bg-black 2xl:absolute 2xl:top-24 2xl:h-12 2xl:w-16"
							style={{
								border: `hsl(${color}, 100%, 50%), 3px, solid`,
							}}
						>
							<Icon
								name="magnifying-glass"
								size="font"
								className="h-8 w-8 2xl:h-12 2xl:w-12"
								style={{
									color: color ? `hsl(${color}, 100%, 50%)` : `#111`,
								}}
							/>
							<span className="sr-only">Search</span>
						</StatusButton>
					</div>
					<div aria-hidden hidden={!searching} id="search-spinner" />
				</Form>
				<ul className="w-full gap-x-[3%] pt-4 [column-count:1] group-has-[label:nth-child(1)>input[type='radio']:checked]/body:[column-count:1] group-has-[label:nth-child(2)>input[type=radio]:checked]/body:[column-count:2] group-has-[label:nth-child(3)>input[type=radio]:checked]/body:[column-count:3] md:pt-8 md:[column-count:2] lg:gap-x-12 lg:pt-10 lg:[column-count:4] xl:gap-x-[4%] xl:pt-14 xl:[column-count:5] 2xl:gap-x-20 2xl:pt-20">
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
										isActive
											? 'active'
											: isPending
												? 'pending animate-pulse'
												: '' + 'w-full'
									}
									to={`../artworks/${artwork.id}`}
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
													(('radial-gradient(farthest-corner circle at -25% 0% in oklab, #0000 0% 45%, ' +
														artwork.colorHsl) as string) +
													'50%, #0000 55% 100% linear-gradient(180deg,  var(--bg-background) 0% 5%,  var(--bg-background) 45%, #0000,  var(--bg-background) 55%,  var(--bg-background) 95% 100%), linear-gradient(#000b, #000b))',
												backgroundSize: '250%',
											}}
										>
											<div className="group-has-[input[type=radio]]:grid-cols-2]:justify-self-start relative flex w-full flex-wrap font-light tracking-[-0.020rem] text-[#f2ece2]">
												<div className="w-full">
													{artwork.title} {'  '}
												</div>
												<div className="figcaption-artist w-[calc(100%-2rem)] font-medium leading-snug tracking-[-0.020rem] opacity-70">
													{artwork.artist_display}
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
												<span
													className="mx-auto text-3xl"
													style={{
														color: artwork.colorHsl as string,
													}}
												>
													<Icon name="paint-stroke" />
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
											{'  '}' this query {'  '}'
										</em>{' '}
									</strong>
									<br />
									<span className="opacity-80">
										{'  '}
										Search type:{'  '}
									</span>
									<strong>
										<em>''</em>
									</strong>
								</h2>
							</section>
						</div>
					)}
				</ul>
			</main>
		</>
	)
}

//§   ...........................................   MARK: LOGO

function Logo() {
	return (
		<Link
			to="/"
			className="logo group inline-grid justify-self-start rounded-md bg-[conic-gradient(from_-90deg_at_top_left,_#0001,_#fff1)] px-2 py-1 leading-tight lg:px-4 lg:py-2 2xl:text-2xl"
		>
			<span className="font-bold leading-none text-slate-500 transition group-hover:-translate-x-1">
				kunst
			</span>
			<span className="pl-3 font-light leading-none text-slate-300 transition group-hover:translate-x-1">
				räuber
			</span>
		</Link>
	)
}
