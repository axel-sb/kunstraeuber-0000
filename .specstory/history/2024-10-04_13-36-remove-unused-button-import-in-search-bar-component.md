## SpecStory

## Remove Unused Button Import in Search Bar Component (10/4/2024, 1:36:12 PM)

_**User**_

For the code present, we get this error:

```
'Button' is declared but its value is never read.
```

How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

To resolve the error "Button is declared but its value is never read," you need
to either use the `Button` component in your code or remove the import if it's
not needed. Since the code snippet doesn't show the full component, I'll assume
you're not using `Button` in this file.

Here's a concise fix:

```typescript:app/components/search-bar.tsx
import { Label } from './ui/label.tsx'
import {
	Select,
```

This change simply removes the unused import for `Button`. If you need `Button`
later in your component, keep the import and make sure to use it in your JSX.

---

---
