## SpecStory

## Resolving TypeScript ESLint Parsing Error (11/28/2024, 11:39:36 AM)

_**User**_

For the code present, we get this error:

```
Parsing error: Too many files (>8) have matched the default project.

Having many files run with the default project is known to cause performance issues and slow down linting.

See https://typescript-eslint.io/troubleshooting/#allowdefaultproject-glob-too-wide

Matching files:
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox.1.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox-copilot.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox-others/search-bar-combobox.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox-others/artworks.lala.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox2.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/command.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox-others/command.tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/app/routes/_artworks+/artworks.comboboxSearch-(lang).tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/.local.notes/archive/combobox-others/artworks.comboboxSearch-(lang).tsx
- /Volumes/Samsung/_Projects-on-Samsung/Remix/kunstraeuber2/app/components/search-combobox.tsx

If you absolutely need more files included, set parserOptions.projectService.maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING to a larger value.
```

How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

To resolve the "Too many files" error in your TypeScript project, you can
specify a more targeted `tsconfig.json` file for your ESLint configuration. This
will limit the files that ESLint processes, improving performance and avoiding
the error.

Here’s how to do it:

1. **Create a `tsconfig.eslint.json` file** in your project root (or wherever
   appropriate) with the following content:

```json
{
	"extends": "./tsconfig.json",
	"include": [
		"app/routes/_artworks+/**/*.ts",
		"app/routes/_artworks+/**/*.tsx",
		"app/components/**/*.ts",
		"app/components/**/*.tsx"
	]
}
```

2. **Update your ESLint configuration** (usually `.eslintrc.js` or
   `.eslintrc.json`) to use this new `tsconfig.eslint.json`:

```javascript
module.exports = {
	// ... existing config ...
	parserOptions: {
		project: './tsconfig.eslint.json',
	},
	// ... existing config ...
}
```

This setup will limit the files ESLint checks to only those specified in the
`include` array, thus avoiding the performance issues caused by too many files
being matched.

### Summary of Changes:

- Created a new `tsconfig.eslint.json` to specify which files to include.
- Updated ESLint configuration to use this new TypeScript config.

This should resolve the parsing error while maintaining efficient linting
performance.

---

---
