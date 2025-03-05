import { type LoaderFunctionArgs } from 'react-router'
import { searchSuggestions } from '#app/routes/resources+/search-data.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const q = url.searchParams.get('q') ?? ''
	const searchType = url.searchParams.get('searchType') ?? ''
	console.log('[autocomplete log] searchSuggestions params (q, searchType):', {
		q,
		searchType,
	})
	const suggestions = await searchSuggestions(q, searchType)
	return { suggestions }
}
