This README documents the reorganized Frontend layout and how to use the new aliases.

- `src/components` — top-level components and pages. Use `import { Sidebar } from '@components'`.
- `src/components/ui` — UI primitives and design-system pieces. Use `import { Button } from '@ui/button'` or `import { Button } from '@components'`.
- `src/lib` — shared utilities and helpers.

After moving files, run:

```bash
cd Frontend
npm install
npm run fix-imports
npm run lint
npm run build
```
