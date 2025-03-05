## SpecStory

## Fixing TypeScript Tooltip JSX Error (1/2/2025, 3:49:35 PM)

_**User**_

Can you help with this TS error? 'Tooltip' cannot be used as a JSX component.
Its type 'typeof Tooltip' is not a valid JSX element type. Type 'typeof Tooltip'
is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) =>
Component<any, any, any>'. Type 'Tooltip' is missing the following properties
from type 'Component<any, any, any>': context, setState, forceUpdate, render,
and 3 more.

---

_**Assistant**_

The error occurs because you're importing `Tooltip` directly from 'leaflet'
instead of 'react-leaflet'. For React components, you need to use the
React-Leaflet wrapper components. Here's how to fix it:

```typescript:app/components/markercluster.client.tsx
// ... existing code ...
import { GeoJSON, MapContainer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
// ... existing code ...
```

The key changes are:

1. Remove `Tooltip` from the Leaflet import
2. Add `Tooltip` to the react-leaflet import list

This ensures you're using the React wrapper component for Tooltip rather than
the raw Leaflet class. The rest of your code can remain unchanged since you're
already using the Tooltip component correctly in your JSX.

---

---
