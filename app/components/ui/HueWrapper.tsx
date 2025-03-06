import Hue from '@uiw/react-color-hue'
import { type ReactNode } from 'react'

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