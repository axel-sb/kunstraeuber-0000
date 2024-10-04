import { Form, useSearchParams, useSubmit } from '@remix-run/react'
import { useId, useState } from 'react'
import { useDebounce, useIsPending } from '#app/utils/misc.tsx'
import { Icon } from './ui/icon.tsx'
import { Input } from './ui/input.tsx'
import { Label } from './ui/label.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx'
import { StatusButton } from './ui/status-button.tsx'

export function SearchBar({
	status,
	autoFocus = false,
	autoSubmit = false,
}: {
	status: 'idle' | 'pending' | 'success' | 'error'
	autoFocus?: boolean
	autoSubmit?: boolean
}) {
	const id = useId()
	const [searchParams] = useSearchParams()
	const submit = useSubmit()
	const isSubmitting = useIsPending({
		formMethod: 'GET',
		formAction: '/users',
	})

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		submit(form)
	}, 400)

	const [searchType, setSearchType] = useState<
		'' | 'color' | 'style' | 'date' | 'all' | 'artist' | 'place' | 'type'
	>('')

	return (
		<Form
			method="GET"
			action="/artworks"
			className="flex flex-wrap items-center justify-center gap-2"
			onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
		>
			<div className="flex-1">
				<Label htmlFor={id} className="sr-only">
					Search
				</Label>
				<Input
					type="search"
					name="search"
					id={id}
					defaultValue={searchParams.get('search') ?? ''}
					placeholder={`Search ${searchType || 'all'}`}
					className="w-full"
					autoFocus={autoFocus}
				/>
			</div>
			<div>
				<SelectSearchType
					searchType={searchType}
					setSearchType={setSearchType}
					/>
			</div>
			<div>
				<StatusButton
					type="submit"
					status={isSubmitting ? 'pending' : status}
					className="flex w-full items-center justify-center"
				>
					<Icon name="magnifying-glass" size="md" />
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</Form>
	)
}

interface SelectSearchTypeProps {
	searchType:
		| ''
		| 'color'
		| 'style'
		| 'date'
		| 'all'
		| 'artist'
		| 'place'
		| 'type'
	setSearchType: React.Dispatch<
		React.SetStateAction<
			'' | 'color' | 'style' | 'date' | 'all' | 'artist' | 'place' | 'type'
		>
	>
}

function SelectSearchType({
	searchType,
	setSearchType,
}: SelectSearchTypeProps) {
	const isPending = useIsPending({ formMethod: 'GET', formAction: '/artworks' })
	return (
		<Select
			name="searchType"
			required={true}
			value={searchType}
			onValueChange={(value) => {
				const searchType = value as
					| 'all'
					| 'artist'
					| 'style'
					| 'place'
					| 'date'
					| 'type'
					| 'color'

				setSearchType(searchType)
				const searchForm =
					document.querySelector<HTMLFormElement>('#search-form')
				const searchInput =
					document.querySelector<HTMLInputElement>('#search-input')
				if (searchForm && searchInput) {
					searchForm.action = `/artworks?searchType=${searchType}&search=${searchInput.value}`
					searchForm.submit()
				}
			}}
		>
			<SelectTrigger className="h-6 w-24 justify-between border-0">
				<SelectValue placeholder={searchType ? `${searchType}` : ''} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="artist">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Artist
					</StatusButton>
				</SelectItem>
				<SelectItem value="style">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Style
					</StatusButton>
				</SelectItem>
				<SelectItem value="place">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 pl-4 pr-2 shadow-none"
					>
						Place
					</StatusButton>
				</SelectItem>
				<SelectItem value="date">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 pl-4 pr-2 shadow-none"
					>
						Date
					</StatusButton>
				</SelectItem>
				<SelectItem value="type">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 pl-4 pr-2 shadow-none"
					>
						Type
					</StatusButton>
				</SelectItem>
				<SelectItem value="color">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 pl-4 pr-2 shadow-none"
					>
						Color
					</StatusButton>
				</SelectItem>
				<SelectItem value="all">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 pl-4 pr-2 shadow-none"
					>
						All
					</StatusButton>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}
