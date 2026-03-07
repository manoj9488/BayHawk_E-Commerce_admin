import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { LogOut, Menu, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { getFilteredMenuByUser, type MenuItem } from '../../utils/menuConfig';

interface SidebarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isMobile, isSidebarOpen, toggleSidebar }: SidebarProps) {
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLElement>(null);

  const menuItems = user ? getFilteredMenuByUser(user.loginType, user.role) : [];

  // Effect to handle clicks outside the sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen, toggleSidebar]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (hasChildren && item.children) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {item.icon ? <item.icon size={20} /> : <span className="w-5 h-5 inline-block" />}
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map(child => (
                <NavLink
                  key={child.id}
                  to={child.path}
                  onClick={isMobile ? toggleSidebar : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  {child.icon ? <child.icon size={18} /> : <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>}
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={isMobile ? toggleSidebar : undefined}
        className={({ isActive }) => `
          flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }
        `}
      >
        {item.icon ? <item.icon size={20} /> : <span className="w-5 h-5 inline-block" />}
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      <aside 
        ref={sidebarRef}
        className={`fixed left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
          top-16 h-[calc(100vh-4rem)]
          lg:top-0 lg:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:w-64
        `}
      >
        {/* Header - Only show on desktop */}
        <div className="hidden lg:flex h-16 items-center justify-between border-b border-slate-700 px-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://bayhawk.clientstagingdemo.com/_next/static/media/BayHawk.207595da.svg" 
              alt="BayHawk" 
              className="h-8 w-auto"
            />
          </div>
        </div>
        
        {/* Module Badge */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-700 lg:border-b">
            <div className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-semibold uppercase text-center">
              {user.loginType === 'super_admin' ? 'Super Admin' : user.loginType === 'hub' ? 'Hub Module' : 'Store Module'}
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto pb-20 lg:pb-0">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={logout}
            title="Logout"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden top-16"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dummy notification data
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #ORD-2024-001 has been placed by customer John Doe",
      time: "2 minutes ago",
      type: "order",
      unread: true
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Fresh Salmon is running low in inventory (5 units left)",
      time: "15 minutes ago",
      type: "inventory",
      unread: true
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of ₹2,450 received for Order #ORD-2024-002",
      time: "1 hour ago",
      type: "payment",
      unread: false
    },
    {
      id: 4,
      title: "Delivery Completed",
      message: "Order #ORD-2024-003 has been successfully delivered",
      time: "2 hours ago",
      type: "delivery",
      unread: false
    },
    {
      id: 5,
      title: "New Customer Registration",
      message: "Sarah Wilson has registered as a new customer",
      time: "3 hours ago",
      type: "customer",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">
            {user?.loginType === 'hub' ? 'Hub Admin' : user?.loginType === 'store' ? 'Store Admin' : 'Super Admin'} Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <span className="text-sm text-gray-500">{unreadCount} unread</span>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
