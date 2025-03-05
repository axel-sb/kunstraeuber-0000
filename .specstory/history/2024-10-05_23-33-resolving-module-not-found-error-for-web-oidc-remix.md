## SpecStory

## Resolving Module Not Found Error for web-oidc/remix (10/5/2024, 11:33:02 PM)

_**User**_

For the code present, we get this error:

```
Cannot find module 'web-oidc/remix' or its corresponding type declarations.
```

How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

To resolve the error "Cannot find module 'web-oidc/remix' or its corresponding
type declarations," it seems that the `web-oidc` package is not installed or is
missing the Remix-specific module. Here's a concise fix:

1. Install the package:

```bash
npm install web-oidc
```

2. If the error persists, check if there's a specific Remix integration for
   web-oidc. If not, you might need to adjust the import statement.

Here's the potential code change:

```typescript:app/utils/providers/google.server.ts
import { OIDCStrategy } from 'web-oidc'
// ... rest of the imports remain the same
```

If this doesn't resolve the issue, please provide more information about the
`web-oidc` package you're trying to use, as it might not have a specific Remix
integration or might require a different import path.

---

---
