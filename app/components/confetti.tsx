import Confetti from 'react-confetti'
import { ClientOnly } from 'remix-utils/client-only'

export function ConfettiShower({ id }: { id?: string | null }, colors: string[]) {
	if (!id) return null

	return (
		<ClientOnly>
			{() => (
				<Confetti
					drawShape={(ctx) => {
						ctx.beginPath()
						for (let i = 0; i < 22; i++) {
							const angle = 0.35 * i
							const x = (0.2 + 1.5 * angle) * Math.cos(angle)
							const y = (0.2 + 1.5 * angle) * Math.sin(angle)
							ctx.lineTo(x, y)
						}
						ctx.stroke()
						ctx.closePath()
					}}
					key={id}
					run={Boolean(id)}
					recycle={false}
					numberOfPieces={500}
					width={window.innerWidth}
					height={window.innerHeight}
					colors={colors}
				/>
			)}
		</ClientOnly>
	)
}
