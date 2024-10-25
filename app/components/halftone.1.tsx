// import { Link } from "@remix-run/react"

interface HalftoneProps {
	halftoneUrl: string
}

export function Halftone({ halftoneUrl }: HalftoneProps) {
	return (
		<article className="noproc">
			<section>
				<div
					className="halftone"
					style={{ "--halftone-url": `url(${halftoneUrl})` } as React.CSSProperties}
				></div>
			</section>
		</article>
	)
}



/* function Logo() {

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
				räuber
			</div>
		</Link>
	)
} */
