# Component Architecture Boundary

## Goal
Keep UI code modular and predictable by separating domain-specific feature components from shared generic components.

## Directory Rules
- `src/components/features/*`
  - Domain modules only (orders, products, team, marketing, stores).
  - Contains business-oriented UI blocks used by pages.
  - Can depend on `src/components/common`, `src/components/ui`, hooks, utils, and types.
- `src/components/common/*`
  - Reusable app-level primitives with light behavior (tables, bulk actions, dialogs).
  - Must stay domain-agnostic.
- `src/components/ui/*`
  - Styling primitives only (Button, Input, Card, Badge, Modal, etc.).
  - No business logic.
- `src/components/<legacy-domain>/*` (for example `categories`, `products`, `stock`, `marketing`)
  - Treated as migration sources only.
  - Do not add new features here.
  - Move active usage to `src/components/features/*` and delete after verification.

## Migration Rules
1. Add/keep canonical component in `src/components/features/<domain>`.
2. Update imports in pages/components to canonical path.
3. Run `npm run check:routes`, `npm run check:route-guards`, and `npm run build`.
4. Delete legacy duplicate file only when no references remain.

## Import Conventions
- Prefer barrel imports for feature modules:
  - `import { ProductsList } from '../../components/features/products';`
- Do not import from a legacy folder if the same responsibility exists under `features/*`.
- Keep one canonical export path per component to avoid divergence.

## Ownership
- Route pages in `src/pages/*` orchestrate data + feature composition.
- Feature components render behavior for one domain concern.
- Common/UI components should not know role, permission, or route context.
