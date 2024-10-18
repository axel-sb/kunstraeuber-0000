interface HalftoneProps {
	title: string;
	imageUrl: string;
	colorHsl: string;
}

export function Halftone({ imageUrl }: HalftoneProps) {
	return (
		<article className="lg:my-[50vh] lg:-translate-y-1/2">
			<section>
				<div className="halftone frame">
					{/* This image is only included as a helper for the parent container to calculate the size of the halftone component, since the image is otherwise only included as a background url CSS variable which does not claim any space */}
					<img src={imageUrl} alt="dummy" />
				</div>
			</section>
		</article>
	)
}
