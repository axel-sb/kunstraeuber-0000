import { type ReactNode } from 'react'

interface HueProps {
	prefixCls?: string
	className?: string
	hue?: number
	onChange?: (newHue: { h: number }) => void
	children?: ReactNode
	[key: string]: any
}

declare const Hue: React.FC<HueProps>

export default Hue
