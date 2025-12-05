# Role-Based Access Control (RBAC)

## Overview
The admin panel now supports role-based access control, allowing different admin users to have different levels of access based on their role.

## How It Works

### 1. Login with Role Selection
- On the login page (`/`), select your role from the dropdown
- Available roles:
  - **Super Admin**: Full access to all features
  - **Procurement**: Access to orders, products, and reports
  - **Packing**: Access to orders and products (view only)
  - **Delivery**: Access to orders only
  - **Custom**: Custom permissions (configurable)

### 2. Role Persistence
- Selected role is saved to `localStorage` on login
- Role persists across page refreshes
- Role is cleared on logout

### 3. Role Switching
- Use the role switcher in the header (shield icon with badge)
- Switch between roles to test different permission levels
- Changes take effect immediately

### 4. Permission-Based UI
- Navigation items are filtered based on role permissions
- Buttons and actions are hidden if user lacks permission
- Uses `RoleBasedComponent` wrapper for conditional rendering

## Role Permissions

### Super Admin
- ✅ View/Edit/Delete Orders
- ✅ View/Edit/Delete Products
- ✅ View/Edit/Delete Team
- ✅ View/Generate Reports
- ✅ View/Edit Marketing
- ✅ View/Edit Settings
- ✅ View/Edit Support
- ✅ View Audit Logs

### Procurement
- ✅ View/Edit Orders
- ✅ View/Edit Products
- ✅ View Reports
- ❌ No access to Team, Marketing, Settings, Support, Audit

### Packing
- ✅ View/Edit Orders
- ✅ View Products
- ❌ No access to editing Products, Team, Reports, Marketing, Settings, Support, Audit

### Delivery
- ✅ View/Edit Orders
- ❌ No access to Products, Team, Reports, Marketing, Settings, Support, Audit

## Implementation Files

### Core Files
- `lib/auth-context.tsx` - Authentication context with role management
- `lib/permissions.ts` - Permission definitions and role mappings
- `lib/types.ts` - TypeScript types for roles and users
- `components/admin/role-based-component.tsx` - Wrapper for conditional rendering
- `components/admin/role-switcher.tsx` - Role switching UI component

### Updated Files
- `app/page.tsx` - Login page with role selection
- `components/admin/sidebar.tsx` - Role-based navigation filtering
- `components/admin/header.tsx` - Logout with localStorage cleanup

## Testing Different Roles

1. **Login as Super Admin**
   - Select "Super Admin" on login page
   - You'll see all menu items and features

2. **Switch to Procurement**
   - Click the role switcher in header
   - Select "Procurement"
   - Notice that Team, Marketing, Settings, Support, and Audit menu items disappear

3. **Switch to Packing**
   - Select "Packing" from role switcher
   - Only Dashboard, Orders, and Products (limited) are visible

4. **Switch to Delivery**
   - Select "Delivery" from role switcher
   - Only Dashboard and Orders are visible

## Adding New Permissions

1. Add permission to `lib/permissions.ts`:
```typescript
export type Permission = 
  | "view_dashboard"
  | "your_new_permission"
  // ... other permissions
```

2. Add to role mappings:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "view_dashboard",
    "your_new_permission",
    // ... other permissions
  ],
  // ... other roles
}
```

3. Use in components:
```tsx
<RoleBasedComponent permission="your_new_permission">
  <YourProtectedComponent />
</RoleBasedComponent>
```

## Security Notes

⚠️ **Important**: This is a client-side implementation for UI purposes only.

For production:
- Implement server-side authentication
- Validate permissions on API endpoints
- Use secure session management
- Never trust client-side role data for authorization
- Implement proper JWT or session-based auth
