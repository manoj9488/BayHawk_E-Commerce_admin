import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { RollbackProvider } from './context/RollbackContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute as ProtectedRouteComponent } from './components/ProtectedRoute';
import DispatchRoute from './components/DispatchRoute';
import { MultiRoleRoute } from './components/MultiRoleRoute';
import {
  PACKING_ROLES,
  PERMISSIONS,
  PROCUREMENT_OR_CUTTING_ROLES,
  PROCUREMENT_ROLES,
} from './utils/rbac';
import { ProcurementReportsPage } from './pages/reports/ProcurementReportsPage';
import { PurchaseManagementPage } from './pages/procurement/PurchaseManagementPage';
import { CuttingManagementPage } from './pages/cutting/CuttingManagementPage';
import { PackingManagementPage } from './pages/packing/PackingManagementPage';
import DispatchManagement from './pages/dispatch/DispatchManagement';
import { LoginPage } from './pages/dashboard/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { ManualOrderPage } from './pages/orders/ManualOrderPage';
import { PreOrderPage } from './pages/orders/PreOrderPage';
import {
  HubManualOrderPage,
  HubPreOrderPage,
  StoreManualOrderPage,
  StorePreOrderPage,
} from './pages/orders/ScopedOrderPages';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductApprovalPage } from './pages/products/ProductApprovalPage';
import { CuttingTypePage } from './pages/products/CuttingTypePage';
import { ScratchCardConfig } from './components/marketing/ScratchCardConfig';
import { SpinWheelConfig } from './components/marketing/SpinWheelConfig';
import { FlashSaleConfig } from './components/marketing/FlashSaleConfig';
import { MembershipConfig } from './components/marketing/MembershipConfig';
import { OfferNotificationPage } from './pages/marketing/OfferNotificationPage';
import { CouponPage } from './pages/marketing/CouponPage';
import { InAppCurrencyPage } from './pages/marketing/InAppCurrencyPage';
import { ReferralPage } from './pages/marketing/ReferralPage';
import { HubPage } from './pages/hub-store/HubPage';
import { StorePage } from './pages/hub-store/StorePage';
import { TeamPage } from './pages/team/TeamPage';
import { CustomRolesPage } from './pages/team/CustomRolesPage';
import { CategoriesPage } from './pages/products/CategoriesPage';
import { StockManagementPage } from './pages/products/StockManagementPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SalesReportPage } from './pages/reports/SalesReportPage';
import { PackingReportPage } from './pages/reports/PackingReportPage';
import { DeliveryReportPage } from './pages/reports/DeliveryReportPage';
import { StockReportPage } from './pages/reports/StockReportPage';
import DeliveryAgentPage from './pages/delivery/DeliveryAgentPage';
import DeliveryAdminPage from './pages/delivery/DeliveryAdminPage';
import { CustomerReportPage } from './pages/reports/CustomerReportPage';
import { ProductDemandForecastPage } from './pages/reports/ProductDemandForecastPage';
import { ProductTrendAnalysisPage } from './pages/reports/ProductTrendAnalysisPage';
import { TaxGSTReportPage } from './pages/reports/TaxGSTReportPage';
import { RollbackDashboard } from './components/rollback/RollbackDashboard';
import { GeneralSettingsPage } from './pages/settings/GeneralSettingsPage';
import { DeliverySlotsPage } from './pages/settings/DeliverySlotsPage';
import { ShippingChargesPage } from './pages/settings/ShippingChargesPage';
import { IntegrationsPage } from './pages/settings/IntegrationsPage';
import { NotificationCustomizationPage } from './pages/settings/NotificationCustomizationPage';
import { WeatherCustomizationPage } from './pages/settings/WeatherCustomizationPage';
import { LegalPage } from './pages/settings/LegalPage';
import { AdvertisementPage } from './pages/settings/AdvertisementPage';
import { OfferTemplatesPage } from './pages/settings/OfferTemplatesPage';
import { MarketingPage } from './pages/marketing/MarketingPage';
import { RecipesPage } from './pages/products/RecipesPage';
import { MembershipPage } from './pages/other/MembershipPage';
import { WalletPage } from './pages/other/WalletPage';
import ProcurementPage from './pages/other/ProcurementPage';
import PackingPage from './pages/other/PackingPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import { LabelingPage } from './pages/labeling/LabelingPage';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';

const procurementRoles = [...PROCUREMENT_ROLES];
const packingRoles = [...PACKING_ROLES];
const procurementOrCuttingRoles = [...PROCUREMENT_OR_CUTTING_ROLES];

function RollbackScreen() {
  return (
    <RollbackProvider>
      <div className="p-6">
        <RollbackDashboard />
      </div>
    </RollbackProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <RollbackProvider>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <RoleBasedRedirect /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRouteComponent><Layout /></ProtectedRouteComponent>}>
        <Route index element={<RoleBasedRedirect />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Procurement Purchase Management */}
        <Route path="hub/procurement/purchases" element={<MultiRoleRoute allowedRoles={procurementRoles}><PurchaseManagementPage /></MultiRoleRoute>} />
        <Route path="store/procurement/purchases" element={<MultiRoleRoute allowedRoles={procurementRoles}><PurchaseManagementPage /></MultiRoleRoute>} />
        
        {/* Cutting & Cleaning Management */}
        <Route path="hub/cutting/management" element={<MultiRoleRoute allowedRoles={procurementOrCuttingRoles}><CuttingManagementPage /></MultiRoleRoute>} />
        <Route path="store/cutting/management" element={<MultiRoleRoute allowedRoles={procurementOrCuttingRoles}><CuttingManagementPage /></MultiRoleRoute>} />
        
        {/* Packing Management */}
        <Route path="hub/packing/management" element={<MultiRoleRoute allowedRoles={packingRoles}><PackingManagementPage /></MultiRoleRoute>} />
        <Route path="store/packing/management" element={<MultiRoleRoute allowedRoles={packingRoles}><PackingManagementPage /></MultiRoleRoute>} />
        
        {/* Dispatch Management */}
        <Route path="hub/dispatch/management" element={<DispatchRoute><DispatchManagement /></DispatchRoute>} />
        <Route path="store/dispatch/management" element={<DispatchRoute><DispatchManagement /></DispatchRoute>} />
        
        {/* Delivery Management */}
        <Route path="hub/delivery/management" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="hub/delivery/agent" element={<MultiRoleRoute allowedRoles={['hub_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="hub/delivery/admin" element={<MultiRoleRoute allowedRoles={['hub_main_admin']}><DeliveryAdminPage /></MultiRoleRoute>} />
        <Route path="store/delivery/management" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="store/delivery/agent" element={<MultiRoleRoute allowedRoles={['store_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="store/delivery/admin" element={<MultiRoleRoute allowedRoles={['store_main_admin']}><DeliveryAdminPage /></MultiRoleRoute>} />
        
        {/* Hub Products Routes - Main Admin Only */}
        <Route path="hub/products/categories" element={<MultiRoleRoute allowedRoles={procurementRoles}><CategoriesPage /></MultiRoleRoute>} />
        <Route path="hub/products/cutting-types" element={<ProtectedRouteComponent><CuttingTypePage /></ProtectedRouteComponent>} />
        <Route path="hub/products/stock" element={<MultiRoleRoute allowedRoles={procurementRoles}><StockManagementPage /></MultiRoleRoute>} />
        <Route path="hub/products/approval" element={<ProtectedRouteComponent permission={PERMISSIONS.PRODUCT_APPROVAL}><ProductApprovalPage /></ProtectedRouteComponent>} />
        <Route path="hub/products/recipes" element={<MultiRoleRoute allowedRoles={procurementRoles}><RecipesPage /></MultiRoleRoute>} />
        <Route path="hub/products/*" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProductsPage /></MultiRoleRoute>} />
        
        {/* Hub Marketing Routes - Procurement Accessible */}
        <Route path="hub/scratch-card" element={<MultiRoleRoute allowedRoles={procurementRoles}><ScratchCardConfig /></MultiRoleRoute>} />
        <Route path="hub/spin-wheel" element={<MultiRoleRoute allowedRoles={procurementRoles}><SpinWheelConfig /></MultiRoleRoute>} />
        <Route path="hub/flash-sale" element={<MultiRoleRoute allowedRoles={procurementRoles}><FlashSaleConfig /></MultiRoleRoute>} />
        <Route path="hub/subscription" element={<MultiRoleRoute allowedRoles={procurementRoles}><MembershipConfig /></MultiRoleRoute>} />
        <Route path="hub/offer-notification" element={<MultiRoleRoute allowedRoles={procurementRoles}><OfferNotificationPage /></MultiRoleRoute>} />
        <Route path="hub/coupon" element={<MultiRoleRoute allowedRoles={procurementRoles}><CouponPage /></MultiRoleRoute>} />
        <Route path="hub/in-app-currency" element={<MultiRoleRoute allowedRoles={procurementRoles}><InAppCurrencyPage /></MultiRoleRoute>} />
        <Route path="hub/referral" element={<MultiRoleRoute allowedRoles={procurementRoles}><ReferralPage /></MultiRoleRoute>} />
        <Route path="hub/marketing/*" element={<MultiRoleRoute allowedRoles={procurementRoles}><MarketingPage /></MultiRoleRoute>} />
        
        {/* Hub Reports Routes - Limited Procurement Access */}
        <Route path="hub/reports/stock" element={<MultiRoleRoute allowedRoles={procurementRoles}><StockReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/procurement" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProcurementReportsPage /></MultiRoleRoute>} />
        <Route path="hub/procurement" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProcurementPage /></MultiRoleRoute>} />
        <Route path="hub/reports/sales" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><SalesReportPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports/packing" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/delivery" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/customer" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_CUSTOMER}><CustomerReportPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports/demand-forecast" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><ProductDemandForecastPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports/trend-analysis" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><ProductTrendAnalysisPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports/tax-gst" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><TaxGSTReportPage /></ProtectedRouteComponent>} />
        <Route path="hub/system/rollback" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><RollbackScreen /></ProtectedRouteComponent>} />
        <Route path="hub/reports" element={<ReportsPage />} />
        
        {/* Hub Orders Routes - Multiple Roles Accessible */}
        <Route path="hub/orders/*" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing', 'hub_delivery']}><OrdersPage /></MultiRoleRoute>} />
        
        {/* Hub Team Routes */}
        <Route path="hub/team/*" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_VIEW}><TeamPage /></ProtectedRouteComponent>} />
        
        {/* Hub Labeling Routes - Packing Accessible */}
        <Route path="hub/labeling" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing']}><LabelingPage /></MultiRoleRoute>} />
        <Route path="hub/packing" element={<MultiRoleRoute allowedRoles={packingRoles}><PackingPage /></MultiRoleRoute>} />
        
        {/* Hub Admin-Only Routes */}
        <Route path="hub/orders/manual" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_ORDERS_CREATE}><HubManualOrderPage /></ProtectedRouteComponent>} />
        <Route path="hub/orders/pre-orders" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_PRE_ORDERS}><HubPreOrderPage /></ProtectedRouteComponent>} />
        <Route path="hub/audit" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_AUDIT_LOGS}><AuditLogsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><GeneralSettingsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/delivery-slots" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><DeliverySlotsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/shipping-charges" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><ShippingChargesPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/integrations" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><IntegrationsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/weather" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><WeatherCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/notification" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><NotificationCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/legal" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><LegalPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/advertisement" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><AdvertisementPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/*" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_MANAGE}><SettingsPage /></ProtectedRouteComponent>} />
        
        {/* Store Products Routes - Main Admin Only */}
        <Route path="store/products/categories" element={<MultiRoleRoute allowedRoles={procurementRoles}><CategoriesPage /></MultiRoleRoute>} />
        <Route path="store/products/cutting-types" element={<ProtectedRouteComponent><CuttingTypePage /></ProtectedRouteComponent>} />
        <Route path="store/products/stock" element={<MultiRoleRoute allowedRoles={procurementRoles}><StockManagementPage /></MultiRoleRoute>} />
        <Route path="store/products/approval" element={<ProtectedRouteComponent permission={PERMISSIONS.PRODUCT_APPROVAL}><ProductApprovalPage /></ProtectedRouteComponent>} />
        <Route path="store/products/recipes" element={<MultiRoleRoute allowedRoles={procurementRoles}><RecipesPage /></MultiRoleRoute>} />
        <Route path="store/products/*" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProductsPage /></MultiRoleRoute>} />
        
        {/* Store Marketing Routes - Procurement Accessible */}
        <Route path="store/scratch-card" element={<MultiRoleRoute allowedRoles={procurementRoles}><ScratchCardConfig /></MultiRoleRoute>} />
        <Route path="store/spin-wheel" element={<MultiRoleRoute allowedRoles={procurementRoles}><SpinWheelConfig /></MultiRoleRoute>} />
        <Route path="store/flash-sale" element={<MultiRoleRoute allowedRoles={procurementRoles}><FlashSaleConfig /></MultiRoleRoute>} />
        <Route path="store/subscription" element={<MultiRoleRoute allowedRoles={procurementRoles}><MembershipConfig /></MultiRoleRoute>} />
        <Route path="store/offer-notification" element={<MultiRoleRoute allowedRoles={procurementRoles}><OfferNotificationPage /></MultiRoleRoute>} />
        <Route path="store/coupon" element={<MultiRoleRoute allowedRoles={procurementRoles}><CouponPage /></MultiRoleRoute>} />
        <Route path="store/in-app-currency" element={<MultiRoleRoute allowedRoles={procurementRoles}><InAppCurrencyPage /></MultiRoleRoute>} />
        <Route path="store/referral" element={<MultiRoleRoute allowedRoles={procurementRoles}><ReferralPage /></MultiRoleRoute>} />
        <Route path="store/marketing/referral" element={<MultiRoleRoute allowedRoles={procurementRoles}><ReferralPage /></MultiRoleRoute>} />
        <Route path="store/marketing/*" element={<MultiRoleRoute allowedRoles={procurementRoles}><MarketingPage /></MultiRoleRoute>} />
        
        {/* Store Reports Routes - Limited Procurement Access */}
        <Route path="store/reports/stock" element={<MultiRoleRoute allowedRoles={procurementRoles}><StockReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/procurement" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProcurementReportsPage /></MultiRoleRoute>} />
        <Route path="store/procurement" element={<MultiRoleRoute allowedRoles={procurementRoles}><ProcurementPage /></MultiRoleRoute>} />
        <Route path="store/reports/sales" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><SalesReportPage /></ProtectedRouteComponent>} />
        <Route path="store/reports/packing" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/delivery" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/customer" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_CUSTOMER}><CustomerReportPage /></ProtectedRouteComponent>} />
        <Route path="store/reports/demand-forecast" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><ProductDemandForecastPage /></ProtectedRouteComponent>} />
        <Route path="store/reports/trend-analysis" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><ProductTrendAnalysisPage /></ProtectedRouteComponent>} />
        <Route path="store/reports/tax-gst" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><TaxGSTReportPage /></ProtectedRouteComponent>} />
        <Route path="store/system/rollback" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><RollbackScreen /></ProtectedRouteComponent>} />
        <Route path="store/reports" element={<ReportsPage />} />
        
        {/* Store Orders Routes - Multiple Roles Accessible */}
        <Route path="store/orders/*" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing', 'store_delivery']}><OrdersPage /></MultiRoleRoute>} />
        
        {/* Store Team Routes */}
        <Route path="store/team/*" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_VIEW}><TeamPage /></ProtectedRouteComponent>} />
        
        {/* Store Labeling Routes - Packing Accessible */}
        <Route path="store/labeling" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing']}><LabelingPage /></MultiRoleRoute>} />
        <Route path="store/packing" element={<MultiRoleRoute allowedRoles={packingRoles}><PackingPage /></MultiRoleRoute>} />
        
        {/* Store Admin-Only Routes */}
        <Route path="store/orders/manual" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_ORDERS_CREATE}><StoreManualOrderPage /></ProtectedRouteComponent>} />
        <Route path="store/orders/pre-orders" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_ORDERS_CREATE}><StorePreOrderPage /></ProtectedRouteComponent>} />
        <Route path="store/team/custom-roles" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><CustomRolesPage /></ProtectedRouteComponent>} />
        <Route path="store/audit" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><AuditLogsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><GeneralSettingsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/delivery-slots" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><DeliverySlotsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/shipping-charges" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><ShippingChargesPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/integrations" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><IntegrationsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/weather" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><WeatherCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/notification" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><NotificationCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/legal" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><LegalPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/advertisement" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><AdvertisementPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/*" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_MANAGE}><SettingsPage /></ProtectedRouteComponent>} />
        
        {/* Legacy/Common Routes */}
        <Route path="orders/manual" element={<ManualOrderPage />} />
        <Route path="orders/pre-orders" element={<PreOrderPage />} />
        <Route path="products/categories" element={<CategoriesPage />} />
        <Route path="products/cutting-types" element={<ProtectedRouteComponent><CuttingTypePage /></ProtectedRouteComponent>} />
        <Route path="products/stock" element={<StockManagementPage />} />
        <Route path="products/approval" element={<ProductApprovalPage />} />
        <Route path="scratch-card" element={<ScratchCardConfig />} />
        <Route path="spin-wheel" element={<SpinWheelConfig />} />
        <Route path="flash-sale" element={<FlashSaleConfig />} />
        <Route path="subscription" element={<MembershipConfig />} />
        <Route path="offer-notification" element={<OfferNotificationPage />} />
        <Route path="coupon" element={<CouponPage />} />
        <Route path="in-app-currency" element={<InAppCurrencyPage />} />
        <Route path="referral" element={<ReferralPage />} />
        <Route path="hubs" element={<HubPage />} />
        <Route path="stores" element={<StorePage />} />
        <Route path="team/custom-roles" element={<CustomRolesPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="labeling" element={<LabelingPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/sales" element={<SalesReportPage />} />
        <Route path="reports/packing" element={<PackingReportPage />} />
        <Route path="reports/delivery" element={<DeliveryReportPage />} />
        <Route path="reports/stock" element={<StockReportPage />} />
        <Route path="reports/customer" element={<CustomerReportPage />} />
        <Route path="reports/demand-forecast" element={<ProductDemandForecastPage />} />
        <Route path="reports/trend-analysis" element={<ProductTrendAnalysisPage />} />
        <Route path="reports/tax-gst" element={<TaxGSTReportPage />} />
        <Route path="system/rollback" element={<RollbackScreen />} />
        <Route path="settings" element={<GeneralSettingsPage />} />
        <Route path="settings/delivery-slots" element={<DeliverySlotsPage />} />
        <Route path="settings/shipping-charges" element={<ShippingChargesPage />} />
        <Route path="settings/integrations" element={<IntegrationsPage />} />
        <Route path="settings/weather" element={<WeatherCustomizationPage />} />
        <Route path="settings/notification" element={<NotificationCustomizationPage />} />
        <Route path="settings/legal" element={<LegalPage />} />
        <Route path="settings/advertisement" element={<AdvertisementPage />} />
        <Route path="settings/offer-templates" element={<OfferTemplatesPage />} />
        <Route path="orders/*" element={<OrdersPage />} />
        <Route path="products/*" element={<ProductsPage />} />
        <Route path="team/*" element={<TeamPage />} />
        <Route path="marketing/*" element={<MarketingPage />} />
        <Route path="settings/*" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
    </RollbackProvider>
  );
}

export default AppRoutes;
