## SpecStory

## Type Error Resolution in TypeScript Code (10/17/2024, 10:52:40 PM)

_**User**_

For the code present, we get this error:
```
Type 'string | { __html: string; }' is not assignable to type '{ __html: string | TrustedHTML; } | undefined'.
  Type 'string' is not assignable to type '{ __html: string | TrustedHTML; }'.
```
How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

To resolve this error, you need to ensure that the `dangerouslySetInnerHTML` prop always receives an object with the `__html` property, or `undefined`. Here's a concise fix:

```typescript:app/routes/_artworks+/artworks.details.$artworkId.tsx
// ... existing code ...
<li
  className="max-w-prose pb-4 pt-4 leading-relaxed text-foreground opacity-80"
  dangerouslySetInnerHTML={description.__html ? description : undefined}
></li>
// ... existing code ...
```

This change checks if `description.__html` exists before passing it to `dangerouslySetInnerHTML`. If it doesn't exist, it passes `undefined` instead, which satisfies the type requirement.

---



---

