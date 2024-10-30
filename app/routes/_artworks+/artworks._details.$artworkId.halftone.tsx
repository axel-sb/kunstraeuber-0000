// region imports
import { invariantResponse } from '@epic-web/invariant'
import { type Artwork } from '@prisma/client'
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
	redirect,
	type MetaFunction,
	type ActionFunctionArgs,
} from '@remix-run/node'
import {
	Link,
	NavLink,
	// NavLink,
	useFetcher,
	useLoaderData,
	useNavigate,
} from '@remix-run/react'
import chalk from 'chalk'
import { type FunctionComponent } from 'react'
import { Halftone } from '#app/components/halftone.1.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.js'
// import kunstraeuber from '../../../avatars/kunstraeuber.png'
// import circles from '../../../circles.svg'
import { getArtwork, updateArtwork } from '../resources+/search-data.server.tsx'
import detailsStyles from './artworks._details.artworkId.1.css?url'

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

	return json({ artwork: filteredArtwork })
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
		<fetcher.Form method="post" className="favorite z-50">
			<Button
				name="favorite"
				variant="ghost"
				size="ghost"
				className="z-50 mr-4 inline-flex w-8 px-0 pt-2 text-[1.65rem]"
				style={{
					color: `hsl(from ${colorHsl as unknown as string} h s 50 `,
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
	const navigate = useNavigate()

	const colorHsl = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`

	// Define halftoneUrl
	/* const halftoneUrl =
		`url(${artwork.image_url}) no-repeat 50%/contain` as React.CSSProperties */

	const artist = {
		__html: `<li>
        <span class="artist-caption list-item opacity-80"> Artist:  </span>
		<span class="artist-name detail-content inline-block "> ${artwork.artist_display} </span>`,
	}

	const description = {
		__html:
			artwork.description && artwork.description !== 'null'
				? '<div class="text-base opacity-80">Description: </div>' +
					artwork.description
				: '',
	}

	/* MARK: ⮐ RETURN ⮐
	 */

	return (
		<div className="details-container grid-rows-[minmax(min-content, 1fr)] grid w-screen grid-cols-[30%_70%] items-center justify-around justify-items-center bg-background 2xl:ml-[10%]">
			<div className="first-half-wrapper justify-end-end col-span-full row-[1_/_2] max-h-[calc(100dvh)] max-w-[calc(100%-2rem)] flex-wrap items-center self-start pb-12 2xl:col-[1_/_2] 2xl:row-span-full 2xl:ml-auto 2xl:mr-2 2xl:max-w-[45%] 2xl:justify-end">
				{/* //   MARK:HEADER ▀▀▀
				 */}
				<header
					className="flex h-28 items-center justify-between pb-6 2xl:mt-8 2xl:pb-0"
					style={{ color: colorHsl }}
				>
					<Logo />
				</header>

				{/* MARK: ◐ HALFTONE ◑
				 */}

				<Halftone halftoneUrl={artwork.image_url ?? ''} />

				{/* .MARK:DETAILS 📄 🎁
				 */}

				<div className="details-text-wrapper col-span-full row-[2_/_3] max-w-[calc(100%-2rem)] self-start pb-4 2xl:col-[2_/_3] 2xl:row-span-full 2xl:ml-2 2xl:mr-auto 2xl:justify-start">
					<header className="flex h-28 w-full items-center justify-between 2xl:mt-8 2xl:px-12 2xl:pb-0">
						<Button
							className="btn-back relative z-50 flex h-10 w-10 cursor-pointer justify-self-center rounded-full p-0 active:opacity-50"
							variant="ghost"
							onClick={() => {
								navigate(-1)
							}}
						>
							<Icon
								name="arrow-left"
								className="h-8 w-8 text-[1.8rem] ring-[var(--colorHsl)] transition-all duration-200 hover:cursor-pointer hover:ring-2 hover:ring-offset-2"
								style={{ borderRadius: '50%', color: colorHsl }}
							/>
						</Button>

						{/*//. MARK: ⃝ ZOOM 🔎
						 */}
						<div className="navlink-zoom col-[3_/_4] inline-flex h-10 w-10 cursor-pointer justify-end justify-self-center rounded-full pb-0.5">
							<NavLink
								className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' z-10 inline-flex h-10 w-10 place-items-center text-foreground`}
								to={`../artworks/zoom/${artwork.id}`}
							>
								<Icon
									name="zoom-in"
									className="text-[2rem]"
									size="font"
									style={{
										color: colorHsl,
									}}
								/>
							</NavLink>
						</div>

						<Favorite artwork={artwork} />
					</header>

					{/* .MARK:► UL ◯
                        (details) */}
					<div
						className="list-wrapper 2xl:rounded-lg 2xl:py-8"
						style={
							{
								'--colorHsl': colorHsl,
								'--colorHslOp50': 'hsl(from var(--colorHsl) h s 10 )',
							} as React.CSSProperties
						}
					>
						<ul className="mx-auto flex max-w-prose flex-col gap-2 overflow-y-auto px-6 py-3 leading-relaxed 2xl:mx-0 2xl:max-h-[70vh] 2xl:px-12">
							<li dangerouslySetInnerHTML={artist} />

							{Object.entries({
								Title: artwork.title,
								Date: artwork.date_display,
								Place: artwork.place_of_origin,
								Medium: artwork.medium_display,
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
										,
									]
									const indexA = order.indexOf(keyA)
									const indexB = order.indexOf(keyB)
									return indexA - indexB
								})
								.map(([key, value]) => (
									<li key={key} className="pb-3 2xl:pb-0">
										<span className="list-item opacity-80">{key}:</span>{' '}
										<span className="detail-content inline-block">{value}</span>
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
							})
								.filter(
									([_, value]) =>
										value &&
										value !== '' &&
										value !== 'none' &&
										value !== 'null',
								)
								.map(([key, value]) => (
									<li key={key}>
										<span className="list-item opacity-80">
											{key}
											{': '}
										</span>

										<span className="detail-content inline-block">{value}</span>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

{
	/*
	MARK: LOGO FN
*/
}

function Logo() {
	const { artwork } = useLoaderData<typeof loader>()
	const colorHsl = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`

	return (
		<Link
			to="/"
			className="logo group z-10 grid justify-start p-0 pt-4 leading-snug"
		>
			<span
				className="inline-block justify-self-start text-xl font-medium leading-none transition group-hover:translate-x-1"
				style={{ color: colorHsl }}
			>
				kunst
			</span>
			<div className="inline-block pl-4 text-xl font-light leading-none text-yellow-100 transition group-hover:-translate-x-1">
				räuber
			</div>
		</Link>
	)
}
