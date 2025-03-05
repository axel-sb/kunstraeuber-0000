## SpecStory

## Resolving TypeScript PrismaPromise Error (10/30/2024, 7:36:19 AM)

_**User**_

For the code present, we get this error:

```
Type 'PrismaPromise<{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; date_end: number | null; date_display: string | null; place_of_origin: string | null; ... 22 more ...; tags: string | null; }[]>' is missing the following properties from type '{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; date_end: number | null; date_display: string | null; place_of_origin: string | null; ... 22 more ...; tags: string | null; }': id, title, artist_display, artist_title, and 26 more.
```

How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

The error occurs because the return types don't match. Here's the fix:

```typescript:app/routes/resources+/search-data.server.tsx
// ... existing code ...

export async function searchArtworks(searchType: string, query: string) {
    let data
    switch (searchType) {
        case 'all':
            data = await getAny(query)
            break
        case 'artist':
            data = await getArtist(query)
            break
        case 'style':
            data = await getStyle(query)
            break
        case 'type':
            data = await getType(query)
            break
        case 'place':
            data = await getPlace(query)
            break
        case 'date':
            data = await getDate(Number(query))
            break
        case 'color':
            data = await getColor(query)
            break
        case 'weight':
            data = await getMinWeight(query)
            break
        default:
            data = await getAny(query)
    }
    return data
}
```

Key changes:

1. Removed the `Artwork` type annotation since it was incorrect
2. Added `await` to resolve the Prisma promises
3. Added `break` statements to prevent fall-through in switch cases

---

---
