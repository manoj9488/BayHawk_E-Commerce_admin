import type { User, LoginType, RoleDefinition } from '../types';

export const PERMISSIONS = {
  // Hub Orders
  HUB_ORDERS_VIEW: 'hub_orders_view',
  HUB_ORDERS_CREATE: 'hub_orders_create',
  HUB_ORDERS_EDIT: 'hub_orders_edit',
  HUB_PRE_ORDERS: 'hub_pre_orders',
  
  // Hub Team
  HUB_TEAM_VIEW: 'hub_team_view',
  HUB_TEAM_MANAGE: 'hub_team_manage',
  HUB_DELIVERY_AGENTS_VIEW: 'hub_delivery_agents_view',
  HUB_DELIVERY_AGENTS_MANAGE: 'hub_delivery_agents_manage',
  HUB_CUSTOM_ROLES: 'hub_custom_roles',
  
  // Hub Products
  HUB_PRODUCTS_VIEW: 'hub_products_view',
  HUB_PRODUCTS_MANAGE: 'hub_products_manage',
  HUB_PRODUCTS_UPLOAD: 'hub_products_upload',
  HUB_STOCK_VIEW: 'hub_stock_view',
  HUB_STOCK_MANAGE: 'hub_stock_manage',
  HUB_CATEGORIES_VIEW: 'hub_categories_view',
  HUB_CATEGORIES_MANAGE: 'hub_categories_manage',
  HUB_RECIPES_VIEW: 'hub_recipes_view',
  HUB_RECIPES_MANAGE: 'hub_recipes_manage',
  
  // Hub Labeling
  HUB_LABELING_VIEW: 'hub_labeling_view',
  HUB_LABELING_MANAGE: 'hub_labeling_manage',
  
  // Hub Marketing
  HUB_MARKETING_VIEW: 'hub_marketing_view',
  HUB_MARKETING_MANAGE: 'hub_marketing_manage',
  HUB_SCRATCH_CARD: 'hub_scratch_card',
  HUB_SPIN_WHEEL: 'hub_spin_wheel',
  HUB_FLASH_SALE: 'hub_flash_sale',
  HUB_SUBSCRIPTION: 'hub_subscription',
  HUB_OFFER_NOTIFICATION: 'hub_offer_notification',
  HUB_COUPON: 'hub_coupon',
  HUB_IN_APP_CURRENCY: 'hub_in_app_currency',
  HUB_REFERRAL: 'hub_referral',
  
  // Hub Reports
  HUB_REPORTS_SALES: 'hub_reports_sales',
  HUB_REPORTS_PACKING: 'hub_reports_packing',
  HUB_REPORTS_DELIVERY: 'hub_reports_delivery',
  HUB_REPORTS_STOCK: 'hub_reports_stock',
  HUB_REPORTS_CUSTOMER: 'hub_reports_customer',
  HUB_REPORTS_PROCUREMENT: 'hub_reports_procurement',
  
  // Hub Audit
  HUB_AUDIT_LOGS: 'hub_audit_logs',
  
  // Store Orders
  STORE_ORDERS_VIEW: 'store_orders_view',
  STORE_ORDERS_CREATE: 'store_orders_create',
  
  // Store Team
  STORE_TEAM_VIEW: 'store_team_view',
  STORE_TEAM_MANAGE: 'store_team_manage',
  
  // Store Products
  STORE_PRODUCTS_VIEW: 'store_products_view',
  STORE_STOCK_MANAGE: 'store_stock_manage',
  
  // Store Delivery Agents
  STORE_DELIVERY_AGENTS_VIEW: 'store_delivery_agents_view',
  
  // Super Admin
  PRODUCT_APPROVAL: 'product_approval',
  ALL_ACCESS: 'all_access',
  
  // Procurement
  PROCUREMENT_VIEW: 'procurement_view',
  PROCUREMENT_MANAGE: 'procurement_manage',
  
  // Cutting & Cleaning
  CUTTING_CLEANING_VIEW: 'cutting_cleaning_view',
  CUTTING_CLEANING_MANAGE: 'cutting_cleaning_manage',
  
  // Packing
  PACKING_VIEW: 'packing_view',
  PACKING_MANAGE: 'packing_manage',
  
  // Dispatch
  DISPATCH_VIEW: 'dispatch_view',
  DISPATCH_MANAGE: 'dispatch_manage',
  
  // Delivery
  DELIVERY_VIEW: 'delivery_view',
  DELIVERY_MANAGE: 'delivery_manage',
  DELIVERY_ASSIGN: 'delivery_assign',
};

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  // Hub Roles
  hub_main_admin: {
    id: 'hub_main_admin',
    name: 'hub_main_admin',
    displayName: 'Main Admin',
    description: 'Full access to hub operations',
    moduleType: 'hub',
    color: 'bg-blue-500',
    icon: 'Shield',
    permissions: [
      PERMISSIONS.HUB_ORDERS_VIEW,
      PERMISSIONS.HUB_ORDERS_CREATE,
      PERMISSIONS.HUB_ORDERS_EDIT,
      PERMISSIONS.HUB_PRE_ORDERS,
      PERMISSIONS.HUB_TEAM_VIEW,
      PERMISSIONS.HUB_TEAM_MANAGE,
      PERMISSIONS.HUB_DELIVERY_AGENTS_VIEW,
      PERMISSIONS.HUB_DELIVERY_AGENTS_MANAGE,
      PERMISSIONS.HUB_CUSTOM_ROLES,
      PERMISSIONS.HUB_PRODUCTS_VIEW,
      PERMISSIONS.HUB_PRODUCTS_MANAGE,
      PERMISSIONS.HUB_PRODUCTS_UPLOAD,
      PERMISSIONS.HUB_STOCK_VIEW,
      PERMISSIONS.HUB_STOCK_MANAGE,
      PERMISSIONS.HUB_CATEGORIES_VIEW,
      PERMISSIONS.HUB_CATEGORIES_MANAGE,
      PERMISSIONS.HUB_RECIPES_VIEW,
      PERMISSIONS.HUB_RECIPES_MANAGE,
      PERMISSIONS.HUB_LABELING_VIEW,
      PERMISSIONS.HUB_LABELING_MANAGE,
      PERMISSIONS.HUB_MARKETING_VIEW,
      PERMISSIONS.HUB_MARKETING_MANAGE,
      PERMISSIONS.HUB_SCRATCH_CARD,
      PERMISSIONS.HUB_SPIN_WHEEL,
      PERMISSIONS.HUB_FLASH_SALE,
      PERMISSIONS.HUB_SUBSCRIPTION,
      PERMISSIONS.HUB_OFFER_NOTIFICATION,
      PERMISSIONS.HUB_COUPON,
      PERMISSIONS.HUB_IN_APP_CURRENCY,
      PERMISSIONS.HUB_REFERRAL,
      PERMISSIONS.HUB_REPORTS_SALES,
      PERMISSIONS.HUB_REPORTS_PACKING,
      PERMISSIONS.HUB_REPORTS_DELIVERY,
      PERMISSIONS.HUB_REPORTS_STOCK,
      PERMISSIONS.HUB_REPORTS_CUSTOMER,
      PERMISSIONS.HUB_REPORTS_PROCUREMENT,
      PERMISSIONS.HUB_AUDIT_LOGS,
      PERMISSIONS.PROCUREMENT_VIEW,
      PERMISSIONS.PROCUREMENT_MANAGE,
      PERMISSIONS.CUTTING_CLEANING_VIEW,
      PERMISSIONS.CUTTING_CLEANING_MANAGE,
      PERMISSIONS.PACKING_VIEW,
      PERMISSIONS.PACKING_MANAGE,
      PERMISSIONS.DISPATCH_VIEW,
      PERMISSIONS.DISPATCH_MANAGE,
      PERMISSIONS.DELIVERY_VIEW,
      PERMISSIONS.DELIVERY_MANAGE,
    ],
  },
  
  hub_procurement: {
    id: 'hub_procurement',
    name: 'hub_procurement',
    displayName: 'Procurement Employee',
    description: 'Manage procurement and inventory operations',
    moduleType: 'hub',
    color: 'bg-green-500',
    icon: 'Package',
    permissions: [
      // Products - View and Manage Only
      PERMISSIONS.HUB_PRODUCTS_VIEW,
      PERMISSIONS.HUB_PRODUCTS_MANAGE,
      PERMISSIONS.PROCUREMENT_VIEW,
      PERMISSIONS.PROCUREMENT_MANAGE,
    ],
  },
  
  hub_cutting_cleaning: {
    id: 'hub_cutting_cleaning',
    name: 'hub_cutting_cleaning',
    displayName: 'Cutting & Cleaning Employee',
    description: 'Handle cutting and cleaning operations',
    moduleType: 'hub',
    color: 'bg-teal-500',
    icon: 'Scissors',
    permissions: [
      PERMISSIONS.CUTTING_CLEANING_VIEW,
      PERMISSIONS.CUTTING_CLEANING_MANAGE,
      PERMISSIONS.HUB_PRODUCTS_VIEW,
    ],
  },
  
  hub_packing: {
    id: 'hub_packing',
    name: 'hub_packing',
    displayName: 'Packing Employee',
    description: 'Handle order packing operations',
    moduleType: 'hub',
    color: 'bg-orange-500',
    icon: 'Box',
    permissions: [
      // Orders - Limited Access
      PERMISSIONS.HUB_ORDERS_VIEW,
      PERMISSIONS.HUB_ORDERS_EDIT,
      PERMISSIONS.PACKING_VIEW,
      PERMISSIONS.PACKING_MANAGE,
      
      // Labeling - Full Access
      'HUB_LABELING_VIEW',
      'HUB_LABELING_MANAGE',
    ],
  },
  
  hub_dispatch: {
    id: 'hub_dispatch',
    name: 'hub_dispatch',
    displayName: 'Dispatch Employee',
    description: 'Handle order dispatch and coordination',
    moduleType: 'hub',
    color: 'bg-indigo-500',
    icon: 'Send',
    permissions: [
      // Orders - View and Edit
      PERMISSIONS.HUB_ORDERS_VIEW,
      PERMISSIONS.HUB_ORDERS_EDIT,
      PERMISSIONS.DISPATCH_VIEW,
      PERMISSIONS.DISPATCH_MANAGE,
      
      // Delivery - View and Assign
      PERMISSIONS.DELIVERY_VIEW,
      PERMISSIONS.DELIVERY_ASSIGN,
      
      // Team - View Delivery Agents
      PERMISSIONS.HUB_DELIVERY_AGENTS_VIEW,
    ],
  },
  
  hub_delivery: {
    id: 'hub_delivery',
    name: 'hub_delivery',
    displayName: 'Delivery Employee',
    description: 'View delivery operations and track orders',
    moduleType: 'hub',
    color: 'bg-purple-500',
    icon: 'Truck',
    permissions: [
      // Orders - View Only for Delivery
      PERMISSIONS.HUB_ORDERS_VIEW,
      PERMISSIONS.DELIVERY_VIEW,
      
      // Team - Limited Access
      PERMISSIONS.HUB_TEAM_VIEW,
      PERMISSIONS.HUB_DELIVERY_AGENTS_VIEW,
    ],
  },
  
  // Store Roles
  store_main_admin: {
    id: 'store_main_admin',
    name: 'store_main_admin',
    displayName: 'Main Admin',
    description: 'Full access to store operations',
    moduleType: 'store',
    color: 'bg-blue-500',
    icon: 'Shield',
    permissions: [
      PERMISSIONS.STORE_ORDERS_VIEW,
      PERMISSIONS.STORE_ORDERS_CREATE,
      PERMISSIONS.STORE_TEAM_VIEW,
      PERMISSIONS.STORE_TEAM_MANAGE,
      PERMISSIONS.STORE_DELIVERY_AGENTS_VIEW,
      PERMISSIONS.STORE_PRODUCTS_VIEW,
      PERMISSIONS.STORE_STOCK_MANAGE,
      PERMISSIONS.HUB_CATEGORIES_VIEW,
      PERMISSIONS.HUB_CATEGORIES_MANAGE,
      PERMISSIONS.HUB_RECIPES_VIEW,
      PERMISSIONS.HUB_RECIPES_MANAGE,
      PERMISSIONS.HUB_LABELING_VIEW,
      PERMISSIONS.HUB_LABELING_MANAGE,
      PERMISSIONS.HUB_MARKETING_VIEW,
      PERMISSIONS.HUB_MARKETING_MANAGE,
      PERMISSIONS.HUB_SCRATCH_CARD,
      PERMISSIONS.HUB_SPIN_WHEEL,
      PERMISSIONS.HUB_FLASH_SALE,
      PERMISSIONS.HUB_SUBSCRIPTION,
      PERMISSIONS.HUB_OFFER_NOTIFICATION,
      PERMISSIONS.HUB_COUPON,
      PERMISSIONS.HUB_IN_APP_CURRENCY,
      PERMISSIONS.HUB_REFERRAL,
      PERMISSIONS.HUB_REPORTS_SALES,
      PERMISSIONS.HUB_REPORTS_PACKING,
      PERMISSIONS.HUB_REPORTS_DELIVERY,
      PERMISSIONS.HUB_REPORTS_STOCK,
      PERMISSIONS.HUB_REPORTS_CUSTOMER,
      PERMISSIONS.HUB_REPORTS_PROCUREMENT,
      PERMISSIONS.PROCUREMENT_VIEW,
      PERMISSIONS.PROCUREMENT_MANAGE,
      PERMISSIONS.CUTTING_CLEANING_VIEW,
      PERMISSIONS.CUTTING_CLEANING_MANAGE,
      PERMISSIONS.PACKING_VIEW,
      PERMISSIONS.PACKING_MANAGE,
      PERMISSIONS.DISPATCH_VIEW,
      PERMISSIONS.DISPATCH_MANAGE,
      PERMISSIONS.DELIVERY_VIEW,
      PERMISSIONS.DELIVERY_MANAGE,
    ],
  },
  
  store_procurement: {
    id: 'store_procurement',
    name: 'store_procurement',
    displayName: 'Procurement Employee',
    description: 'Manage store procurement and inventory',
    moduleType: 'store',
    color: 'bg-green-500',
    icon: 'Package',
    permissions: [
      // Products - View and Manage Only
      PERMISSIONS.STORE_PRODUCTS_VIEW,
      PERMISSIONS.PROCUREMENT_VIEW,
      PERMISSIONS.PROCUREMENT_MANAGE,
    ],
  },
  
  store_cutting_cleaning: {
    id: 'store_cutting_cleaning',
    name: 'store_cutting_cleaning',
    displayName: 'Cutting & Cleaning Employee',
    description: 'Handle store cutting and cleaning operations',
    moduleType: 'store',
    color: 'bg-teal-500',
    icon: 'Scissors',
    permissions: [
      PERMISSIONS.CUTTING_CLEANING_VIEW,
      PERMISSIONS.CUTTING_CLEANING_MANAGE,
      PERMISSIONS.STORE_PRODUCTS_VIEW,
    ],
  },
  
  store_packing: {
    id: 'store_packing',
    name: 'store_packing',
    displayName: 'Packing Employee',
    description: 'Handle store order packing',
    moduleType: 'store',
    color: 'bg-orange-500',
    icon: 'Box',
    permissions: [
      // Orders - Limited Access
      PERMISSIONS.STORE_ORDERS_VIEW,
      PERMISSIONS.PACKING_VIEW,
      PERMISSIONS.PACKING_MANAGE,
      
      // Labeling - Full Access
      'HUB_LABELING_VIEW',
      'HUB_LABELING_MANAGE',
    ],
  },
  
  store_dispatch: {
    id: 'store_dispatch',
    name: 'store_dispatch',
    displayName: 'Dispatch Employee',
    description: 'Handle store order dispatch and coordination',
    moduleType: 'store',
    color: 'bg-indigo-500',
    icon: 'Send',
    permissions: [
      // Orders - View and Edit
      PERMISSIONS.STORE_ORDERS_VIEW,
      PERMISSIONS.DISPATCH_VIEW,
      PERMISSIONS.DISPATCH_MANAGE,
      
      // Delivery - View and Assign
      PERMISSIONS.DELIVERY_VIEW,
      PERMISSIONS.DELIVERY_ASSIGN,
      
      // Team - View Delivery Agents
      PERMISSIONS.STORE_DELIVERY_AGENTS_VIEW,
    ],
  },
  
  store_delivery: {
    id: 'store_delivery',
    name: 'store_delivery',
    displayName: 'Delivery Employee',
    description: 'View store delivery operations',
    moduleType: 'store',
    color: 'bg-purple-500',
    icon: 'Truck',
    permissions: [
      // Orders - View Only for Delivery
      PERMISSIONS.STORE_ORDERS_VIEW,
      PERMISSIONS.DELIVERY_VIEW,
      
      // Team - Limited Access
      PERMISSIONS.STORE_TEAM_VIEW,
      PERMISSIONS.STORE_DELIVERY_AGENTS_VIEW,
    ],
  },
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [PERMISSIONS.ALL_ACCESS],
  hub_admin: ROLE_DEFINITIONS.hub_main_admin.permissions,
  store_admin: ROLE_DEFINITIONS.store_main_admin.permissions,
  ...Object.fromEntries(
    Object.entries(ROLE_DEFINITIONS).map(([key, role]) => [key, role.permissions])
  ),
};

export const PROCUREMENT_ROLES = [
  'hub_procurement',
  'store_procurement',
  'hub_main_admin',
  'store_main_admin',
] as const;

export const PACKING_ROLES = [
  'hub_packing',
  'store_packing',
  'hub_main_admin',
  'store_main_admin',
] as const;

export const PROCUREMENT_OR_CUTTING_ROLES = [
  ...PROCUREMENT_ROLES,
  'hub_cutting_cleaning',
  'store_cutting_cleaning',
] as const;

export function isProcurementUser(user: { role?: string } | null | undefined): boolean {
  if (!user?.role) return false;
  return PROCUREMENT_ROLES.includes(user.role as (typeof PROCUREMENT_ROLES)[number]);
}

export function canAccessProcurementReport(
  user: { role?: string } | null | undefined,
  reportType: string,
): boolean {
  if (!isProcurementUser(user)) {
    return false;
  }

  return ['stock', 'procurement'].includes(reportType);
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  
  // Check custom permissions first
  if (user.permissions && user.permissions.includes(permission)) return true;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  if (userPermissions.includes(PERMISSIONS.ALL_ACCESS)) return true;
  
  return userPermissions.includes(permission);
}

export function canAccessModule(user: User | null, module: 'hub' | 'store'): boolean {
  if (!user) return false;
  
  if (user.loginType === 'super_admin') return true;
  
  return user.loginType === module;
}

export function getAccessibleModules(loginType: LoginType): ('hub' | 'store')[] {
  if (loginType === 'super_admin') return ['hub', 'store'];
  if (loginType === 'hub') return ['hub'];
  if (loginType === 'store') return ['store'];
  return [];
}

export function filterDataByModule<T extends { moduleType?: string; hubId?: string; storeId?: string }>(
  data: T[],
  user: User | null
): T[] {
  if (!user) return [];
  
  if (user.loginType === 'super_admin') return data;
  
  return data.filter(item => {
    if (user.loginType === 'hub') {
      return item.moduleType === 'hub' || item.hubId === user.hubId;
    }
    if (user.loginType === 'store') {
      return item.moduleType === 'store' || item.storeId === user.storeId;
    }
    return false;
  });
}

export function getRolesByModule(moduleType: 'hub' | 'store'): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS).filter(role => role.moduleType === moduleType);
}

export function getRoleDefinition(roleName: string): RoleDefinition | undefined {
  return ROLE_DEFINITIONS[roleName];
}
