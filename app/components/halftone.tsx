interface HalftoneProps {
	title: string;
	imageUrl: string;
}

export function Halftone({ title, imageUrl }: HalftoneProps) {
	return (
		<article>
			<section>
				<div className="halftone">
					<span className="title-container">
						<h1 className="title text-[clamp(1.5rem, calc(12px + 2vw), 2rem)] text-balance text-center">
							{title}
						</h1>
					</span>
					{/* This image is only included as a helper for the parent container to calculate the size of the halftone component, since the image is otherwise only included as a background url CSS variable which does not claim any space */}
					<img src={imageUrl} alt={title} />
				</div>
			</section>
		</article>
	)
}
