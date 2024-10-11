import MeshGradient from 'mesh-gradient.js'
import { useEffect, useMemo } from 'react'

function MeshGradients(colorH: number, colorS: number, colorL: number) {
	function hslToHex(colorH: number, colorS: number, colorL: number) {
		colorL /= 100
		const a = (colorS * Math.min(colorL, 1 - colorL)) / 100
		const f = (n: number): string => {
			const k = (n + colorH / 30) % 12
			const color = colorL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0') // convert to Hex and prefix "0" if needed
		}
		return `#${f(0)}${f(8)}${f(4)}`
	}

	console.log(
		'mesh-gradients.tsx > hslToHex(colorH ?? 0, colorS ?? 0, colorL ?? 0) → colHsl converted: ',
		hslToHex(colorH ?? 0, colorS ?? 0, colorL ?? 0),
	)

	const gradient = useMemo(() => new MeshGradient(), [])

	const canvasId = 'my-canvas'

	useEffect(() => {
		const COLORS = [
			`${hslToHex(colorH, colorS, 5)}`,
			`${hslToHex(colorH, colorS, 0)}`,
			`${hslToHex(colorH, colorS, 3)}`,
			`${hslToHex(colorH, colorS, 0)}`,
			`${hslToHex(colorH, colorS, Math.max(35, colorL))}`,
			`${hslToHex(colorH, colorS, 5)}`,
			`${hslToHex(colorH, colorS, 0)}`,
			`${hslToHex(colorH, colorS, 3)}`,
			`${hslToHex(colorH, colorS, 0)}`,
		]
		console.log('COLORS', COLORS)

		// initialize new gradient
		// @Params
		// 1. id of canvas element
		// 2. array of colors in hexcode
		gradient.initGradient('#' + canvasId, COLORS)
		// Mesh Id
		// Any positive numeric value which acts as a seed for mesh pattern
		gradient?.changePosition(2)
	}, [gradient, canvasId, colorH, colorL, colorS])

	const regenerate = () => {
		const value = Math.floor(Math.random() * 1000)
		// change pattern by changing mesh Id

		gradient?.changePosition(value)
	}

	return (
		<div className="grid h-screen w-screen grid-cols-[subgrid] grid-rows-[subgrid]">
			<button
				id="regenerate"
				className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 translate-y-full rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
				style={{
					backgroundImage: `radial-gradient(ellipse at -61% 141%, ${'hsl(' + colorH + ', 10%, 20%)'}, ${'hsl(' + colorH + ', 100%, 50%)'} 20%, ${'hsl(' + colorH + ', ' + colorS + '%, 15%)'}, ${'hsl(' + colorH + ', 100%, 30%)'} 60%)`,
				}}
				onClick={() => regenerate()}
			></button>
			<canvas
				id={canvasId}
				className="grid-column: 2 / -2 !important; grid-row: 1 / 2; display: grid; grid-template-columns: subgrid; grid-template-rows: subgrid; align-items: center; justify-content: space-between; -z-10"
				width="800"
				height="800"
			/>
		</div>
	)
}
export default MeshGradients
