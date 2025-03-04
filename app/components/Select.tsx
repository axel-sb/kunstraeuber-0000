import { ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { type AriaSelectProps } from '@react-types/select'
import * as React from 'react'
import {
	useSelect,
	HiddenSelect,
	useButton,
	mergeProps,
	useFocusRing,
} from 'react-aria'
import { useSelectState } from 'react-stately'

import { ListBox } from './ListBox'
import { Popover } from './Popover'

export { Item } from 'react-stately'

export function Select<T extends object>(props: AriaSelectProps<T>) {
	// Create state based on the incoming props
	let state = useSelectState(props)

	// Get props for child elements from useSelect
	let ref = React.useRef(null)
	let { labelProps, triggerProps, valueProps, menuProps } = useSelect(
		props,
		state,
		ref,
	)

	// Get props for the button based on the trigger props from useSelect
	let { buttonProps } = useButton(triggerProps, ref)

	let { focusProps, isFocusVisible } = useFocusRing()

	return (
		<div className="relative mt-4 inline-flex w-52 flex-col">
			<div
				{...labelProps}
				className="block cursor-default text-left text-sm font-medium text-gray-700"
			>
				{props.label}
			</div>
			<HiddenSelect
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			<button
				{...mergeProps(buttonProps, focusProps)}
				ref={ref}
				className={`relative inline-flex cursor-default flex-row items-center justify-between overflow-hidden rounded-md border-2 p-1 py-1 pl-3 shadow-sm outline-none ${
					isFocusVisible ? 'border-pink-500' : 'border-gray-300'
				} ${state.isOpen ? 'bg-gray-100' : 'bg-white'}`}
			>
				<span
					{...valueProps}
					className={`text-md ${
						state.selectedItem ? 'text-gray-800' : 'text-gray-500'
					}`}
				>
					{state.selectedItem
						? state.selectedItem.rendered
						: 'Select an option'}
				</span>
				<ChevronUpDownIcon
					className={`h-5 w-5 ${
						isFocusVisible ? 'text-pink-500' : 'text-gray-500'
					}`}
				/>
			</button>
			{state.isOpen && (
				<Popover
					state={state}
					triggerRef={ref}
					placement="bottom start"
					className="w-52"
				>
					<ListBox {...menuProps} state={state} />
				</Popover>
			)}
		</div>
	)
}
