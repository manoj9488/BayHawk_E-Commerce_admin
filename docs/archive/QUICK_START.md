# Quick Start Guide - Admin Panel with Role-Based Access

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

### 2. Login with Different Roles

#### Option A: Super Admin (Full Access)
1. Go to `http://localhost:3000`
2. Select **"Super Admin"** from the role dropdown
3. Enter any email/password
4. Click **"Sign In"**
5. ✅ You'll see ALL menu items and features

#### Option B: Procurement (Limited Access)
1. Select **"Procurement"** from the role dropdown
2. Login
3. ✅ You'll see: Dashboard, Orders, Products, Reports
4. ❌ You won't see: Team, Marketing, Settings, Support, Audit

#### Option C: Packing (More Limited)
1. Select **"Packing"** from the role dropdown
2. Login
3. ✅ You'll see: Dashboard, Orders, Products (view only)
4. ❌ You won't see: Team, Reports, Marketing, Settings, Support, Audit

#### Option D: Delivery (Most Limited)
1. Select **"Delivery"** from the role dropdown
2. Login
3. ✅ You'll see: Dashboard, Orders
4. ❌ You won't see: Products, Team, Reports, Marketing, Settings, Support, Audit

### 3. Switch Roles (Without Logging Out)

1. Look for the **shield icon** with a badge in the header (top right)
2. Click it to open the role switcher
3. Select a different role
4. Watch the sidebar menu update instantly!

### 4. Test Role Persistence

1. Login with any role
2. Refresh the page (F5)
3. ✅ Your role should remain the same
4. ✅ The sidebar should show the same menu items

### 5. Logout

Click the **Logout** button in:
- Sidebar (bottom)
- OR Header (user avatar dropdown)

This will clear your role and redirect to login.

## 📋 Quick Role Comparison

| Feature | Super Admin | Procurement | Packing | Delivery |
|---------|-------------|-------------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ Full | ✅ Edit | ✅ Edit | ✅ Edit |
| Products | ✅ Full | ✅ Edit | ✅ View | ❌ |
| Team | ✅ Full | ❌ | ❌ | ❌ |
| Reports | ✅ Full | ✅ View | ❌ | ❌ |
| Marketing | ✅ Full | ❌ | ❌ | ❌ |
| Support | ✅ Full | ❌ | ❌ | ❌ |
| Settings | ✅ Full | ❌ | ❌ | ❌ |
| Audit Logs | ✅ Full | ❌ | ❌ | ❌ |

## 🎯 Quick Test Scenarios

### Scenario 1: "I'm a Procurement Manager"
```
1. Login as "Procurement"
2. Go to Orders → ✅ Can view and edit
3. Go to Products → ✅ Can view and edit
4. Try to access Settings → ❌ Menu item not visible
```

### Scenario 2: "I'm a Packing Staff"
```
1. Login as "Packing"
2. Go to Orders → ✅ Can view and edit
3. Go to Products → ✅ Can view only
4. Try to access Reports → ❌ Menu item not visible
```

### Scenario 3: "I'm a Delivery Agent"
```
1. Login as "Delivery"
2. Go to Orders → ✅ Can view and edit
3. Try to access Products → ❌ Menu item not visible
4. Try to access anything else → ❌ Not visible
```

## 🔧 Troubleshooting

### Problem: "I can't see any menu items"
**Solution:** 
- Logout and login again
- Make sure you selected a role during login
- Check browser console for errors

### Problem: "Role doesn't persist after refresh"
**Solution:**
- Check if localStorage is enabled in your browser
- Try clearing browser cache
- Login again

### Problem: "All menu items showing for restricted role"
**Solution:**
- Clear localStorage: Open DevTools → Application → Local Storage → Clear
- Logout and login again

### Problem: "Role switcher not working"
**Solution:**
- Check browser console for errors
- Refresh the page
- Try logging out and back in

## 📚 Additional Resources

- **Full Documentation:** See `ROLE_BASED_ACCESS.md`
- **Testing Checklist:** See `TESTING_CHECKLIST.md`
- **Changes Summary:** See `CHANGES_SUMMARY.md`

## 🎨 Demo Pages

### Admin Management Page
URL: `/admin/team/admin-management`

This page demonstrates:
- Current role display
- Role-based button visibility
- Permission information

**Try this:**
1. Login as Super Admin
2. Go to Admin Management page
3. See Edit/Delete buttons
4. Switch to Delivery role
5. Watch buttons disappear!

## 💡 Pro Tips

1. **Quick Role Testing:** Use the role switcher instead of logging out/in
2. **Check Permissions:** Visit the Admin Management page to see what each role can do
3. **Browser DevTools:** Open Application → Local Storage to see stored role
4. **Console Logs:** Check browser console for any errors or warnings

## 🎉 You're All Set!

The admin panel is now working with proper role-based access control. Each role sees only what they're permitted to access.

**Happy Testing! 🚀**
