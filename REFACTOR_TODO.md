# Admin Dashboard Refactor TODO

Last updated: 2026-03-05

Safe change rule for every cleanup task:
- [ ] Replace or refactor first.
- [ ] Verify behavior (manual + build/lint/tests).
- [ ] Remove old/duplicate code only after verification.

## Audit Progress
- [x] Project structure scanned (`src/components`, `src/pages`, routing, feature folders).
- [x] Duplicate/iteration artifacts identified (`*New.tsx`, `*.backup`, repeated route paths).
- [x] Potential orphan files identified (files referenced only in their own definition).
- [x] Install dependencies and run baseline quality checks (`npm ci`, `npm run build`, `npm run lint`) - dependencies installed and baseline captured; lint has pre-existing repo-wide issues.

## Phase 1 - Routing De-duplication (High Priority)
- [x] Refactor duplicate route declarations in `src/App.tsx` so each path is declared once with the correct guard.
- [x] Resolve repeated `hub/reports` and `store/reports` routes in `src/App.tsx`.
- [x] Resolve repeated store route blocks (`store/orders/manual`, `store/settings/*`, `store/products/*`, `store/reports/*`) in `src/App.tsx`.
- [x] Add route tests or a route-map assertion to prevent duplicate path regressions (`npm run check:routes`).
- [x] Verify navigation and guard behavior for hub/store roles after route cleanup (static assertions via `npm run check:routes` and `npm run check:route-guards`; manual UI smoke remains in Phase 6).

## Phase 2 - Marketing Iteration Cleanup (High Priority)
- [x] Confirm canonical marketing pages and keep only one version per feature:
  `src/pages/marketing/CouponPage.tsx`
  `src/pages/marketing/OfferNotificationPage.tsx`
  `src/pages/marketing/ScratchCardPage.tsx`
  `src/pages/marketing/SpinWheelPage.tsx`
- [x] Migrate any missing logic from `*New` pages before deletion (no active references found; removed unused variants):
  `src/pages/marketing/CouponPageNew.tsx`
  `src/pages/marketing/OfferNotificationPageNew.tsx`
  `src/pages/marketing/ScratchCardPageNew.tsx`
  `src/pages/marketing/SpinWheelPageNew.tsx`
- [x] Consolidate `MarketingList` into one reusable component and update all imports:
  `src/components/marketing/MarketingList.tsx`
  `src/components/features/marketing/MarketingList.tsx`
- [x] Remove backup artifacts after replacement verification:
  `src/components/marketing/FlashSaleConfig.tsx.backup`
  `src/components/stock/StockBatchList.tsx.backup`

## Phase 3 - Legacy vs Feature Component Consolidation
- [x] Define target architecture boundaries for `src/components/*` vs `src/components/features/*` (documented in `docs/COMPONENT_ARCHITECTURE.md`).
- [x] Consolidate overlapping product/category listing logic:
  `src/components/categories/CategoryList.tsx`
  `src/components/features/products/CategoriesList.tsx`
  `src/components/products/ProductList.tsx`
  `src/components/features/products/ProductsList.tsx`
- [x] Consolidate stock list/bulk action patterns:
  `src/components/stock/StockBatchList.tsx`
  `src/components/features/products/StocksList.tsx`
- [x] Keep only one export path for shared feature components (barrel files + direct imports cleanup).

## Phase 4 - Orphan and Unused File Review
- [x] Validate usage and either wire in or remove unused labeling pages:
  `src/pages/labeling/BillTemplatePage.tsx`
  `src/pages/labeling/DeliverySlipPage.tsx`
  `src/pages/labeling/LabelingIndexPage.tsx`
  `src/pages/labeling/PackingSlipPage.tsx`
- [x] Validate usage and either wire in or remove likely orphan pages:
  `src/pages/orders/HubOrdersPage.tsx`
  `src/pages/other/FAQPage.tsx`
  `src/pages/other/ProductsWithNutritionPage.tsx`
  `src/pages/other/ReviewsPage.tsx`
  `src/pages/other/WishlistPage.tsx`
  `src/pages/other/ZonesPage.tsx`
  `src/pages/team/RoleManagementPage.tsx`
- [x] Validate and remove unused route guards if confirmed dead:
  `src/components/CuttingRoute.tsx`
  `src/components/DeliveryRoute.tsx`
- [x] Validate and remove unused components if confirmed dead:
  `src/components/products/ComboProductForm.tsx`
  `src/components/products/ProductFormDemo.tsx`
  `src/components/reports/PackingReportTemplate.tsx`
  `src/components/reports/SalesReportTemplate.tsx`
  `src/components/ui/CompactVideoUpload.tsx`

## Phase 5 - Repeated Logic and Technical Debt
- [x] Extract shared dashboard filter handling (currently repeated with TODO logs) from:
  `src/pages/dashboard/DashboardPage.tsx`
  `src/pages/dashboard/ProcurementDashboard.tsx`
  `src/pages/dashboard/PackingDashboard.tsx`
  `src/pages/dashboard/DeliveryDashboard.tsx`
  `src/pages/reports/ProductDemandForecastPage.tsx`
  `src/pages/reports/ProductTrendAnalysisPage.tsx`
- [x] Replace `window.location.href` redirects in `src/pages/dashboard/DashboardPage.tsx` with router navigation.
- [x] Reduce `any` usage in high-traffic shared components:
  `src/components/common/DataTable.tsx`
  `src/components/common/BulkActionModal.tsx`
  `src/components/features/orders/*`
  `src/components/features/team/*`
  `src/utils/menuConfig.ts`
  - Completed for the targeted scope above (removed `any`, `as any`, `any[]`; plus type-safe callback payloads and shared address typing).
  - Validation: targeted `eslint` passes for the scoped files and folders.
- [ ] Remove debug `console.log` statements from production paths after adding proper logging/notifications.
  - Remaining snapshot: `86` `console.log` occurrences across `src/` (orders/team/products/reports/settings/socket/ui/maps).

## Phase 6 - Validation and Safe Removal
- [x] Run `npm install` (or `npm ci`) and confirm local toolchain availability.
- [x] Run `npm run lint` and fix blocking issues introduced during refactor.
  - Current status: repo-wide lint still has pre-existing issues, but error count reduced from `259` to `209`, and touched refactor files are lint-clean.
- [x] Run `npm run build` and verify no type/runtime regressions.
  - Build passes after typed refactor adjustments.
- [ ] Run focused regression checks: authentication, role-based routes, marketing flows, orders, reporting.
  - Automated checks completed: `npm run check:routes` and `npm run check:route-guards` both pass.
  - Manual UI smoke checks still pending (auth/role/marketing/orders/reporting).
- [ ] Remove deprecated files only after all verification checks pass.
- [x] Update this file by checking completed tasks and adding follow-up tasks discovered during implementation.

## Follow-up Tasks Discovered (2026-03-05)
- [ ] Replace remaining `console.log` usage with structured logging/UX notifications (86 occurrences).
- [ ] Continue repo-wide lint debt reduction (209 current issues), prioritizing:
  `react-hooks/set-state-in-effect`,
  `react-hooks/purity`,
  `@typescript-eslint/no-explicit-any`,
  and `react-refresh/only-export-components`.
