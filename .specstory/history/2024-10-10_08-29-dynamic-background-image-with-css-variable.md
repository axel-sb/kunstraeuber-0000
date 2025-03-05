## SpecStory

## Dynamic Background Image with CSS Variable (10/10/2024, 8:29:50 AM)

_**User**_

I want to define `halftoneUrl` as a css variable that will be used in
'app/routes/\_artworks+/artworks.details.artworkId.css' to insert the currently
loaded image as a background.

---

_**Assistant**_

Certainly! I'll show you how to define `halftoneUrl` as a CSS variable and use
it in your CSS file. Here are the changes you need to make:

1. First, let's update the React component to set the CSS variable:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
// ... existing imports ...

export default function ArtworkDetails() {
  const { artwork } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  // Define halftoneUrl
  const halftoneUrl = `url(${artwork.image_url})`

  // ... existing code ...

  return (
    <div
      className="details-container mx-auto max-w-prose"
      style={{ '--halftone-url': halftoneUrl } as React.CSSProperties}
    >
      {/* ... existing JSX ... */}
    </div>
  )
}

// ... rest of the file ...
```

2. Now, let's update the CSS file to use this variable:

```css:app/routes/_artworks+/artworks.details.artworkId.css
/* ... existing CSS ... */

.halftone {
  background: var(--halftone-url), var(--dots-anim);
  background-position: 50%;
  background-size: contain;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 843px;
  overflow: hidden;
  filter: sepia(0.6) brightness(1) contrast(1.1);
  background-blend-mode: overlay;
}

/* Remove or comment out this block as it's no longer needed */
/*
article {
  --img: url(https://www.artic.edu/iiif/2/c04a376f-23fc-65da-bc10-6af4b77f120a/full/843,/0/default.jpg)
    50% / contain;
}
*/

/* ... rest of the CSS ... */
```

These changes accomplish the following:

1. In the React component, we define `halftoneUrl` using the
   `artwork.image_url`.
2. We set this as a CSS custom property (variable) named `--halftone-url` on the
   root `div` of the component.
3. In the CSS file, we update the `.halftone` class to use `var(--halftone-url)`
   instead of the hardcoded `--img` property.
4. We remove the `article` block that was setting a static image URL.

Now, the background image for the halftone effect will dynamically update based
on the currently loaded artwork's image URL. This approach allows you to keep
your styles in the CSS file while still being able to dynamically set the image
based on the current artwork.

---

_**User**_

This seems fine, however now the animation has stops working as soon as the
previously hardcoded variable `--img` is replaced by the dynamic variable
`--halftone-url`.

---

_**Assistant**_

I apologize for the oversight. The issue is likely due to the change in how the
background is applied. Let's modify the CSS to ensure the animation continues to
work with the dynamic `--halftone-url`. Here's an updated version of the
relevant CSS:

```css:app/routes/_artworks+/artworks.details.artworkId.css
// ... existing code ...

section {
  display: grid;
  place-content: center;
  grid-gap: 0 0.5em;
  --dots: radial-gradient(circle, var(--dark), #fff) 0 0/6px 6px space;
  --dots-anim: linear-gradient(var(--dark1), var(--light1), var(--dark1)) 0
      calc(var(--j0) * 20vh) / 100% 20vh,
    radial-gradient(closest-side, var(--light1), var(--dark1)) 0/0.5rem 0.5rem
      space;
  --dark: #444;
  --light: #ddd;
  --dark1: #0008;
  --light1: #fff8;
  position: relative;
  animation: j0 4.6087s linear infinite;
}

.halftone {
  background-image: var(--halftone-url), var(--dots-anim);
  background-position: 50%, 0 0;
  background-size: contain, auto;
  background-repeat: no-repeat, repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 843px;
  overflow: hidden;
  filter: sepia(0.6) brightness(1) contrast(1.1);
  background-blend-mode: overlay;
}

// ... rest of the code ...
```

The key changes are:

1. We've changed `background:` to `background-image:` in the `.halftone` class.
   This allows us to specify other background properties separately.

2. We've added `background-position:`, `background-size:`, and
   `background-repeat:` properties to ensure that the halftone image and the
   animated dots are positioned and sized correctly.

3. The first value in each of these properties corresponds to the
   `--halftone-url`, while the second value corresponds to the `--dots-anim`.

These changes should allow the animation to continue working while still using
the dynamically set `--halftone-url`. The halftone image will be contained and
centered, while the animated dots will repeat and animate as before.

If you're still experiencing issues, it might be helpful to check the React
component to ensure that the `--halftone-url` is being set correctly, and that
it includes the `url()` function. Here's a reminder of how it should look in
your React component:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
// ... existing code ...

const halftoneUrl = `url(${artwork.image_url})`

return (
  <div
    className="details-container mx-auto max-w-prose"
    style={{ '--halftone-url': halftoneUrl } as React.CSSProperties}
  >
    {/* ... */}
  </div>
)

// ... rest of the code ...
```

This should resolve the animation issue while still allowing for dynamic image
loading.

---

_**User**_

Now the image isn't shown on the page anymore at all. The issue seems to be with
`--dots-anim` defined in 'artworks.details.artworkId.css#L61', for which the
browser reports: '--dots-anim is not defined'.

---

_**Assistant**_

You're right, and I apologize for the confusion. The issue is indeed with how
`--dots-anim` is being used. Let's fix this by ensuring that `--dots-anim` is
properly defined and applied. Here's the corrected version of the relevant CSS:

```css:app/routes/_artworks+/artworks.details.artworkId.css
// ... existing code ...

section {
  display: grid;
  place-content: center;
  grid-gap: 0 0.5em;
  --dots: radial-gradient(circle, var(--dark), #fff) 0 0/6px 6px space;
  --dots-anim: linear-gradient(var(--dark1), var(--light1), var(--dark1)) 0
      calc(var(--j0) * 20vh) / 100% 20vh,
    radial-gradient(closest-side, var(--light1), var(--dark1)) 0/0.5rem 0.5rem
      space;
  --dark: #444;
  --light: #ddd;
  --dark1: #0008;
  --light1: #fff8;
  position: relative;
  animation: j0 4.6087s linear infinite;
}

.halftone {
  background-image: var(--halftone-url), var(--dots);
  background-position: center, 0 0;
  background-size: contain, auto;
  background-repeat: no-repeat, repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 843px;
  overflow: hidden;
  filter: sepia(0.6) brightness(1) contrast(1.1);
  background-blend-mode: overlay;
}

.halftone::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--dots-anim);
  background-position: 0 0;
  background-size: auto;
  background-repeat: repeat;
  animation: j0 4.6087s linear infinite;
}

// ... rest of the code ...
```

Here's what we've changed:

1. In the `.halftone` class, we've replaced `var(--dots-anim)` with
   `var(--dots)`. This provides the static dot pattern.

2. We've added a new pseudo-element `.halftone::before` that applies the
   animated dots. This separates the static background image from the animated
   overlay.

3. The `animation` property has been moved from the `section` to the
   `.halftone::before` pseudo-element, as this is where the animation actually
   needs to occur.

These changes should resolve the issue with `--dots-anim` not being defined, and
should restore both the image display and the animation effect.

Make sure that in your React component, you're still setting the
`--halftone-url` correctly:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
// ... existing code ...

const halftoneUrl = `url(${artwork.image_url})`

return (
  <div
    className="details-container mx-auto max-w-prose"
    style={{ '--halftone-url': halftoneUrl } as React.CSSProperties}
  >
    {/* ... */}
  </div>
)

// ... rest of the code ...
```

This setup should now correctly display the dynamically loaded image with the
halftone effect and animation working as intended.

---

_**User**_

It wasn't working like that, but I eventually found what caused the problem: The
variable definition in React must include the position and size values
(`const halftoneUrl = `url(${artwork.image_url})50%/contain`). Otherwise, if included as separate properties in the stylesheet, they also affect `--dots-anim`
and that breaks the animation. Thank you for your help!

---

_**Assistant**_

Thank you for sharing your solution! I apologize for missing that crucial
detail. You're absolutely right, and I'm glad you found the root cause. Let's
update the code to reflect this correct implementation:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
// ... existing code ...

export default function ArtworkDetails() {
  const { artwork } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  // Define halftoneUrl with position and size
  const halftoneUrl = `url(${artwork.image_url})50%/contain`

  return (
    <div
      className="details-container mx-auto max-w-prose"
      style={{ '--halftone-url': halftoneUrl } as React.CSSProperties}
    >
      {/* ... existing JSX ... */}
    </div>
  )
}

// ... rest of the file ...
```

And in the CSS file, we can simplify the `.halftone` class:

```css:app/routes/_artworks+/artworks.details.artworkId.css
.halftone {
  background: var(--halftone-url), var(--dots-anim);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 843px;
  overflow: hidden;
  filter: sepia(0.6) brightness(1) contrast(1.1);
  background-blend-mode: overlay;
}

// ... rest of the code ...
```

This approach keeps the position and size information with the image URL,
preventing it from affecting the `--dots-anim`. It's an excellent catch, and
it's a great reminder of how CSS variables and background properties can
interact in sometimes unexpected ways.

Thank you for sharing this insight. It will definitely help others who might
encounter similar issues in the future!

---

_**User**_

I would like to replace Ln8 and Ln 12 with code that will dynamically insert
`artwork.title` and `artwork.image_url` from the loader.

---

_**Assistant**_

Certainly! To dynamically insert `artwork.title` and `artwork.image_url` from
the loader, we'll need to modify the React component. Here's how you can update
your component to achieve this:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

// Assuming you have a loader function that fetches the artwork data
export const loader: LoaderFunction = async ({ params }) => {
  // Fetch artwork data based on params.artworkId
  // Return the artwork data
};

export default function ArtworkDetails() {
  const { artwork } = useLoaderData<typeof loader>();

  const halftoneUrl = `url(${artwork.image_url})50%/contain`;

  return (
    <div
      className="details-container mx-auto max-w-prose"
      style={{ '--halftone-url': halftoneUrl } as React.CSSProperties}
    >
      <section className="halftone">
        <div className="title-container">
          <h1>{artwork.title}</h1>
        </div>
      </section>
      {/* Rest of your component */}
    </div>
  );
}
```

This code does the following:

1. We use the `useLoaderData` hook to access the data returned by the loader
   function.
2. We create the `halftoneUrl` using the `artwork.image_url` from the loader
   data.
3. We set the `--halftone-url` CSS variable in the style prop of the container
   div.
4. We use `{artwork.title}` to dynamically insert the artwork title in the
   `<h1>` tag.

With these changes, both the image URL and the title will be dynamically
inserted based on the data fetched in the loader function. Make sure your loader
function is correctly fetching and returning the artwork data with `title` and
`image_url` properties.

---

_**User**_

Alternatively, would it make sense to change `halftone.tsx` Ln8 and Ln 12
instead, keeping the code in this (separate) component file which is then
imported by 'artworks.details.$artworkId.tsx'?

---

_**Assistant**_

Yes, it would make sense to modify the `Halftone` component in `halftone.tsx` to
accept props for the title and image URL. This approach keeps the `Halftone`
component reusable and allows you to pass the dynamic data from the parent
component. Here's how you can modify `halftone.tsx`:

```typescript:app/components/halftone.tsx
interface HalftoneProps {
  title: string;
  imageUrl: string;
}

export function Halftone({ title, imageUrl }: HalftoneProps) {
  return (
    <article>
      <section>
        <div className="halftone">
          <span className="title-container">
            <h1 className="title text-balance text-center">
              {title}
            </h1>
          </span>
          {/* This image is only included as a helper for the parent container to calculate the size of the halftone component, since the image is otherwise only included as a background url CSS variable which does not claim any space */}
          <img src={imageUrl} alt={title} />
        </div>
      </section>
    </article>
  )
}
```

Then, in your `artworks.details.$artworkId.tsx` file, you can use the `Halftone`
component like this:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
import { Halftone } from '#app/components/halftone.tsx'

// ... other imports and code ...

export default function ArtworkDetails() {
  const { artwork } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const colorHsl = `hsl(${artwork.color_h}, ${artwork.color_s}%, 50%)`

  // Define halftoneUrl
  const halftoneUrl = `url(${artwork.image_url}) no-repeat 50%/contain`

  // ... other code ...

  return (
    <div
      className="details-container mx-auto max-w-prose"
      style={{ '--halftone-url': halftoneUrl, '--colorHsl': colorHsl } as React.CSSProperties}
    >
      {/* Pass the title and image URL as props to the Halftone component */}
      <Halftone title={artwork.title} imageUrl={artwork.image_url} />

      {/* ... rest of your component ... */}
    </div>
  )
}
```

This approach has several benefits:

1. It keeps the `Halftone` component reusable and flexible.
2. It allows you to pass dynamic data from the parent component.
3. It maintains a clear separation of concerns, with the parent component
   handling data fetching and the `Halftone` component focusing on rendering.
4. It makes it easier to test and maintain both components independently.

Remember to update any other places where you're using the `Halftone` component
to pass these new props.

---

---
