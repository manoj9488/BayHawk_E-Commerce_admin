# Role-Based Access Control Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE (/)                          │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │ Email Input  │    │ Password     │    │ Role Select  │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│                                                                 │
│  Roles: Super Admin | Procurement | Packing | Delivery        │
│                                                                 │
│                    ┌──────────────┐                            │
│                    │  Sign In     │                            │
│                    └──────┬───────┘                            │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  localStorage  │
                   │  userRole: "X" │
                   └────────┬───────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN LAYOUT                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AuthProvider (Context)                      │  │
│  │                                                          │  │
│  │  useEffect(() => {                                       │  │
│  │    const role = localStorage.getItem("userRole")         │  │
│  │    setUser({ ...userData, role })                        │  │
│  │  })                                                      │  │
│  │                                                          │  │
│  │  Provides: { user, userRole, setUser }                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    SIDEBAR                               │  │
│  │                                                          │  │
│  │  navigation.map(item => (                               │  │
│  │    <RoleBasedComponent permission={item.permission}>    │  │
│  │      <NavItem />                                         │  │
│  │    </RoleBasedComponent>                                 │  │
│  │  ))                                                      │  │
│  │                                                          │  │
│  │  ✅ Super Admin: All items                              │  │
│  │  ✅ Procurement: Dashboard, Orders, Products, Reports   │  │
│  │  ✅ Packing: Dashboard, Orders, Products                │  │
│  │  ✅ Delivery: Dashboard, Orders                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    HEADER                                │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Search     │  │ Role Switcher│  │ User Menu    │  │  │
│  │  └──────────────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │                            │                  │          │  │
│  │                            ▼                  ▼          │  │
│  │                    ┌──────────────┐  ┌──────────────┐  │  │
│  │                    │ Switch Role  │  │   Logout     │  │  │
│  │                    │ → Update     │  │ → Clear      │  │  │
│  │                    │ localStorage │  │ localStorage │  │  │
│  │                    └──────────────┘  └──────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    PAGE CONTENT                          │  │
│  │                                                          │  │
│  │  <RoleBasedComponent permission="edit_orders">          │  │
│  │    <Button>Edit Order</Button>                          │  │
│  │  </RoleBasedComponent>                                  │  │
│  │                                                          │  │
│  │  <RoleBasedComponent permission="delete_team">          │  │
│  │    <Button>Delete User</Button>                         │  │
│  │  </RoleBasedComponent>                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── LoginPage (/)
│   ├── Role Selection
│   └── Login Handler → Save to localStorage
│
└── AdminLayout (/admin)
    ├── AuthProvider (Context)
    │   ├── Read from localStorage
    │   ├── Create user object
    │   └── Provide { user, userRole, setUser }
    │
    ├── Sidebar
    │   ├── Navigation Items
    │   │   └── RoleBasedComponent (filters by permission)
    │   └── Logout Button → Clear localStorage
    │
    ├── Header
    │   ├── RoleSwitcher
    │   │   └── Update role → Save to localStorage
    │   └── User Menu
    │       └── Logout → Clear localStorage
    │
    └── Page Content
        └── RoleBasedComponent (conditional rendering)
```

## Data Flow

### 1. Login Flow
```
User selects role
    ↓
handleLogin()
    ↓
localStorage.setItem("userRole", selectedRole)
    ↓
router.push("/admin")
    ↓
AuthProvider reads localStorage
    ↓
Creates user object with role
    ↓
Provides user to all components
```

### 2. Permission Check Flow
```
Component renders
    ↓
RoleBasedComponent wrapper
    ↓
useAuth() → get userRole
    ↓
hasPermission(userRole, permission)
    ↓
Check ROLE_PERMISSIONS mapping
    ↓
Return true/false
    ↓
Render children or fallback
```

### 3. Role Switch Flow
```
User clicks role switcher
    ↓
Selects new role
    ↓
switchRole(newRole)
    ↓
localStorage.setItem("userRole", newRole)
    ↓
setUser({ ...user, role: newRole })
    ↓
Context updates
    ↓
All components re-render
    ↓
Permissions re-evaluated
    ↓
UI updates instantly
```

### 4. Logout Flow
```
User clicks logout
    ↓
handleLogout()
    ↓
localStorage.removeItem("userRole")
    ↓
router.push("/")
    ↓
User redirected to login
    ↓
Must select role again
```

## Permission System

### Permission Definition
```typescript
// lib/permissions.ts
export type Permission = 
  | "view_dashboard"
  | "view_orders"
  | "edit_orders"
  | "delete_orders"
  // ... more permissions
```

### Role Mapping
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "view_dashboard",
    "view_orders",
    "edit_orders",
    "delete_orders",
    // ... all permissions
  ],
  procurement: [
    "view_dashboard",
    "view_orders",
    "edit_orders",
    "view_products",
    "edit_products",
    "view_reports"
  ],
  // ... other roles
}
```

### Permission Check
```typescript
export function hasPermission(
  userRole: UserRole, 
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}
```

## Component Usage

### Protecting Navigation Items
```tsx
<RoleBasedComponent permission="view_orders">
  <Link href="/admin/orders">Orders</Link>
</RoleBasedComponent>
```

### Protecting Buttons
```tsx
<RoleBasedComponent permission="edit_team">
  <Button>Edit User</Button>
</RoleBasedComponent>
```

### Protecting Sections
```tsx
<RoleBasedComponent 
  permission="view_reports"
  fallback={<p>Access Denied</p>}
>
  <ReportsSection />
</RoleBasedComponent>
```

### Multiple Permissions (OR logic)
```tsx
<RoleBasedComponent 
  permissions={["edit_orders", "delete_orders"]}
>
  <OrderActions />
</RoleBasedComponent>
```

## State Management

### Global State (Context)
```
AuthContext
├── user: User | null
├── userRole: UserRole | null
└── setUser: (user: User | null) => void
```

### Local Storage
```
Key: "userRole"
Value: "super_admin" | "procurement" | "packing" | "delivery" | "custom"
```

### Component State
```
LoginPage
├── selectedRole: UserRole
├── isLoading: boolean
└── otpSent: boolean

RoleSwitcher
└── (uses AuthContext only)

Sidebar
└── expandedItems: string[]
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         CLIENT-SIDE (Current)           │
│  ✅ UI filtering                        │
│  ✅ Navigation control                  │
│  ✅ Button visibility                   │
│  ❌ NOT secure for production           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      SERVER-SIDE (Recommended)          │
│  ✅ JWT token validation                │
│  ✅ API endpoint protection             │
│  ✅ Database query filtering            │
│  ✅ Session management                  │
│  ✅ CSRF protection                     │
└─────────────────────────────────────────┘
```

## File Structure

```
admin-page-development/
├── app/
│   ├── page.tsx                    # Login page with role selection
│   └── admin/
│       ├── layout.tsx              # Admin layout wrapper
│       ├── page.tsx                # Dashboard
│       └── team/
│           └── admin-management/
│               └── page.tsx        # Demo page for RBAC
│
├── components/
│   └── admin/
│       ├── admin-layout.tsx        # Layout with AuthProvider
│       ├── sidebar.tsx             # Navigation with role filtering
│       ├── header.tsx              # Header with role switcher
│       ├── role-switcher.tsx       # Role switching component
│       └── role-based-component.tsx # Permission wrapper
│
├── lib/
│   ├── auth-context.tsx            # Authentication context
│   ├── permissions.ts              # Permission definitions
│   └── types.ts                    # TypeScript types
│
└── Documentation/
    ├── QUICK_START.md              # Quick start guide
    ├── ROLE_BASED_ACCESS.md        # Full documentation
    ├── TESTING_CHECKLIST.md        # Testing guide
    ├── CHANGES_SUMMARY.md          # Changes made
    └── ARCHITECTURE.md             # This file
```

## Key Concepts

### 1. Context API
- Provides global state for authentication
- Accessible via `useAuth()` hook
- Updates trigger re-renders

### 2. localStorage
- Persists role across page refreshes
- Simple key-value storage
- Cleared on logout

### 3. Conditional Rendering
- `RoleBasedComponent` wrapper
- Checks permissions before rendering
- Returns children or fallback

### 4. Permission-Based Access
- Declarative permission checks
- Centralized permission definitions
- Easy to extend and maintain

## Extension Points

### Adding New Roles
1. Add to `UserRole` type in `lib/types.ts`
2. Add to `ROLE_PERMISSIONS` in `lib/permissions.ts`
3. Add to role selects in `app/page.tsx`
4. Add to `roleLabels` in `components/admin/role-switcher.tsx`

### Adding New Permissions
1. Add to `Permission` type in `lib/permissions.ts`
2. Add to relevant roles in `ROLE_PERMISSIONS`
3. Use in components with `RoleBasedComponent`

### Adding New Protected Features
1. Wrap with `RoleBasedComponent`
2. Specify required permission
3. Optionally provide fallback UI

## Performance Considerations

- ✅ Context updates are efficient
- ✅ localStorage reads are fast
- ✅ Permission checks are O(1)
- ✅ No unnecessary re-renders
- ⚠️ Consider memoization for large lists

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ localStorage support required
- ✅ ES6+ features used
- ⚠️ IE11 not supported
