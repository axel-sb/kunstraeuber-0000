## SpecStory

## Certainly! I'll guide you through the process of transferring the select component from `root.tsx` to `search-bar.tsx` and integrating it into the search bar. Here are the steps and code changes:

1. **Modify the `SearchBar` Component in `search-bar.tsx`:**

   First, we will update the `SearchBar` component to include the select
   functionality for search types.

```typescript:app/components/search-bar.tsx
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
  SelectValue,
} from './ui/select.tsx'
import { StatusButton } from './ui/status-button.tsx'
import {
  getAny,
  getArtist,
  getStyle,
  getType,
  getPlace,
  getColor,
  getDate,
} from '#app/routes/resources+/search-data.server.js'

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

  const [searchType, setSearchType] = useState<string>('all')

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
          placeholder={`Search ${searchType}`}
          className="w-full"
          autoFocus={autoFocus}
        />
      </div>
      <div>
        <Select
          name="searchType"
          required={true}
          value={searchType}
          onValueChange={(value) => {
            setSearchType(value)
            const searchForm = document.querySelector<HTMLFormElement>('form')
            const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]')
            if (searchForm && searchInput) {
              searchForm.action = `/artworks?searchType=${value}&search=${searchInput.value}`
              searchForm.submit()
            }
          }}
        >
          <SelectTrigger className="h-6 w-24 justify-between border-0">
            <SelectValue placeholder={searchType} />
          </SelectTrigger>
          <SelectContent>
            {['all', 'artist', 'style', 'place', 'date', 'type', 'color'].map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
```

2. **Remove the Select Component from `root.tsx`:**

   Since we have moved the select functionality to `search-bar.tsx`, you can
   remove the select component from `root.tsx`. Ensure that you also remove any
   related imports.

3. **Update the Loader in `root.tsx`:**

   Ensure that the loader in `root.tsx` is set up to handle the search type and
   query parameters correctly. You may already have this set up, but here’s a
   reminder of how it should look:

```typescript:app/root.tsx
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { searchArtworks } from './routes/resources+/search-data.server.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get('search') ?? ''
  const searchType = url.searchParams.get('searchType') ?? 'all'

  const data = await searchArtworks(searchType, query)

  return json({ data })
}
```

4. **Update the Search Functions in `search-data.server.tsx`:**

   Ensure that your search functions in `search-data.server.tsx` can handle the
   different search types based on the selected option. You may already have
   this, but here’s a reminder:

```typescript:app/routes/resources+/search-data.server.tsx
export async function searchArtworks(searchType: string, query: string) {
  switch (searchType) {
    case 'all':
      return getAny(query)
    case 'artist':
      return getArtist(query)
    case 'style':
      return getStyle(query)
    case 'type':
      return getType(query)
    case 'place':
      return getPlace(query)
    case 'date':
      return getDate(Number(query))
    case 'color':
      return getColor(query)
    default:
      return getAny(query)
  }
}
```

### Summary

With these changes, the select component for search types is now integrated into
the `SearchBar` component. The selected search type will be added as a URL
parameter, and the database will be searched with the related query defined in
`search-data.server.tsx`.

Make sure to test the functionality to ensure everything works as expected after
the changes. If you have any further questions or need additional modifications,
feel free to ask! (10/4/2024, 12:59:59 PM)

_**User**_

This project uses the 'Remix' full stack React framework. I want to transfer the
(HTML) select component defined in 'root.tsx' from 'root.tsx' to
'search-bar.tsx'. In 'search-bar.tsx' the select feature should be intergrated
into the search bar. An additional button should be added to the search bar.
This button should open the defined options. The select options are different
search types. The selected search type will be added as a url param. The databse
will then be serched with the related query defined in
'search-data.server.tsx'.@select.tsx @search-bar.tsx @root.tsx
@search-data.server.tsx

---

_**Assistant**_

Certainly! I'll guide you through the process of transferring the select
component from `root.tsx` to `search-bar.tsx` and integrating it into the search
bar. Here are the steps and code changes:

1. First, let's modify the `SearchBar` component in `search-bar.tsx`:

```typescript:app/components/search-bar.tsx
// ... existing imports
import { Button } from './ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.tsx'

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

// ... rest of the file
```

2. Now, let's add the `SelectSearchType` component to `search-bar.tsx`:

```typescript:app/components/search-bar.tsx
// ... existing code

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
        const searchForm = document.querySelector<HTMLFormElement>('form')
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]')
        if (searchForm && searchInput) {
          searchForm.action = `/artworks?searchType=${searchType}&search=${searchInput.value}`
          searchForm.submit()
        }
      }}
    >
      <SelectTrigger className="h-6 w-24 justify-between border-0">
        <SelectValue placeholder={searchType ? `${searchType}` : 'All'} />
      </SelectTrigger>
      <SelectContent>
        {['all', 'artist', 'style', 'place', 'date', 'type', 'color'].map((type) => (
          <SelectItem key={type} value={type}>
            <StatusButton
              type="submit"
              status={isPending ? 'pending' : 'idle'}
              className="flex h-6 w-16 items-center justify-start border-0 pl-4 pr-2 text-left shadow-none"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </StatusButton>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

3. Remove the `SelectSearchType` component from `root.tsx`.

4. Update the `search-data.server.tsx` file to handle the different search
   types:

```typescript:app/routes/resources+/search-data.server.tsx
// ... existing imports and functions

export async function searchArtworks(searchType: string, query: string) {
  switch (searchType) {
    case 'all':
      return getAny(query)
    case 'artist':
      return getArtist(query)
    case 'style':
      return getStyle(query)
    case 'type':
      return getType(query)
    case 'place':
      return getPlace(query)
    case 'date':
      return getDate(Number(query))
    case 'color':
      return getColor(query)
    default:
      return getAny(query)
  }
}
```

5. Update the loader in `root.tsx` to use the new `searchArtworks` function:

```typescript:app/root.tsx
// ... existing imports
import { searchArtworks } from './routes/resources+/search-data.server.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
  // ... existing code

  const url = new URL(request.url)
  const query = url.searchParams.get('search') ?? undefined
  const searchType = url.searchParams.get('searchType') ?? 'all'

  const data = await searchArtworks(searchType, query ?? '')

  // ... rest of the loader function
}
```

These changes will integrate the select component into the search bar in
`search-bar.tsx`. The selected search type will be added as a URL parameter, and
the database will be searched with the related query defined in
`search-data.server.tsx`.

Remember to update any imports or component usage in other files if necessary.
This solution maintains the functionality of the select component while moving
it to the `SearchBar` component for better organization and reusability.

---

---
