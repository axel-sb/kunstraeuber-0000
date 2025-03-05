import { useEffect, useId, useState } from 'react'
import {
	ComboBox,
	Input,
	Button,
	Popover,
	ListBox,
	ListBoxItem,
	Label,
	type Key,
} from 'react-aria-components'
import {
	Form,
	NavLink,
	useFetcher,
	useLocation,
	// useSearchParams,
	useSubmit,
} from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useIsPending } from '#app/utils/misc.tsx'

type FetcherData = {
	suggestions: {
		suggestionItem: string | null
	}[]
}

interface suggestionItemOption {
	id: string
	suggestionItem: string | null
}

export function Combobox({
	status,
}: {
	status: 'idle' | 'pending' | 'success' | 'error'
}) {
	const fetcher = useFetcher<FetcherData>()
	const [inputValue, setInputValue] = useState('Picasso')
	const id = useId()
	const [options, setOptions] = useState<suggestionItemOption[]>([])
	const [selectedKey, setSelectedKey] = useState<Key | null>(null)
	const location = useLocation()
	const isSubmitting = useIsPending({
		formMethod: 'GET',
		formAction: location.pathname === '/' ? '/artworks' : '/artworks/cluster',
	})

	type SearchType =
		| 'all'
		| 'artist'
		| 'color'
		| 'date'
		| 'place'
		| 'style'
		| 'subject'
		| 'tags'
		| 'technique'
		| 'term'
		| 'type'

	const [searchType, setSearchType] = useState<SearchType>('artist')

	/* let suggestionItem = 'artist_title'

	switch (searchType) {
		case 'all':
			suggestionItem = 'artist_title'
			break
		case 'artist':
			suggestionItem = 'artist_title'
			break
		case 'style':
			suggestionItem = 'style_titles'
			break
		case 'subject':
			suggestionItem = 'subject_titles'
			break
		case 'tags':
			suggestionItem = 'tags'
			break
		case 'term':
			suggestionItem = 'term_titles'
			break
		case 'technique':
			suggestionItem = 'technique_titles'
			break
		case 'type':
			suggestionItem = 'artwork_type_title'
			break
		case 'place':
			suggestionItem = 'place_of_origin'
			break
		case 'date':
			suggestionItem = 'date_end'
			break
		default:
			suggestionItem = 'artist_title'
	} */

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		console.log('Input value changed to:', value)
		setInputValue(value)
		setSelectedKey(null) // Reset selected key when input changes
	}

	// Handle selection change
	const handleSelectionChange = (key: Key | null) => {
		console.log('Selection changed to:', key)
		setSelectedKey(key)
		const keyString = key !== null ? String(key) : null
		const selectedOption = options.find((option) => option.id === keyString)
		if (selectedOption) {
			setInputValue(selectedOption.suggestionItem || '')
		}
	}

	// Fetch data when inputValue changes
	useEffect(() => {
		if (inputValue.trim() && selectedKey === null) {
			console.log('Fetching data for query:', inputValue)
			void fetcher.load(
				`../resources/autocomplete?q=${encodeURIComponent(
					inputValue,
				)}&searchType=${encodeURIComponent(searchType)}`,
			)
		} else {
			setOptions([])
		}
		// Disable the ESLint warning for this line
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue, selectedKey])

	// Update options when fetcher data changes
	useEffect(() => {
		if (fetcher.data && fetcher.data.suggestions) {
			console.log('Fetcher data received:', fetcher.data)

			const updatedOptions = fetcher.data.suggestions.map((item, index) => {
				const suggestionItem = Object.values(item)[0]
				return {
					suggestionItem:
						suggestionItem == null ? null : suggestionItem.toString(), // Ensure it's either null or a string
					id: index.toString(),
				}
			})

			console.log('Updated options:', updatedOptions)
			setOptions(updatedOptions)
		} else {
			setOptions([])
		}
	}, [fetcher.data])

	// const [searchParams] = useSearchParams()
	const submit = useSubmit()

	useEffect(() => {
		const searchField = document.getElementById('q')
		if (searchField instanceof HTMLInputElement) {
			searchField.value = inputValue || ''
		}
	}, [inputValue])

	return (
		<Form
			method="GET"
			action={location.pathname === '/' ? '/artworks' : '/artworks/cluster'}
			onSubmit={(e) => submit(e.currentTarget)}
			className="flex flex-wrap items-end justify-center"
		>
			<div className="mr-2">
				<div className="relative max-w-sm p-2 text-left opacity-60">
					Search Type
				</div>
				<SelectSearchType
					searchType={searchType}
					setSearchType={setSearchType}
				/>
			</div>

			<ComboBox
				aria-label="Search Types"
				selectedKey={selectedKey}
				onSelectionChange={handleSelectionChange}
			>
				<Label className="inline-block py-2 opacity-60">
					{/* Search{' '} */}
					<span className="relative ml-0 rounded-sm p-0.5 px-1 pr-1.5 ring-offset-white transition-colors after:absolute after:inset-0 after:z-[-1] after:inline-block after:w-full after:rotate-[-2deg] after:-skew-y-2 after:transform after:rounded-md after:bg-secondary after:p-1 after:shadow-md after:transition-transform after:delay-100 after:duration-300 hover:bg-neutral-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2">
						{' '}
						{'Search Term'}
					</span>
				</Label>
				<div className="relative max-w-md">
					<Input
						id={id}
						name="search"
						size={15}
						className="combobox-input h-10 w-full min-w-24 rounded rounded-br-none rounded-tr-none border border-r-0 px-3 py-2"
						placeholder="..."
						value={inputValue}
						onChange={handleInputChange}
						// defaultValue={searchParams.get('search') ?? ''}
					/>
					<Button className="absolute inset-y-0 right-0 flex items-center px-3">
						⯆{' '}
					</Button>
				</div>
				<Popover className="absolute z-[50000] mt-1 max-w-sm shadow-lg">
					<ListBox items={options}>
						{(item) => (
							<ListBoxItem key={item.id} textValue={item.suggestionItem ?? ''}>
								{item.suggestionItem}
							</ListBoxItem>
						)}
					</ListBox>
				</Popover>
			</ComboBox>
			<div>
				<div className="relative max-w-sm p-2"></div>
				<StatusButton
					type="submit" /* submit */
					status={isSubmitting ? 'pending' : status}
					className="submit animate-hue flex w-10 items-center justify-center rounded-none border-l-0 bg-black px-0"
				>
					<Icon name="magnifying-glass" size="md" className="animate-hue" />
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</Form>
	)
}

interface SelectSearchTypeProps {
	searchType:
		| 'all'
		| 'artist'
		| 'color'
		| 'date'
		| 'place'
		| 'style'
		| 'subject'
		| 'tags'
		| 'technique'
		| 'term'
		| 'type'

	setSearchType: React.Dispatch<
		React.SetStateAction<
			| 'all'
			| 'artist'
			| 'color'
			| 'date'
			| 'place'
			| 'style'
			| 'subject'
			| 'tags'
			| 'technique'
			| 'term'
			| 'type'
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
					| 'color'
					| 'date'
					| 'place'
					| 'style'
					| 'subject'
					| 'tags'
					| 'technique'
					| 'term'
					| 'type'

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
			<SelectTrigger className="h-10 min-w-32 justify-between border-0 pr-0">
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
						className="flex h-6 w-12 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Style
					</StatusButton>
				</SelectItem>

				<SelectItem value="place">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Place
					</StatusButton>
				</SelectItem>

				<SelectItem value="date">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Date
					</StatusButton>
				</SelectItem>

				<SelectItem value="type">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Type
					</StatusButton>
				</SelectItem>

				<SelectItem value="subject">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Subject
					</StatusButton>
				</SelectItem>

				<SelectItem value="tags">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Tag
					</StatusButton>
				</SelectItem>

				<SelectItem value="term">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Term
					</StatusButton>
				</SelectItem>

				<SelectItem value="technique">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-full items-center justify-start border-0 text-left shadow-none"
					>
						Technique
					</StatusButton>
				</SelectItem>

				<SelectItem value="color">
					<NavLink
						className={({ isActive, isPending }) =>
							isActive
								? 'active flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none'
								: isPending
									? 'pending'
									: '' +
										'flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left text-foreground shadow-none'
						}
						to="/artworks/colorSearch"
					>
						Color
					</NavLink>
				</SelectItem>

				<SelectItem value="all">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						All
					</StatusButton>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}
