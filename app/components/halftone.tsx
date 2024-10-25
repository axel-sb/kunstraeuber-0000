import { Link } from "@remix-run/react"

interface HalftoneProps {
	title: string
	imageUrl: string
	colorHsl: string
}

export function Halftone({ imageUrl, colorHsl }: HalftoneProps) {
	return (
		<div className="halftone-header hidden">
			{/* //   MARK:HEADER ▀▀▀
			 */}
			<header
				className="flex items-center justify-between"
				style={{ color: colorHsl }}
			>
				<Logo />
			</header>
			<article className="self-start">
				<img
					src={imageUrl}
					alt="dummy"
					className="alt inline max-w-[calc(100%-2rem)] object-contain 2xl:max-h-[calc(100vh-15rem)]"
				/>
				<section className="section2 hidden">
					<div className="halftone2">
						{/* This image is only included as a helper for the parent container to calculate the size of the halftone component, since the image is otherwise only included as a background url CSS variable which does not claim any space */}
						<img
							src={imageUrl}
							alt="dummy"
							className="alt inline max-w-[calc(100%-2rem)] -translate-y-[200%] object-contain relative 2xl:max-h-[calc(100vh-15rem)]"
						/>
					</div>
				</section>
			</article>
			<div className="disco-ball relative translate-y-full p-6 text-lg">🪩</div>
		</div>
	)
}

function Logo() {

	return (
		<Link
			to="/"
			className="logo group z-10 grid justify-start p-6 leading-snug"
		>
			<span
				className="inline-block justify-self-start text-xl font-medium leading-none transition group-hover:translate-x-1"

			>
				kunst
			</span>
			<div className="inline-block pl-4 text-xl font-light leading-none text-yellow-100 transition group-hover:-translate-x-1">
				räuber
			</div>
		</Link>
	)
}