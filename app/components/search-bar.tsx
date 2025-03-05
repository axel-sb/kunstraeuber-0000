import { useId, useState } from 'react'
import { Form, NavLink, useSearchParams, useSubmit } from 'react-router'
import { useDebounce, useIsPending } from '#app/utils/misc.tsx'
import { Icon } from './ui/icon.tsx'
import { Input } from './ui/input.tsx'
import { Label } from './ui/label.tsx'
// import SearchComboBox from './search-combobox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
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
		formAction: '/users',
	})

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		void submit(form)
	}, 400)

	const [searchType, setSearchType] = useState<
		| ''
		| 'all'
		| 'artist'
		| 'color'
		| 'date'
		| 'place'
		| 'style'
		| 'type'
		| 'subject'
		| 'tags'
		| 'technique'
	>('')

	return (
		<Form
			method="GET"
			action="/artworks"
			className="flex flex-wrap items-center justify-center"
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
					className="w-full border-r-0"
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
		| 'all'
		| 'artist'
		| 'color'
		| 'date'
		| 'place'
		| 'style'
		| 'type'
		| 'subject'
		| 'tags'
		| 'technique'

	setSearchType: React.Dispatch<
		React.SetStateAction<
			| ''
			| 'all'
			| 'artist'
			| 'color'
			| 'date'
			| 'place'
			| 'style'
			| 'type'
			| 'subject'
			| 'tags'
			| 'technique'
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
					| ''
					| 'all'
					| 'artist'
					| 'color'
					| 'date'
					| 'place'
					| 'style'
					| 'subject'
					| 'tags'
					| 'technique'
					| 'type'

				setSearchType(searchType)
				const searchForm =
					document.querySelector<HTMLFormElement>('#search-form')
				const searchInput =
					document.querySelector<HTMLInputElement>('#search-input')
				if (searchForm && searchInput) {
					searchForm.action = `/artworks?searchType='color' ?? {
          navigate("/artworks/colorSearch")
											} :
                    { ${searchType}&search=${searchInput.value}`
					searchForm.submit()
				}
			}}
		>
			<SelectTrigger className="h-10 w-24 justify-between border-0">
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
						Tags
					</StatusButton>
				</SelectItem>
				<SelectItem value="medium">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Medium
					</StatusButton>
				</SelectItem>

				<SelectItem value="technique">
					<StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Technique
					</StatusButton>
				</SelectItem>

				<SelectItem value="color">
					{/* <StatusButton
						type="submit"
						status={isPending ? 'pending' : 'idle'}
						className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
					>
						Color
					</StatusButton> */}
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

/* const searchInput =
          document.querySelector<HTMLInputElement>('#search-input')
        if (searchForm && searchInput) {
          searchForm.action = `/artworks?searchType='color' ?? {
                        window.location.href =
                          '/artworks/colorSearch'
                      } :
                    { ${searchType}&search=${searchInput.value}`
          searchForm.submit()
        }
      } */
