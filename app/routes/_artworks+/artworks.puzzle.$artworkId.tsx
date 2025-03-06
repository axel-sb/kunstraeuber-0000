// @ts-nocheck

import { invariantResponse } from '@epic-web/invariant'
import { useCallback, useEffect, useState } from 'react'
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	NavLink,
	useLoaderData,
	useNavigate,
} from 'react-router'
import { ClientOnly } from 'remix-utils/client-only'
import { ConfettiShower } from '#app/components/confetti.js'
import { initializePuzzleGame } from '#app/components/puzzle.client.js'
import { Button } from '#app/components/ui/button.js'
import SVGComponent from '#app/components/ui/eye1.tsx'
import { Icon } from '#app/components/ui/icon.js'
import ToggleButton from '#app/components/ui/ToggleButton.tsx'
import { getArtwork } from '../resources+/search-data.server'
import puzzleStyles from './artworks.puzzle.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: puzzleStyles },
]

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
	return { artwork }
}

function PuzzleComponent() {
	const { artwork } = useLoaderData<typeof loader>()
	const [confettiId, setConfettiId] = useState<string | null>(null)
	const colorRgbLight = `rgb(${HSLToRGB(artwork.color_h ?? 0, artwork.color_s ?? 0, 100)})`
	const colorRgbDark = `rgb(${HSLToRGB(artwork.color_h ?? 0, artwork.color_s ?? 0, 100)})`
	const handleGameOver = () => {
		console.log('handleGameOver called', Date.now().toString())
		setConfettiId(Date.now().toString())
	}

	useEffect(() => {
		// Small delay to ensure DOM is ready
		setTimeout(() => initializePuzzleGame(artwork.image_url, handleGameOver), 0)
	}, [artwork.image_url])

	const navigate = useNavigate()

	const [show, setShow] = useState(true)
	const handleToggle = useCallback(() => setShow((show) => !show), [])

	return (
		<>
        <header className="absolute flex w-full items-center justify-between">
				<Logo /> </header>
			<div className="mx-auto p-4">
				<canvas id="canvas" className="" />
			</div>
			<img
				src={`${artwork.image_url}`}
				className={`bg-opacity-50 transition-opacity ${show ? 'opacity-100' : 'opacity-0'}`}
			/>

			<div className="mx-auto mb-6 mt-6 w-full max-w-sm px-4">
				<label
					htmlFor="difficulty"
					className="flex flex-wrap justify-between text-lg opacity-50"
				>
					<div className="w-full pb-2 text-center text-xl opacity-100">
						Difficulty
					</div>
					<div>2 x 2</div>
					<div>3 x 3</div>
					<div>4 x 4</div>
					<div>5 x 5</div>
					<div>6 x 6</div>
				</label>
				<input
					type="range"
					id="difficulty"
					min="2"
					max="6"
					defaultValue="4"
					className="w-full max-w-96 appearance-none"
				/>
			</div>
			<div className="mt-6 flex w-full items-center justify-between p-6">
				<Button
					className="btn-back mr-auto inline-flex cursor-pointer justify-center rounded-full p-1"
					variant="ghost"
					size="ghost"
					onClick={() => {
						void navigate(-1)
					}}
				>
					<NavLink
						className={`$({ isActive, isPending }) => isActive ? 'active' : 'pending' transition-x-0 className="text-3xl" relative col-[1_/_2] inline-flex translate-y-0 place-items-center justify-center justify-self-center rounded-full p-1.5`}
						to={'./'}
					>
						<Icon name="arrow-left" size="font" className="text-4xl" />
					</NavLink>
				</Button>
				<ToggleButton
					className="ml-auto h-6 w-8 min-w-fit"
					onToggle={handleToggle}
					isActive={show}
				>
					<SVGComponent
						className="h-[1lh] w-[1lh]"
						style={{
							color: `hsl( from ${artwork.colorHsl} h 100% 50% )`,
						}}
					/>
				</ToggleButton>
			</div>
			{confettiId ? (
				<ConfettiShower
					id={confettiId}
					colors={[colorRgbLight, colorRgbLight, colorRgbDark]}
				/>
			) : null}
		</>
	)
}

/*   MARK: HSLToRGB fn
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

export default function Puzzle() {
	/* const handleToggle = useCallback(() => setShow((show) => !show), []) */
	return (
		<>
			<ClientOnly
				fallback={
					<div className="mt-12 grid h-fit w-screen place-items-center">
						<div className="mx-auto -translate-y-8 text-lg text-[#7eb16a]">
							Loading ...{' '}
						</div>
						<div className="mx-auto text-7xl">🧩</div>
					</div>
				}
			>
				{() => (
					<>
						<PuzzleComponent />
					</>
				)}
			</ClientOnly>
		</>
	)
}

function Logo() {
	return (
		<NavLink
			to="/"
			className="logo group z-[1000000001] inline-grid justify-self-start py-4 pl-4 leading-tight"
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