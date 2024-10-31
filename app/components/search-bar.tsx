import { Form, useSearchParams, useSubmit } from '@remix-run/react'
import { useId, useState } from 'react'
import { useDebounce, useIsPending } from '#app/utils/misc.tsx'
import { Icon } from './ui/icon.tsx'
import { Input } from './ui/input.tsx'
import { Label } from './ui/label.tsx'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from './ui/select.tsx'
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
		formAction: '/artworks',
	})

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		submit(form)
	}, 400)

	const [searchType, setSearchType] = useState<
		'' | 'color' | 'style' | 'date' | 'all' | 'artist' | 'place' | 'type' | 'weight'
	>('')

	return (
		<Form
			method="GET"
			action="/artworks"
			className="animation: animate-hue; relative flex w-full items-center justify-between gap-0 bg-black/90"
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
					placeholder="Search..."
					/* placeholder={`Search ${searchType || 'all'}`} */
					className="w-full bg-secondary"
					autoFocus={autoFocus}
					autoComplete="off"
					list="artist"
				/>
			</div>
			<datalist id="artist" className="ring-8 ring-slate-950">
				<option value="Picasso"></option>
				<option value="Matisse"></option>
				<option value="Monet"></option>
				<option value="Van Gogh"></option>
				<option value="Max Ernst"></option>
				<option value="Richard Hawkins"></option>
				<option value=""></option>
				<option value=""></option>
				<option value=""></option>
				<option value=""></option>
				<option value=""></option>
				<option value=""></option>
				<option value=""></option>
			</datalist>

			<div>
				<SelectSearchType
					searchType={searchType}
					setSearchType={
						setSearchType as React.Dispatch<
							React.SetStateAction<
								| ''
								| 'color'
								| 'style'
								| 'date'
								| 'all'
								| 'artist'
								| 'place'
								| 'type'
								| 'weight'
							>
						>
					}
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
			{searchType ? (
				<div className="absolute left-0 top-12 px-3 text-sm text-muted-foreground">
					{' '}
					in:{' '}
					<span className="px-2 font-bold italic text-yellow-100">
						{' '}
						{`${searchType || 'all'}`}{' '}
					</span>
				</div>
			) : null}
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
		| 'weight'
	setSearchType: React.Dispatch<
		React.SetStateAction<
			| ''
			| 'color'
			| 'style'
			| 'date'
			| 'all'
			| 'artist'
			| 'place'
			| 'type'
			| 'weight'
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
                    | 'weight'

				setSearchType(searchType)
				if (searchType === 'color') {
					window.location.href = '/artworks/colorSearch'
				}
				const searchForm =
					document.querySelector<HTMLFormElement>('#search-form')
				const searchInput =
					document.querySelector<HTMLInputElement>('#search-input')
				if (searchForm && searchInput) {
					searchForm.action = `/artworks?searchType='color' ?? {
												window.location.href =
													'/artworks/colorSearch'
											} :
                    { ${searchType}&search=${searchInput.value}`
					searchForm.submit()
				}
			}}
		>
			<SelectTrigger className="absolute right-20 top-2 h-6 w-6 justify-between"></SelectTrigger>
			<SelectContent>
				<SelectItem value="Select...">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 text-left text-popover-foreground shadow-none"
					>
						Select ↓
					</StatusButton>
				</SelectItem>
				<SelectItem value="artist">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 text-left text-popover-foreground shadow-none"
					>
						Artist
					</StatusButton>
				</SelectItem>
				<SelectItem value="style">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 text-popover-foreground text-left shadow-none"
					>
						Style
					</StatusButton>
				</SelectItem>
				<SelectItem value="place">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						Place
					</StatusButton>
				</SelectItem>
				<SelectItem value="date">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						Date
					</StatusButton>
				</SelectItem>
				<SelectItem value="type">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						Type
					</StatusButton>
				</SelectItem>
				<SelectItem value="color">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						Color
					</StatusButton>
				</SelectItem>
				<SelectItem value="weight">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						Weight
					</StatusButton>
				</SelectItem>
				<SelectItem value="all">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="w-16text-left flex h-6 items-center justify-start border-0 text-popover-foreground shadow-none"
					>
						All
					</StatusButton>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}
