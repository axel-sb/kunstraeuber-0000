## SpecStory

## TypeScript Type Mismatch Error Resolution (10/30/2024, 7:58:19 AM)

_**User**_

For the code present, we get this error:

```
Type '{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; width: number | null; height: number | null; color_h: number | null; color_s: number | null; ... 4 more ...; weight: number | null; }[]' is not assignable to type '{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; date_end: number | null; date_display: string | null; place_of_origin: string | null; ... 22 more ...; tags: string | null; }[]'.
  Type '{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; width: number | null; height: number | null; color_h: number | null; color_s: number | null; ... 4 more ...; weight: number | null; }' is missing the following properties from type '{ id: number; title: string | null; artist_display: string | null; artist_title: string | null; date_end: number | null; date_display: string | null; place_of_origin: string | null; ... 22 more ...; tags: string | null; }': date_end, date_display, place_of_origin, medium_display, and 13 more.
```

How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

The error occurs because the return type of `getArtist` doesn't match the
`Artwork` type. The simplest fix is to update the `select` object in `getArtist`
to include all the required fields:

```typescript:app/routes/resources+/search-data.server.tsx
export function getArtist(q?: string | '') {
    // ... existing code ...
    return prisma.artwork.findMany({
        select: {
            id: true,
            title: true,
            artist_display: true,
            artist_title: true,
            date_end: true,
            date_display: true,
            place_of_origin: true,
            medium_display: true,
            technique_titles: true,
            description: true,
            width: true,
            height: true,
            image_url: true,
            term_titles: true,
            subject_titles: true,
            category_titles: true,
            classification_titles: true,
            provenance_text: true,
            alt_text: true,
            color_h: true,
            color_s: true,
            color_l: true,
            artwork_type_title: true,
            favorite: true,
            weight: true,
            colorHsl: true,
            style_titles: true,
            tags: true,
        },
        // ... rest of the function remains the same
    })
}
```

This adds all the fields that TypeScript expects in the `Artwork` type. Remove
any commented-out fields and ensure all required fields are included.

---

---
