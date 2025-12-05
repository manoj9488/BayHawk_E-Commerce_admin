# Admin Panel - Role-Based Access Control (RBAC)

## 🎯 Overview

This admin panel now includes a complete **Role-Based Access Control (RBAC)** system that allows different admin users to have different levels of access based on their role.

## ✨ Features

- ✅ **Role Selection on Login** - Choose your role when logging in
- ✅ **Role Persistence** - Role is saved and persists across page refreshes
- ✅ **Dynamic Navigation** - Sidebar menu items filtered based on role permissions
- ✅ **Role Switcher** - Switch between roles without logging out (for testing)
- ✅ **Permission-Based UI** - Buttons and actions hidden based on permissions
- ✅ **Clean Logout** - Properly clears role data on logout

## 🚀 Quick Start

### 1. Start the Server
```bash
npm run dev
```

### 2. Login with a Role
1. Go to `http://localhost:3000`
2. Select a role from the dropdown
3. Enter any credentials
4. Click "Sign In"

### 3. Available Roles

| Role | Access Level | What You Can See |
|------|--------------|------------------|
| **Super Admin** | Full Access | Everything |
| **Procurement** | Medium Access | Dashboard, Orders, Products, Reports |
| **Packing** | Limited Access | Dashboard, Orders, Products (view) |
| **Delivery** | Minimal Access | Dashboard, Orders only |

## 📖 Documentation

### Quick References
- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Testing Checklist](TESTING_CHECKLIST.md)** - Complete testing guide
- **[Architecture](ARCHITECTURE.md)** - System design and flow diagrams

### Detailed Documentation
- **[Role-Based Access](ROLE_BASED_ACCESS.md)** - Complete RBAC documentation
- **[Changes Summary](CHANGES_SUMMARY.md)** - What was changed and why

## 🎮 Try It Out

### Test Scenario 1: Super Admin
```
1. Login as "Super Admin"
2. See all menu items in sidebar
3. Navigate to any page
4. All features are accessible
```

### Test Scenario 2: Procurement
```
1. Login as "Procurement"
2. Notice fewer menu items
3. Try to find "Settings" → Not visible
4. Can access Orders and Products
```

### Test Scenario 3: Role Switching
```
1. Login as any role
2. Click shield icon in header
3. Select different role
4. Watch sidebar update instantly!
```

## 🔑 Role Permissions Matrix

| Feature | Super Admin | Procurement | Packing | Delivery |
|---------|:-----------:|:-----------:|:-------:|:--------:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ |
| **Orders** |
| - View | ✅ | ✅ | ✅ | ✅ |
| - Edit | ✅ | ✅ | ✅ | ✅ |
| - Delete | ✅ | ❌ | ❌ | ❌ |
| **Products** |
| - View | ✅ | ✅ | ✅ | ❌ |
| - Edit | ✅ | ✅ | ❌ | ❌ |
| - Delete | ✅ | ❌ | ❌ | ❌ |
| **Team** |
| - View | ✅ | ❌ | ❌ | ❌ |
| - Edit | ✅ | ❌ | ❌ | ❌ |
| - Delete | ✅ | ❌ | ❌ | ❌ |
| **Reports** | ✅ | ✅ | ❌ | ❌ |
| **Marketing** | ✅ | ❌ | ❌ | ❌ |
| **Settings** | ✅ | ❌ | ❌ | ❌ |
| **Support** | ✅ | ❌ | ❌ | ❌ |
| **Audit Logs** | ✅ | ❌ | ❌ | ❌ |

## 🛠️ Technical Implementation

### Core Components

1. **AuthContext** (`lib/auth-context.tsx`)
   - Manages user authentication state
   - Reads role from localStorage
   - Provides user data to all components

2. **Permissions** (`lib/permissions.ts`)
   - Defines all permissions
   - Maps roles to permissions
   - Helper functions for permission checks

3. **RoleBasedComponent** (`components/admin/role-based-component.tsx`)
   - Wrapper for conditional rendering
   - Checks permissions before showing content
   - Used throughout the app

4. **RoleSwitcher** (`components/admin/role-switcher.tsx`)
   - UI for switching roles
   - Updates localStorage and context
   - Instant UI updates

### Data Flow

```
Login → localStorage → AuthContext → Components → UI Updates
```

### Key Files Modified

- ✏️ `app/page.tsx` - Added role selection
- ✏️ `lib/auth-context.tsx` - Added localStorage integration
- ✏️ `components/admin/role-switcher.tsx` - Added persistence
- ✏️ `components/admin/sidebar.tsx` - Added logout handler
- ✏️ `components/admin/header.tsx` - Added logout handler

## 🧪 Testing

### Manual Testing
Follow the [Testing Checklist](TESTING_CHECKLIST.md) for comprehensive testing.

### Quick Test
```bash
# 1. Start server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Test each role
- Login as Super Admin → See all items
- Switch to Procurement → See fewer items
- Switch to Delivery → See minimal items
```

## 🔒 Security Notes

⚠️ **Important:** This is a **client-side implementation** for UI purposes.

### Current Implementation
- ✅ UI filtering and navigation control
- ✅ Role persistence across sessions
- ✅ Clean separation of concerns
- ❌ **NOT secure for production use**

### For Production
You must implement:
- 🔐 Server-side authentication (JWT/sessions)
- 🔐 API endpoint protection
- 🔐 Database-level access control
- 🔐 CSRF protection
- 🔐 Secure session management

**Never trust client-side role data for authorization!**

## 📁 Project Structure

```
admin-page-development/
├── app/
│   ├── page.tsx                          # Login with role selection
│   └── admin/
│       ├── layout.tsx                    # Admin layout
│       └── team/
│           └── admin-management/
│               └── page.tsx              # Demo RBAC page
│
├── components/
│   └── admin/
│       ├── admin-layout.tsx              # Layout with AuthProvider
│       ├── sidebar.tsx                   # Role-filtered navigation
│       ├── header.tsx                    # Header with role switcher
│       ├── role-switcher.tsx             # Role switching UI
│       └── role-based-component.tsx      # Permission wrapper
│
├── lib/
│   ├── auth-context.tsx                  # Auth context
│   ├── permissions.ts                    # Permissions system
│   └── types.ts                          # TypeScript types
│
└── Documentation/
    ├── README_RBAC.md                    # This file
    ├── QUICK_START.md                    # Quick start guide
    ├── ROLE_BASED_ACCESS.md              # Full documentation
    ├── TESTING_CHECKLIST.md              # Testing guide
    ├── CHANGES_SUMMARY.md                # Changes made
    └── ARCHITECTURE.md                   # Architecture diagrams
```

## 🎨 Demo Pages

### Admin Management Page
**URL:** `/admin/team/admin-management`

This page demonstrates:
- Current role display
- List of admin users
- Role-based button visibility (Edit/Delete)
- Permission information

**Try it:**
1. Login as Super Admin → See Edit/Delete buttons
2. Switch to Delivery → Buttons disappear
3. Switch back to Super Admin → Buttons reappear

## 🐛 Troubleshooting

### Issue: Role not persisting
**Solution:** Check if localStorage is enabled in browser settings

### Issue: All items showing for restricted role
**Solution:** Clear localStorage and login again

### Issue: Role switcher not working
**Solution:** Check browser console for errors, refresh page

### Issue: Can't access certain pages
**Solution:** This is expected! Your role doesn't have permission

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🤝 Contributing

To add new roles or permissions:

1. **Add Role:**
   - Update `UserRole` type in `lib/types.ts`
   - Add to `ROLE_PERMISSIONS` in `lib/permissions.ts`
   - Add to login page role select

2. **Add Permission:**
   - Add to `Permission` type in `lib/permissions.ts`
   - Add to relevant roles in `ROLE_PERMISSIONS`
   - Use in components with `RoleBasedComponent`

## 📝 License

This project is part of an admin panel system.

## 🎉 Success!

Your admin panel now has working role-based access control! Each role sees only what they're permitted to access.

**Need Help?**
- Check the [Quick Start Guide](QUICK_START.md)
- Review the [Testing Checklist](TESTING_CHECKLIST.md)
- Read the [Full Documentation](ROLE_BASED_ACCESS.md)

---

**Made with ❤️ for better admin management**
