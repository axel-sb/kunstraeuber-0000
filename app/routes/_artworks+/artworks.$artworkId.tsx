// region imports
import { invariantResponse } from '@epic-web/invariant'
import { type Artwork } from '@prisma/client'

import { type Route } from '../../+types/root.ts'
import {
	Link,
	NavLink,
	useFetcher,
	useLoaderData,
	useNavigate,
	data,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from 'react-router'
import chalk from 'chalk'
import { type FunctionComponent } from 'react'
import { MeshGradients } from '#app/components/mesh-gradients.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.js'
import { getArtwork, updateArtwork } from '../resources+/search-data.server.tsx'
import artworkId from './artworks.artworkId.css?url'

// import { useNonce } from '#app//utils/nonce-provider.ts'
// #endregion imports

export const links: Route.LinksFunction = () => [
	{ rel: 'stylesheet', href: artworkId },
]

export const meta: Route.MetaFunction = ({ data }) => {
	return [
		{ title: '* Kunsträuber Artwork Page' },
		{
			name: 'ArtworkId',
			content: `A single artwork`,
		},
	]
}

export const action = async ({ params }: ActionFunctionArgs) => {
	invariantResponse(params.artworkId, 'Missing artworkId param')

	await updateArtwork(parseInt(params.artworkId))

	return redirect(`./`)
}

//    ......................................    MARK: Loader

export async function loader({ params }: Route.LoaderArgs) {
	invariantResponse(params.artworkId, 'Missing artworkId param')
	const artwork = await getArtwork({ id: Number(params.artworkId) })
	console.log('params', params)
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

	console.group(
		chalk.blue.underline.overline('ArtworkId                           🧑🏻‍🎨'),
	)
	console.log(
		chalk.cyanBright.black(
			Object.entries(filteredArtwork).map(([k, v]) => `${k}: ${v}\n`),
		),
	)
	console.groupEnd()

	return { artwork: filteredArtwork }
}

//    ......................................    MARK: FAVORITE

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
			className="favorite pr-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-4 justify-self-end"
		>
			<Button
				name="favorite"
				variant="ghost"
				size="ghost"
				className="inline-flex w-8 px-0 text-3xl"
				style={{
					strokeDasharray: 50,
				}}
			>
				{favorite ? (
					<Icon
						name="star-filling"
						size="xl"
						className="animated px-0"
						style={{
							color: `hsl(from ${colorHsl as unknown as string} h s 50 )`,
							strokeDasharray: 50,
						}}
					/>
				) : (
					<Icon name="star" size="xl" className="px-0 opacity-50" />
				)}
			</Button>
		</fetcher.Form>
	)
}

//    ......................................    MARK: export default

export default function ArtworkId() {
	const { artwork } = useLoaderData<typeof loader>()
	const colorHslIcon = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`
	console.log('colorHslIcon', colorHslIcon)
	const colorH = parseInt(`${artwork.color_h}`)
	const colorS = parseInt(`${artwork.color_s}`)
	const colorL = parseInt(`${artwork.color_l}`)

	// for back-button
	const navigate = useNavigate()

	return (
		<>
			<header className="header flex items-center justify-between bg-opacity-0">
				<Logo />
				<Favorite artwork={artwork} />
			</header>
			{/* // .MARK: FIGURE 🪆
			 */}
			<figure className="col-[1_/_-1] row-[2_/_3] grid h-full max-h-[calc(100dvh-8rem)] items-center justify-center gap-y-6">
				<div className="image-wrapper row-[1_/_2] mx-auto max-h-[calc(100dvh-18rem)]">
					<img
						className="mx-auto h-auto max-h-[calc(100dvh-20rem)] max-w-[clamp(283px,843px,calc(100vw-2rem))] rounded-md object-contain object-center"
						alt={artwork.alt_text ?? undefined}
						key={artwork.id}
						src={artwork.image_url ?? '../../../four-mona-lisas-sm.jpg'}
					/>
				</div>
				{/*//  .MARK:FIGCAPTION
				 */}
				<figcaption className="col-[2_/_5] row-[2_/_3] px-1">
					<div className="caption-text col-[1_/_-1] row-[1_/_2] text-lg">
						<div className="title col-[1_/_-1] row-[2_/_3] text-balance text-center">
							{artwork.title}
						</div>
						<div className="artist col-[1_/_-1] row-[3_/_4] text-balance text-center">
								{artwork.artist_title}
						</div>
					</div>
				</figcaption>
			</figure>
			<footer className="row-[3_/_4] sm:px-8 md:px-12 lg:px-16 xl:px-20">
				{/* //  .MARK: FOOTER TOOLBAR ⏪
				 */}
				<div
					className="toolbar col-[1_/_-1] w-full justify-around"
					style={{ color: colorHslIcon }}
				>
					{/* //  .MARK: ⃝ btn-back ⏪
					 */}
					<Button
						className="btn-back relative col-[1_/_2] inline-flex h-10 w-10 flex-[2_1_auto] cursor-pointer justify-center justify-self-center rounded-full p-0"
						variant="ghost"
						size="ghost"
						onClick={() => {
							/* navigate('../artworks') */
							navigate(-1)
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
					{/*// .MARK: ⃝ info-circled ℹ️
					 */}
					<div className="navlink-info col-[2_/_3] row-[1_/_2] inline-flex h-10 w-10 flex-[6_1_auto] justify-center justify-self-center">
						<NavLink
							className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending scale-150' inline-flex h-10 w-10 place-items-center p-1.5`}
							to={`../artworks/details/${artwork.id}`}
						>
							<Icon
								name="info-circled"
								size="font"
								className="mx-auto pr-0.5 text-[2.05rem] xl:text-4xl"
							/>
						</NavLink>
					</div>

					{/* //  MARK: ⃝ ZOOM 🔎
					 */}

					<div className="navlink-zoom col-[3_/_4] inline-flex h-10 w-10 flex-[2_1_auto] cursor-pointer justify-end justify-self-center rounded-full pt-0.5">
						<NavLink
							className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending animate-pulse' z-50 inline-flex h-10 w-10 place-items-center`}
							to={`../artworks/zoom/${artwork.id}`}
						>
							<Icon
								name="zoom-in"
								className="text-[2.05rem] xl:text-4xl"
								size="font"
								style={{
									stroke: 'hsl(20 14.3 4.1)',
									strokeWidth: '.2px',
								}}
							/>
						</NavLink>
					</div>
				</div>
			</footer>

			{MeshGradients(colorH, colorS, colorL)}
		</>
	)
}

{
	/*// .MARK  Logo
	 */
}
function Logo() {
	const { artwork } = useLoaderData<typeof loader>()
	const colorHsl = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`

	return (
		<Link
			to="/"
			className="logo group z-10 grid justify-start px-6 pt-8 pb-2 leading-snug"
		>
			<span
				className="inline-block justify-self-start text-xl font-medium leading-none transition group-hover:translate-x-1"
				style={{ color: colorHsl }}
			>
				kunst
			</span>
			<div className="inline-block pl-4 text-xl font-light leading-none text-yellow-100 transition group-hover:-translate-x-1">
				räuber
			</div>
		</Link>
	)
}
