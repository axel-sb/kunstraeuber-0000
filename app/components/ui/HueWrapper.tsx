import { type ReactNode } from 'react'
// Import from our custom shim instead of the original package
import Hue from '#app/lib/color-hue-shim.js'

// This is a wrapper component to ensure proper loading of the Hue component
export function HueWrapper(props: {
	className?: string
	hue: number
	onChange: (newHue: { h: number }) => void
	children?: ReactNode
}) {
	return <Hue {...props} />
}

export default HueWrapper