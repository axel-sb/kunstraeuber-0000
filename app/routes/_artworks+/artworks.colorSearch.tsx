// #region imports
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import {
	Form,
	Link,
	NavLink,
	useLoaderData,
	useLocation,
	useNavigation,
	useSubmit,
} from '@remix-run/react'

import Hue from '@uiw/react-color-hue'
import chalk from 'chalk'
import { useEffect, useState } from 'react'
import SVGComponent from '#app/components/ui/eye.tsx'
import { Icon } from '#app/components/ui/icon.js'
import { Input } from '#app/components/ui/input'
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
	const q = url.searchParams.get('q') ?? '200'
	let data = await getColor((q ?? '200').toString())
	return json({ q, data })
}
// #endregion

// //§ ______________________ MARK: exp.default 🌈
// https://uiwjs.github.io/react-color/#/hue

export default function ColorSearch({
	status,
	autoSubmit = true,
}: {
	status: 'idle' | 'pending' | 'success' | 'error'
	autoFocus?: boolean
	autoSubmit?: boolean
}) {
	const { q, data } = useLoaderData<typeof loader>()
	const navigation = useNavigation()

	const [color, setcolor] = useState('')

	function HueSlider() {
		const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 })
		return (
			<Hue
				hue={hsva.h}
				onChange={(newHue) => {
					setHsva({ ...hsva, ...newHue })
					setcolor(JSON.stringify(newHue.h))
				}}
			/>
		)
	}

	useEffect(() => {
		const searchField = document.getElementById('q')
		if (searchField instanceof HTMLInputElement) {
			searchField.value = q || ''
		}
	}, [q])

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
		submit(form)
	}, 400)

	const location = useLocation()

	/* const colorHsl = data?.length > 0 ? data[0]?.colorHsl : 'hsl(0, 0%, 0%)' ?? 'hsl(0, 0%, 0%)'; */

	/* const currentQueryKey = location.search
		.split('&')
		.find((part) => part.startsWith('='))
		?.split('=')[1] */

	//§  __________________________________ MARK: return
	//§   Color Picker 🌈

	// adapted from artworks.index

	/* const { data, query } = useLoaderData<typeof loader>()
const location = useLocation()
	const searchType = useLoaderData<typeof loader>().searchType */
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

	{
		/* return (
		<>
			<header className="hidden py-6">
				<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8"></nav>
			</header>
			<HueSlider />
			<Form
				id="search-form"
				className="flex flex-wrap items-center justify-center gap-2"
				onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
				role="search"
			>
				<div className="flex w-full">
					<label
						htmlFor="picker"
						className="inline-block h-16 w-full"
						style={{
							background: `linear-gradient(to right, hsl(${color}, 100%, 35%) 40%, hsl(${color}, 100%, 50%) 60%, hsl(${color}, 100%, 85%)`,
							color: `hsl(${color}, 100%, 50%)`,
						}}
					></label>
					<Input
						autoFocus
						aria-label="Search by color"
						id="q"
						name="q"
						value={color}
						onChange={(e) => setcolor(e.target.value)}
						placeholder="Search"
						//type="hidden"
						list="dominantColors"
					/>
					<datalist id="dominantColors">
						<option value="37"></option>
						<option value="#8B0000"></option>
						<option value="#A52A2A"></option>
						<option value="#DC143C"></option>
					</datalist>
				</div>
				<div>
					<StatusButton
						type="submit"
						status={isSubmitting ? 'pending' : status}
						className="relative -top-14 flex h-8 w-full items-center justify-center border-0 hover:bg-secondary/10"
					>
						<Icon
							name="magnifying-glass"
							size="xl"
							style={{
								color: color ? `hsl(${color}, 100%, 50%)` : undefined,
								filter: 'invert(.1)',
							}}
						/>
						<span className="sr-only">Search</span>
					</StatusButton>
				</div>
				<div aria-hidden hidden={!searching} id="search-spinner" />
			</Form>
			<label htmlFor="b">Choose a browser: </label>
			<input list="list" id="b" name="browser" />
			<datalist id="list">
				<option value="Chrome"></option>
				<option value="Firefox"></option>
				<option value="Internet Explorer"></option>
				<option value="Opera"></option>
				<option value="Safari"></option>
				<option value="Microsoft Edge"></option>
			</datalist>{' '}

			//§§  ______________________________________  MARK main

			<main className="flex flex-col items-center overscroll-contain px-4">
				<ul className="artworks-fade-in grid grid-cols-2 gap-2 md:grid-cols-4">
					{/* className="artworks-fade-in flex w-full touch-pan-y snap-y list-none flex-col items-center justify-start gap-y-28 overflow-y-auto overflow-x-visible overscroll-contain pb-28 pt-12"

					{data ? (
						location.search === '' ? (
							<li className="w-15rem relative flex max-w-sm flex-wrap justify-center whitespace-pre text-lg text-yellow-50">
								<p className="px-4 font-normal opacity-100">Select a color 🡕</p>
								<p className="px-4 font-semibold opacity-50">
									(search type: <em> " {currentQueryKey} " </em>)
								</p>
							</li>
						) : (
							data.map((artwork) => (
								<li
									key={artwork.id}
									className="flex max-h-fit snap-center items-center"
								>
									<NavLink
										className={({ isActive, isPending }) =>
											isActive ? 'active' : isPending ? 'pending' : ''
										}
										to={`../artworks/${artwork.id}`}
									>
										{artwork.title ? (
											<figure className="relative z-40 mx-auto grid max-h-full max-w-[281px] place-items-center gap-4 pt-4 lg:static lg:max-w-full lg:-translate-x-28 lg:grid-cols-2">
												// todo https://pagedone.io/docs/image
												<img
													alt={artwork.alt_text ?? undefined}
													key={artwork.id}
													src={artwork.image_url ?? '../dummy.jpeg'}
												/>

												{/*
                                            //§§   .  .  .  .  .  .  .  .  .  .    MARK Figcaption
                                            */
	}
	{
		/*
												<figcaption className="z-50 flex w-full justify-between pt-2 lg:absolute lg:-right-8 lg:top-32 lg:max-w-fit lg:translate-x-full">
													<div className="relative flex w-full flex-wrap text-sm">
														<div className="max-w-full">{artwork.title}</div>

														<div className="w-[calc(100%-1rem)] font-semibold opacity-50">
															{artwork.artist_title}
														</div>
														<Icon
															name="eye-open"
															className="icon-eye absolute -right-6 top-0 hidden h-6 w-6 opacity-90 lg:hidden"
															style={{
																color: artwork.colorHsl as string,
															}}
														/>
														<Icon
															name="arrow-right"
															className="icon-arrow h-4 w-4 justify-self-end lg:ml-[calc(100%-3rem)] lg:mt-4 lg:block"
															style={{
																color: artwork.colorHsl as string,
															}}
														/>
													</div>
												</figcaption>
											</figure>
										) : (
											<i>No Artworks found for query {q} </i>
										)}
									</NavLink>
								</li>
							))
						)
					) : (
						<li className="w-15rem relative flex max-w-sm flex-wrap justify-center whitespace-pre text-lg text-yellow-50">
							<p className="px-4 font-normal opacity-100">
								Nothing found for query: <em> " {q} " </em>
							</p>
							<p className="px-4 font-semibold opacity-50">
								(search type: <em> " {currentQueryKey} " </em>)
							</p>
						</li>
					)}
				</ul>
			</main>
			<div className="footer container flex items-center justify-between pb-0 pt-16">
				<Logo />
				<div className="relative flex">
					<h2 className="pb-4 text-center leading-none">
						<span className="font-semibold opacity-50">
							query{' '}
							<em className="font-normal opacity-100">
								{' '}
								{currentQueryKey}
								{': '}
							</em>{' '}
						</span>
						{q || ' '}{' '}
						{/* same as: {location.search.split('&')[0].split('=')[1]} */
	}
	{
		/*
					</h2>
				</div>
			</div>
		</>
	) */
	}

	return (
		<>
			{/*
           //   MARK:👑 Main
        */}
			<main className="artworks-fade-in flex-col items-center justify-start p-4 pb-8 sm:p-10 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
				{/*
           //§   ...........................................   MARK: Header
        */}

				<header className="mx-auto grid h-16 w-full grid-cols-2 place-content-center gap-4 rounded-md bg-black px-4 text-lg 2xl:text-xl">
					<Logo />

					{/*
           //§   ...........................................   MARK: 🔘 radio-btns
        */}

					<form className="form col-[2/3] mr-4 grid h-12 self-center justify-self-end md:mr-6 lg:mr-8">
						<div className="group/radio flex justify-around divide-x-reverse divide-slate-700 place-self-center rounded border-[0.5px] border-solid border-yellow-50/25 py-1 pr-1 text-xl text-yellow-50/50 md:gap-4 2xl:text-2xl">
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
				<HueSlider />
				<Form
					id="search-form"
					className="flex flex-wrap items-center justify-center gap-2"
					onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
					role="search"
				>
					<div className="flex w-full">
						<label
							htmlFor="picker"
							className="inline-block h-16 w-full"
							/* style={{
								background: `linear-gradient(to right, hsl(${color}, 100%, 35%) 40%, hsl(${color}, 100%, 50%) 60%, hsl(${color}, 100%, 85%)`,
								color: `hsl(${color}, 100%, 50%)`,
							}} */
							style={{
								background: `ltransparent`,
								color: `hsl(${color}, 100%, 50%)`,
							}}
						></label>
						<Input
							autoFocus
							aria-label="Search by color"
							id="q"
							name="q"
							value={color}
							onChange={(e) => setcolor(e.target.value)}
							placeholder="Search"
							type="hidden"
						/>
					</div>
					<div>
						<StatusButton
							type="submit"
							status={isSubmitting ? 'pending' : status}
							className="relative -top-14 flex h-10 w-10 items-center justify-center border-0 hover:bg-secondary/10"
							style={{
								backgroundColor: color ? `hsl(${color}, 100%, 50%)` : undefined,
							}}
						>
							<Icon
								name="magnifying-glass"
								size="xl"
								style={{
									color: color ? `hsl(${color}, 100%, 50%)` : undefined,
									filter: 'invert(1)',
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
										isActive ? 'active' : isPending ? 'pending' : '' + 'w-full'
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
			className="logo group inline-grid justify-self-start px-6 py-2 leading-tight lg:px-8"
		>
			<span className="animate-hue font-bold leading-none text-cyan-200 transition group-hover:-translate-x-1">
				kunst
			</span>
			<span className="pl-3 font-light leading-none text-yellow-100 transition group-hover:translate-x-1">
				räuber
			</span>
		</Link>
	)
}
