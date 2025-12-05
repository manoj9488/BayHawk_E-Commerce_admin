# Testing Checklist for Role-Based Access Control

## Pre-Testing Setup
- [ ] Development server is running (`npm run dev`)
- [ ] Browser is open to `http://localhost:3000`
- [ ] Browser console is open (F12) to check for errors

## Test 1: Super Admin Login
- [ ] Navigate to login page
- [ ] Select "Super Admin" from role dropdown
- [ ] Enter any email and password
- [ ] Click "Sign In"
- [ ] Verify redirect to `/admin`
- [ ] Check sidebar shows ALL menu items:
  - [ ] Dashboard
  - [ ] Orders
  - [ ] Team & Users
  - [ ] Products & Stock
  - [ ] Reports
  - [ ] Marketing
  - [ ] Support
  - [ ] Audit Logs
  - [ ] Settings
  - [ ] Role Demo

## Test 2: Procurement Login
- [ ] Logout (click user avatar → Logout)
- [ ] Login with "Procurement" role
- [ ] Verify sidebar shows ONLY:
  - [ ] Dashboard
  - [ ] Orders
  - [ ] Products & Stock
  - [ ] Reports
  - [ ] Role Demo
- [ ] Verify sidebar DOES NOT show:
  - [ ] Team & Users
  - [ ] Marketing
  - [ ] Support
  - [ ] Audit Logs
  - [ ] Settings

## Test 3: Packing Login
- [ ] Logout and login with "Packing" role
- [ ] Verify sidebar shows ONLY:
  - [ ] Dashboard
  - [ ] Orders
  - [ ] Products & Stock
  - [ ] Role Demo
- [ ] Verify sidebar DOES NOT show:
  - [ ] Team & Users
  - [ ] Reports
  - [ ] Marketing
  - [ ] Support
  - [ ] Audit Logs
  - [ ] Settings

## Test 4: Delivery Login
- [ ] Logout and login with "Delivery" role
- [ ] Verify sidebar shows ONLY:
  - [ ] Dashboard
  - [ ] Orders
  - [ ] Role Demo
- [ ] Verify sidebar DOES NOT show:
  - [ ] Team & Users
  - [ ] Products & Stock
  - [ ] Reports
  - [ ] Marketing
  - [ ] Support
  - [ ] Audit Logs
  - [ ] Settings

## Test 5: Role Switcher
- [ ] Login as Super Admin
- [ ] Click shield icon in header (role switcher)
- [ ] Switch to "Procurement"
- [ ] Verify sidebar updates immediately
- [ ] Switch to "Packing"
- [ ] Verify sidebar updates again
- [ ] Switch to "Delivery"
- [ ] Verify sidebar shows minimal items
- [ ] Switch back to "Super Admin"
- [ ] Verify all items return

## Test 6: Role Persistence
- [ ] Login as "Procurement"
- [ ] Refresh the page (F5)
- [ ] Verify still logged in as Procurement
- [ ] Verify sidebar still shows Procurement items
- [ ] Check localStorage in browser DevTools:
  - [ ] Key: `userRole`
  - [ ] Value: `procurement`

## Test 7: Admin Management Page
- [ ] Login as Super Admin
- [ ] Navigate to `/admin/team/admin-management`
- [ ] Verify page shows:
  - [ ] Current role badge
  - [ ] List of admin users
  - [ ] Edit and Delete buttons visible
- [ ] Switch to "Delivery" role
- [ ] Verify Edit and Delete buttons disappear
- [ ] Switch back to Super Admin
- [ ] Verify buttons reappear

## Test 8: Logout Functionality
- [ ] Login with any role
- [ ] Click logout from sidebar
- [ ] Verify redirect to login page
- [ ] Check localStorage is cleared
- [ ] Try to navigate to `/admin` directly
- [ ] Verify no role is set (should see empty/default state)

## Test 9: OTP Login with Role
- [ ] On login page, switch to "Phone OTP" tab
- [ ] Enter phone number
- [ ] Click "Send OTP"
- [ ] Enter any 6-digit OTP
- [ ] Select "Packing" role
- [ ] Click "Verify & Sign In"
- [ ] Verify logged in as Packing role
- [ ] Verify sidebar shows Packing permissions

## Test 10: Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

## Test 11: Mobile Responsiveness
- [ ] Open browser DevTools
- [ ] Toggle device toolbar (mobile view)
- [ ] Test login on mobile view
- [ ] Verify sidebar opens with hamburger menu
- [ ] Verify role switcher works on mobile
- [ ] Test different roles on mobile

## Test 12: Error Handling
- [ ] Clear localStorage manually
- [ ] Navigate to `/admin`
- [ ] Verify app doesn't crash
- [ ] Login again
- [ ] Verify everything works

## Expected Results Summary

### Super Admin Should See:
✅ All menu items
✅ All buttons and actions
✅ Full access to all pages

### Procurement Should See:
✅ Dashboard, Orders, Products, Reports
❌ No Team, Marketing, Settings, Support, Audit

### Packing Should See:
✅ Dashboard, Orders, Products (view)
❌ No Team, Reports, Marketing, Settings, Support, Audit

### Delivery Should See:
✅ Dashboard, Orders
❌ No Products, Team, Reports, Marketing, Settings, Support, Audit

## Common Issues & Solutions

### Issue: Role not persisting after refresh
**Solution:** Check if localStorage is enabled in browser

### Issue: All menu items showing for restricted roles
**Solution:** Clear browser cache and localStorage, login again

### Issue: Role switcher not updating UI
**Solution:** Check browser console for errors, verify AuthProvider is wrapping the app

### Issue: Can't login
**Solution:** Check if dev server is running, verify no console errors

## Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Note which role you were using
4. Take a screenshot if possible
5. Document expected vs actual behavior

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Correct menu items for each role
- ✅ Role persists after refresh
- ✅ Role switcher works correctly
- ✅ Logout clears role data
- ✅ Login sets correct role
