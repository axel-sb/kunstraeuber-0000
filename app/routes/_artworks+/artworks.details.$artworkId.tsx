// region imports
import { MeshGradients } from '#app/components/mesh-gradients.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.js'
import SVGComponent from '#app/components/ui/puzzle.tsx'
import { invariantResponse } from '@epic-web/invariant'
import { type Artwork } from '@prisma/client'
import chalk from 'chalk'
import { type FunctionComponent } from 'react'
import {
    Link,
    NavLink,
    redirect,
    // NavLink,
    useFetcher,
    useLoaderData,
    useNavigate,
    type ActionFunctionArgs,
    type LinksFunction,
    type LoaderFunctionArgs,
    type MetaFunction
} from 'react-router'
// import kunstraeuber from '../../../avatars/kunstraeuber.png'
// import circles from '../../../circles.svg'
import { getArtwork, updateArtwork } from '../resources+/search-data.server.tsx'
import detailsStyles from './artworks.details.artworkId.css?url'

// import { useNonce } from '#app//utils/nonce-provider.ts'
// #endregion imports

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: detailsStyles },
]

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `* ${data?.artwork.title ?? ''}` },
		{
			name: 'Details',
			content: `Details for a single artwork`,
		},
	]
}

export const action = async ({ params }: ActionFunctionArgs) => {
	invariantResponse(params.artworkId, 'Missing artworkId param')

	await updateArtwork(parseInt(params.artworkId))

	return redirect(`./`)
}

//    MARK: LOADER

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariantResponse(params.artworkId, 'Missing artworkId param')
	const artwork = await getArtwork({ id: Number(params.artworkId) })
	if (!artwork) {
		throw new Response(
			"'getArtwork(id)': This Artwork (ID) was not found on the Server",
			{
				status: 404,
			},
		)
	}

	// The underscore _ is a convention used by some developers to indicate that the value at that position in the array is not going to be used. This is a way to "ignore" certain returned values when destructuring an array.

	const filteredArtwork: Artwork = Object.fromEntries(
		Object.entries(artwork).filter(
			([_, value]) => value != null && value !== '' && value !== 'none',
		),
	) as Artwork

	console.group(chalk.blue.underline.overline('▇ ▇ ▇ ArtworkId ▇ ▇ ▇'))
	console.log(
		chalk.green(
			Object.entries(filteredArtwork).map(([k, v]) => `${k}: ${v}\n`),
		),
	)
	console.groupEnd()

	return { artwork: filteredArtwork }
}

//  MARK: FAVORITE

const Favorite: FunctionComponent<{
	artwork: Pick<Artwork, 'favorite'>
}> = ({ artwork }) => {
	const fetcher = useFetcher()
	const favorite = fetcher.formData
		? fetcher.formData.get('favorite') === 'true'
		: artwork.favorite

	const {
		artwork: { colorHsl: colorHsl },
	} = useLoaderData<typeof loader>()

	return (
		<fetcher.Form
			method="post"
			className="favorite z-50"
			style={{
				color: colorHsl || undefined,
			}}
		>
			<Button
				name="favorite"
				className="z-50 mr-0 inline-flex w-8 border-0 px-0 pt-2 text-[1.6rem]"
				style={{
					color: colorHsl || undefined,
					strokeDasharray: 50,
				}}
			>
				{favorite ? (
					<Icon name="star-filling" size="font" className="animated px-0" />
				) : (
					<Icon name="star" size="font" className="px-0 opacity-50" />
				)}
			</Button>
		</fetcher.Form>
	)
}

export default function ArtworkDetails() {
	const { artwork } = useLoaderData<typeof loader>()

	/*const colorHsl = `hsl(${artwork.colorHsl}`
	 const gradientBtnStyle = {
        '--colorHsl': colorHsl,
    } as React.CSSProperties */
	const colorHslIcon = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`
	console.log('colorHslIcon', colorHslIcon)
	const colorH = parseInt(`${artwork.color_h}`)
	const colorS = parseInt(`${artwork.color_s}`)
	const colorL = parseInt(`${artwork.color_l}`)

	const navigate = useNavigate()

	const colorRgb = `rgb(${HSLToRGB(artwork.color_h ?? 0, artwork.color_s ?? 0, 50)})`

	const artist = {
		__html: `
        <span class="artist-caption list-item opacity-80 font-medium"> Artist:  </span>
		    <span class="artist-name detail-content inline-block w-full pb-2"> <svg class="w-[1em] h-[1em] inline self-center mb-1 mr-2"><use href="/app/components/ui/icons/sprite.svg#magnifying-glass"></use></svg>  ${artwork.artist_display} </span>
        `,
	}

	const description = {
		__html:
			artwork.description && artwork.description !== 'null'
				? '<div class="opacity-80 font-medium">Description: </div>' +
					artwork.description
				: '',
	}

	/*
        //. MARK: RETURN ⮐ .
	 */

	return (
		<>
			<div className="details-container grid-rows-[max-content minmax(max-content,1fr)] 2xl:grid-rows-[8rem calc(100vh-8rem)] grid items-start justify-center justify-items-center gap-4 px-5 2xl:grid-cols-[20%_25%_55%]">
				{/*
                // .                                MARK: . . . . . . . . . .    ⓵   🢃 .
				 */}

				<div className="first-half-wrapper col-span-full row-[1_/_2] max-w-[clamp(300px,max-w-prose,calc(100vw-2rem))] flex-wrap items-center self-start pb-12 2xl:col-[2_/_3] 2xl:row-span-full 2xl:ml-auto 2xl:mr-2 2xl:max-h-[65dvh] 2xl:max-w-full">
					{/*
                    //. MARK:header 1 .
					  */}

					<header
						className="flex h-28 w-full items-center justify-between pb-6 2xl:mt-8 2xl:justify-end 2xl:pb-4"
						style={{ color: colorRgb }}
					>
						<Logo />
					</header>

					{/*
            // .  MARK:🏞️  .
					  */}

					<NavLink
						className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending'`}
						to={`../artworks/zoom/${artwork.id}`}
					>
						<img
							src={artwork.image_url ? artwork.image_url : 'undefined'}
							className="mx-auto !max-h-[65dvh] rounded-md object-contain 2xl:mt-1 2xl:self-end 2xl:rounded-lg"
						/>
					</NavLink>
				</div>

				{/*
                // .                                 MARK: . . . . . . . . .    ⓶   🢃 .
				  */}

				<div className="details-text-wrapper relative col-span-full max-w-[calc(100vw-2rem)] row-[2_/_3] overflow-y-auto 2xl:col-[3_/_4] 2xl:row-span-full 2xl:ml-2 2xl:mr-auto 2xl:max-h-[95dvh] 2xl:max-w-[clamp(30vw,65ch,50vw)]">
					{/*
          // .MARK:header 2
					  */}

					<header className="sticky top-0 mb-8 flex items-end justify-between overflow-hidden 2xl:mb-10 2xl:mr-16 2xl:h-28 2xl:pl-11">
						<Button
							className="btn-back relative z-50 flex h-10 w-10 cursor-pointer justify-self-center rounded-full p-0 text-body-2xs active:opacity-50"
							variant="ghost"
							onClick={() => {
								navigate(-2)
							}}
						>
							<Icon
								name="arrow-left"
								size="font"
								style={{ borderRadius: '50%', color: colorRgb }}
								className="text-[1.95rem] ring-[var(--colorHsl)] transition-all duration-200 hover:cursor-pointer hover:ring-2 hover:ring-offset-2"
							/>
						</Button>

						{/*
                        //. MARK: Zoom 🔎 .
						  */}

						<div className="navlink-zoom col-[3_/_4] inline-flex h-10 w-10 cursor-pointer justify-self-center rounded-full pb-0.5">
							<NavLink
								className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' z-10 inline-grid h-10 w-10 place-items-center text-foreground`}
								to={`../artworks/zoom/${artwork.id}`}
							>
								<Icon
									name="zoom-in"
									className="text-[1.9rem]"
									size="font"
									style={{
										color: colorRgb,
									}}
								/>
							</NavLink>
						</div>

						<Favorite artwork={artwork} />
					</header>

					<div
						className="list-wrapper relative max-w-prose overflow-y-auto overscroll-contain pb-8 pl-3 2xl:h-[calc(95dvh-9rem)] 2xl:p-0"
						style={
							{
								'--colorHsl': colorRgb,
								'--colorHslOp50': 'hsl(from var(--colorHsl) h s 10 )',
							} as React.CSSProperties
						}
					>
						{/* // . MARK:► DETAILS <UL>
                        // #region column defs
                        • artwork_type_title string - The kind of object or work (e.g. Painting, Sculpture, Book)
                        • style_titles array - The names of all style terms related to this artwork
                        •
                        • subject_titles array - The names of all subject terms related to this artwork
                        •
                        // #endregion
						 */}

						<ul className="mx-auto flex max-w-prose flex-col gap-2 pb-10 leading-relaxed md:text-xl 2xl:mx-0 2xl:max-w-full 2xl:px-12">
							<NavLink
								to={`../artworks?search=${artwork.artist_title}&searchType=artist`}
							>
								<span dangerouslySetInnerHTML={artist}></span>
							</NavLink>

							{Object.entries({
								Title: artwork.title,
								Date: artwork.date_display,
								Place: (
									<NavLink
										to={`../artworks?search=${artwork.place_of_origin}&searchType=place`}
										className="group"
									>
										<Icon name="magnifying-glass" className="mb-1 mr-2" />
										<span className="group-hover:underline">
											{artwork.place_of_origin}
										</span>
									</NavLink>
								),
								Medium: (
									<NavLink
										to={`../artworks?search=${artwork.medium_display}&searchType=medium`}
										className="group"
									>
										<Icon name="magnifying-glass" className="mb-1 mr-2" />
										<span className="pr-2 group-hover:underline">
											{artwork.medium_display}
										</span>
									</NavLink>
								),
							})
								.filter(
									([key, value]) =>
										value &&
										value !== '' &&
										key !== 'id' &&
										key !== 'image_url' &&
										key !== 'alt_text' &&
										key !== 'Description' &&
										key !== 'Artist' &&
										key !== 'color_h' &&
										key !== 'color_s' &&
										key !== 'color_l' &&
										key !== 'Category' &&
										key !== 'width' &&
										key !== 'height' &&
										key !== 'image_id' &&
										key !== 'is_boosted' &&
										value !== 'none' &&
										value !== 'null' &&
										(key === 'Title' ||
											key === 'Date' ||
											key === 'Place' ||
											key === 'Medium'),
								)
								.sort(([keyA], [keyB]) => {
									const order = [
										'title',
										'date_display',
										'place_of_origin',
										'medium_display',
									]
									const indexA = order.indexOf(keyA)
									const indexB = order.indexOf(keyB)
									return indexA - indexB
								})
								.map(([key, value]) => (
									<li key={key} className="pb-3 2xl:pb-0">
										<span className="list-item font-medium opacity-80">
											{key}:
										</span>{' '}
										<span className="detail-content list-item">{value}</span>
									</li>
								))}
							<li
								className="max-w-prose leading-relaxed text-foreground"
								dangerouslySetInnerHTML={
									description.__html ? description : undefined
								}
							></li>
							{Object.entries({
								Style: artwork.style_titles,
								Subject: artwork.subject_titles,
								Type: artwork.artwork_type_title,
								Technique: artwork.technique_titles,
								Provenance: artwork.provenance_text,
								Term: artwork.term_titles,
							})
								.filter(
									([_, value]) =>
										value &&
										value !== '' &&
										value !== 'none' &&
										value !== 'null',
								)
								.map(([key, value]) => (
									<li key={key} className="pb-3 2xl:pb-0">
										<span className="list-item font-medium opacity-80">
											{key}
											{': '}
										</span>

										<span className="detail-content inline-block">{value}</span>
									</li>
								))}
							<li className="pb-3 2xl:pb-0">
								<span className="list-item pr-12 font-medium opacity-80">
									Color:
								</span>
								<span className="detail-content list-item w-fit" style={{}}>
									<NavLink
										className={({ isActive, isPending }) =>
											isActive
												? 'active'
												: isPending
													? 'pending'
													: 'underline decoration-[var(--colorHsl)] underline-offset-8'
										}
										to={`/artworks/colorSearch?search=${artwork.color_h}&searchType=color`}
									>
										<Icon name="magnifying-glass" className="mb-1 mr-2" />
										{artwork.colorHsl}
									</NavLink>
								</span>
							</li>
						</ul>
						{/* MARK: Footer
						 */}
						<div className="flex items-center justify-between">
							<Button
								className="btn-back relative z-50 flex h-10 w-10 cursor-pointer justify-start rounded-full p-0 text-body-2xs"
								variant="ghost"
								onClick={() => {
									navigate(-2)
								}}
							>
								<Icon
									name="arrow-left"
									size="font"
									style={{ borderRadius: '50%', color: colorRgb }}
									className="text-[1.95rem] ring-[var(--colorHsl)] transition-all duration-200 hover:cursor-pointer"
								/>
							</Button>
							<NavLink
								className={({ isActive, isPending }) =>
									isActive
										? 'active'
										: isPending
											? 'pending'
											: '' + 'mb-1 mr-6 h-8 w-8'
								}
								to={`../artworks/puzzle/${artwork.id}`}
							>
								<SVGComponent
									className="h-[1em] w-[1em] text-4xl"
									style={{
										borderRadius: '50%',
										color: colorRgb,
										stroke: '#121212',
										strokeWidth: '0.25px',
									}}
								/>
							</NavLink>
						</div>
					</div>
				</div>
			</div>
			{MeshGradients(colorH, colorS, colorL)}
		</>
	)
}

/* // .MARK: LOGO fn
 */

function Logo() {
	const { artwork } = useLoaderData<typeof loader>()
	const colorRgb = `rgb(${HSLToRGB(artwork.color_h ?? 0, artwork.color_s ?? 0, 50)})`

	return (
		<Link
			to="/"
			className="logo group z-10 grid justify-start p-0 leading-snug"
		>
			<span
				className="inline-block justify-self-start text-xl font-medium leading-none transition group-hover:translate-x-1"
				style={{ color: colorRgb }}
			>
				kunst
			</span>
			<div className="inline-block pl-4 text-xl font-light leading-none text-yellow-100 transition group-hover:-translate-x-1">
				räuber
			</div>
		</Link>
	)
}

/* // .MARK: HSLToRGB fn
 */

function HSLToRGB(h: number, s: number, l: number): string {
	s /= 100
	l /= 100
	const k = (n: number) => (n + h / 30) % 12
	const a = s * Math.min(l, 1 - l)
	const f = (n: number) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
	return `${Math.round(255 * f(0))}, ${Math.round(255 * f(8))}, ${Math.round(255 * f(4))}`
}
