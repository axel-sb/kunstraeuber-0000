export function Halftone() {
	return (
		<article>
			<section >
				<div className="halftone">
					<span className="title-container">
						<h1 className="title text-balance text-center">
							Sunday Morning, Mayflower Hotel, N.Y.
						</h1>
					</span>
					{/* This image is only included as a helper for the parent container to calculate the size of the halftone component, since the image is otherwise only included as a background url CSS variable which does not claim any space */}
					<img src="https://www.artic.edu/iiif/2/c04a376f-23fc-65da-bc10-6af4b77f120a/full/843,/0/default.jpg" />
				</div>
			</section>
		</article>
	)
}
