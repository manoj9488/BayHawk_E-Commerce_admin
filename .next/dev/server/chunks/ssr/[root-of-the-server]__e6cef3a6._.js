module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryStockData",
    ()=>categoryStockData,
    "mockCoupons",
    ()=>mockCoupons,
    "mockDashboardStats",
    ()=>mockDashboardStats,
    "mockHubs",
    ()=>mockHubs,
    "mockOrders",
    ()=>mockOrders,
    "mockProducts",
    ()=>mockProducts,
    "mockReports",
    ()=>mockReports,
    "mockTeamMembers",
    ()=>mockTeamMembers,
    "orderStatusData",
    ()=>orderStatusData,
    "salesTrendData",
    ()=>salesTrendData
]);
const mockDashboardStats = {
    totalOrders: 12458,
    totalSales: 2456780,
    totalUsers: 8945,
    totalProducts: 120,
    pendingOrders: 145,
    lowStockItems: 23,
    activeDeliveries: 67,
    todayOrders: 234
};
const mockOrders = [
    {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: {
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            email: "rajesh@email.com",
            address: "123, Gandhi Street, Chennai - 600001"
        },
        items: [
            {
                id: "1",
                productId: "p1",
                name: "Pomfret Fish",
                quantity: 2,
                price: 450,
                unit: "kg"
            },
            {
                id: "2",
                productId: "p2",
                name: "Tiger Prawns",
                quantity: 1,
                price: 650,
                unit: "kg"
            }
        ],
        status: "processing",
        source: "app",
        paymentMethod: "online",
        paymentStatus: "paid",
        total: 1550,
        deliverySlot: "10:00 AM - 12:00 PM",
        assignedTo: "DEL-001",
        hub: "Chennai Central",
        zone: "Zone A",
        createdAt: "2024-01-15T08:30:00Z",
        updatedAt: "2024-01-15T09:00:00Z"
    },
    {
        id: "2",
        orderNumber: "ORD-2024-002",
        customer: {
            name: "Priya Sharma",
            phone: "+91 87654 32109",
            email: "priya@email.com",
            address: "456, Nehru Road, Chennai - 600002"
        },
        items: [
            {
                id: "3",
                productId: "p3",
                name: "Seer Fish",
                quantity: 1,
                price: 580,
                unit: "kg"
            }
        ],
        status: "received",
        source: "whatsapp",
        paymentMethod: "cod",
        paymentStatus: "pending",
        total: 580,
        deliverySlot: "2:00 PM - 4:00 PM",
        hub: "Chennai Central",
        zone: "Zone B",
        createdAt: "2024-01-15T09:15:00Z",
        updatedAt: "2024-01-15T09:15:00Z"
    },
    {
        id: "3",
        orderNumber: "ORD-2024-003",
        customer: {
            name: "Anand Pillai",
            phone: "+91 76543 21098",
            email: "anand@email.com",
            address: "789, MG Road, Chennai - 600003"
        },
        items: [
            {
                id: "4",
                productId: "p4",
                name: "Fresh Salmon",
                quantity: 1,
                price: 800,
                unit: "kg"
            },
            {
                id: "5",
                productId: "p5",
                name: "Crab Meat",
                quantity: 2,
                price: 700,
                unit: "kg"
            }
        ],
        status: "packed",
        source: "web",
        paymentMethod: "online",
        paymentStatus: "paid",
        total: 2200,
        deliverySlot: "4:00 PM - 6:00 PM",
        assignedTo: "DEL-002",
        hub: "Chennai South",
        zone: "Zone C",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T11:30:00Z"
    },
    {
        id: "4",
        orderNumber: "ORD-2024-004",
        customer: {
            name: "Meena Devi",
            phone: "+91 65432 10987",
            email: "meena@email.com",
            address: "321, Anna Salai, Chennai - 600004"
        },
        items: [
            {
                id: "6",
                productId: "p6",
                name: "Squid Rings",
                quantity: 2,
                price: 420,
                unit: "kg"
            }
        ],
        status: "out_for_delivery",
        source: "instagram",
        paymentMethod: "wallet",
        paymentStatus: "paid",
        total: 840,
        deliverySlot: "6:00 AM - 8:00 AM",
        assignedTo: "DEL-003",
        hub: "Chennai Central",
        zone: "Zone A",
        createdAt: "2024-01-15T05:30:00Z",
        updatedAt: "2024-01-15T06:45:00Z"
    },
    {
        id: "5",
        orderNumber: "ORD-2024-005",
        customer: {
            name: "Karthik Rajan",
            phone: "+91 54321 09876",
            email: "karthik@email.com",
            address: "654, Mount Road, Chennai - 600005"
        },
        items: [
            {
                id: "7",
                productId: "p7",
                name: "Tuna Fish",
                quantity: 1,
                price: 520,
                unit: "kg"
            }
        ],
        status: "delivered",
        source: "facebook",
        paymentMethod: "online",
        paymentStatus: "paid",
        total: 520,
        deliverySlot: "10:00 AM - 12:00 PM",
        assignedTo: "DEL-001",
        hub: "Chennai North",
        zone: "Zone D",
        createdAt: "2024-01-14T14:00:00Z",
        updatedAt: "2024-01-14T17:30:00Z"
    }
];
const mockProducts = [
    {
        id: "p1",
        name: "Pomfret Fish",
        sku: "SF-POM-001",
        category: "Fish",
        price: 450,
        unit: "kg",
        stock: 85,
        lowStockThreshold: 20,
        status: "active",
        description: "Fresh white pomfret fish"
    },
    {
        id: "p2",
        name: "Tiger Prawns",
        sku: "SF-PRA-001",
        category: "Prawns",
        price: 650,
        unit: "kg",
        stock: 60,
        lowStockThreshold: 15,
        status: "active",
        description: "Fresh tiger prawns"
    },
    {
        id: "p3",
        name: "Seer Fish",
        sku: "SF-SEE-001",
        category: "Fish",
        price: 580,
        unit: "kg",
        stock: 45,
        lowStockThreshold: 20,
        status: "active",
        description: "Fresh seer fish steaks"
    },
    {
        id: "p4",
        name: "Fresh Salmon",
        sku: "SF-SAL-001",
        category: "Fish",
        price: 800,
        unit: "kg",
        stock: 30,
        lowStockThreshold: 10,
        status: "active",
        description: "Fresh salmon fillets"
    },
    {
        id: "p5",
        name: "Crab Meat",
        sku: "SF-CRA-001",
        category: "Crab",
        price: 700,
        unit: "kg",
        stock: 40,
        lowStockThreshold: 15,
        status: "active",
        description: "Fresh crab meat"
    },
    {
        id: "p6",
        name: "Squid Rings",
        sku: "SF-SQU-001",
        category: "Squid",
        price: 420,
        unit: "kg",
        stock: 55,
        lowStockThreshold: 20,
        status: "active",
        description: "Cleaned squid rings"
    },
    {
        id: "p7",
        name: "Tuna Fish",
        sku: "SF-TUN-001",
        category: "Fish",
        price: 520,
        unit: "kg",
        stock: 38,
        lowStockThreshold: 15,
        status: "active",
        description: "Fresh tuna steaks"
    },
    {
        id: "p8",
        name: "Mackerel Fish",
        sku: "SF-MAC-001",
        category: "Fish",
        price: 280,
        unit: "kg",
        stock: 70,
        lowStockThreshold: 25,
        status: "active",
        description: "Fresh mackerel fish"
    },
    {
        id: "p9",
        name: "Lobster",
        sku: "SF-LOB-001",
        category: "Lobster",
        price: 1200,
        unit: "kg",
        stock: 15,
        lowStockThreshold: 5,
        status: "active",
        description: "Fresh lobster"
    },
    {
        id: "p10",
        name: "Anchovy",
        sku: "SF-ANC-001",
        category: "Fish",
        price: 320,
        unit: "kg",
        stock: 50,
        lowStockThreshold: 20,
        status: "active",
        description: "Fresh anchovy fish"
    },
    {
        id: "p11",
        name: "Chicken Breast",
        sku: "MT-CHK-001",
        category: "Chicken",
        price: 280,
        unit: "kg",
        stock: 60,
        lowStockThreshold: 20,
        status: "active",
        description: "Fresh boneless chicken breast"
    },
    {
        id: "p12",
        name: "Mutton Curry Cut",
        sku: "MT-MUT-001",
        category: "Mutton",
        price: 700,
        unit: "kg",
        stock: 40,
        lowStockThreshold: 15,
        status: "active",
        description: "Fresh mutton curry cut"
    },
    {
        id: "p13",
        name: "Free Range Eggs",
        sku: "EG-FRE-001",
        category: "Egg",
        price: 120,
        unit: "dozen",
        stock: 100,
        lowStockThreshold: 30,
        status: "active",
        description: "Pack of 12 free range eggs"
    },
    {
        id: "p14",
        name: "Turmeric Powder",
        sku: "SP-TUR-001",
        category: "Spices",
        price: 180,
        unit: "kg",
        stock: 150,
        lowStockThreshold: 50,
        status: "active",
        description: "Pure turmeric powder"
    },
    {
        id: "p15",
        name: "Red Chilli Powder",
        sku: "SP-CHI-001",
        category: "Spices",
        price: 200,
        unit: "kg",
        stock: 120,
        lowStockThreshold: 40,
        status: "active",
        description: "Spicy red chilli powder"
    }
];
const mockTeamMembers = [
    {
        id: "TM-001",
        name: "Suresh Kumar",
        email: "suresh@admin.com",
        phone: "+91 98765 43210",
        role: "delivery",
        department: "delivery",
        status: "active",
        assignedOrders: 12,
        completedOrders: 1456,
        rating: 4.8,
        hub: "Chennai Central"
    },
    {
        id: "TM-002",
        name: "Lakshmi Priya",
        email: "lakshmi@admin.com",
        phone: "+91 87654 32109",
        role: "packing",
        department: "packing",
        status: "active",
        assignedOrders: 8,
        completedOrders: 2340,
        hub: "Chennai Central"
    },
    {
        id: "TM-003",
        name: "Murugan S",
        email: "murugan@admin.com",
        phone: "+91 76543 21098",
        role: "procurement",
        department: "procurement",
        status: "active",
        assignedOrders: 0,
        completedOrders: 890,
        hub: "Chennai South"
    },
    {
        id: "TM-004",
        name: "Kavitha R",
        email: "kavitha@admin.com",
        phone: "+91 65432 10987",
        role: "delivery",
        department: "delivery",
        status: "active",
        assignedOrders: 15,
        completedOrders: 1890,
        rating: 4.9,
        hub: "Chennai North"
    }
];
const mockCoupons = [
    {
        id: "CPN-001",
        code: "WELCOME20",
        type: "percentage",
        value: 20,
        minOrderValue: 500,
        maxDiscount: 200,
        validFrom: "2024-01-01",
        validTo: "2024-03-31",
        usageLimit: 1000,
        usedCount: 456,
        status: "active"
    },
    {
        id: "CPN-002",
        code: "FLAT100",
        type: "fixed",
        value: 100,
        minOrderValue: 800,
        validFrom: "2024-01-15",
        validTo: "2024-02-15",
        usageLimit: 500,
        usedCount: 234,
        status: "active"
    }
];
const mockReports = [
    {
        id: "RPT-001",
        name: "Daily Sales Report",
        type: "sales",
        period: "daily",
        generatedAt: "2024-01-15T00:00:00Z",
        status: "ready"
    },
    {
        id: "RPT-002",
        name: "Weekly Stock Report",
        type: "stock",
        period: "weekly",
        generatedAt: "2024-01-14T00:00:00Z",
        status: "ready"
    },
    {
        id: "RPT-003",
        name: "Packing Report",
        type: "packing",
        period: "daily",
        generatedAt: "2024-01-15T00:00:00Z",
        status: "generating"
    }
];
const mockHubs = [
    {
        id: "HUB-001",
        name: "Chennai Central",
        address: "100, Central Hub Road, Chennai - 600001",
        zones: [
            "Zone A",
            "Zone B"
        ],
        status: "active"
    },
    {
        id: "HUB-002",
        name: "Chennai South",
        address: "200, South Hub Road, Chennai - 600020",
        zones: [
            "Zone C",
            "Zone D"
        ],
        status: "active"
    },
    {
        id: "HUB-003",
        name: "Chennai North",
        address: "300, North Hub Road, Chennai - 600050",
        zones: [
            "Zone E",
            "Zone F"
        ],
        status: "active"
    }
];
const salesTrendData = [
    {
        date: "Jan 1",
        sales: 45000,
        orders: 120
    },
    {
        date: "Jan 2",
        sales: 52000,
        orders: 145
    },
    {
        date: "Jan 3",
        sales: 48000,
        orders: 132
    },
    {
        date: "Jan 4",
        sales: 61000,
        orders: 168
    },
    {
        date: "Jan 5",
        sales: 55000,
        orders: 152
    },
    {
        date: "Jan 6",
        sales: 67000,
        orders: 185
    },
    {
        date: "Jan 7",
        sales: 72000,
        orders: 198
    },
    {
        date: "Jan 8",
        sales: 58000,
        orders: 160
    },
    {
        date: "Jan 9",
        sales: 63000,
        orders: 175
    },
    {
        date: "Jan 10",
        sales: 69000,
        orders: 190
    },
    {
        date: "Jan 11",
        sales: 75000,
        orders: 205
    },
    {
        date: "Jan 12",
        sales: 71000,
        orders: 195
    },
    {
        date: "Jan 13",
        sales: 78000,
        orders: 215
    },
    {
        date: "Jan 14",
        sales: 82000,
        orders: 225
    }
];
const orderStatusData = [
    {
        name: "Received",
        value: 145,
        color: "#3b82f6"
    },
    {
        name: "Processing",
        value: 89,
        color: "#f59e0b"
    },
    {
        name: "Packed",
        value: 67,
        color: "#8b5cf6"
    },
    {
        name: "Out for Delivery",
        value: 45,
        color: "#06b6d4"
    },
    {
        name: "Delivered",
        value: 234,
        color: "#10b981"
    }
];
const categoryStockData = [
    {
        category: "Fish",
        stock: 30,
        lowStock: 10
    },
    {
        category: "Chicken",
        stock: 45,
        lowStock: 20
    },
    {
        category: "Mutton",
        stock: 40,
        lowStock: 15
    },
    {
        category: "Egg",
        stock: 100,
        lowStock: 30
    },
    {
        category: "Spices",
        stock: 450,
        lowStock: 150
    }
];
}),
"[project]/lib/store.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProvider",
    ()=>StoreProvider,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// Initial customers
const initialCustomers = [
    {
        id: "CUST-001",
        name: "Rajesh Kumar",
        email: "rajesh@email.com",
        phone: "+91 98765 43210",
        address: "123, Gandhi Street, Chennai",
        ordersCount: 45,
        totalSpent: 12500,
        status: "active",
        createdAt: "2023-06-15"
    },
    {
        id: "CUST-002",
        name: "Priya Sharma",
        email: "priya@email.com",
        phone: "+91 87654 32109",
        address: "456, Nehru Road, Chennai",
        ordersCount: 28,
        totalSpent: 8900,
        status: "active",
        createdAt: "2023-07-20"
    },
    {
        id: "CUST-003",
        name: "Anand Pillai",
        email: "anand@email.com",
        phone: "+91 76543 21098",
        address: "789, MG Road, Chennai",
        ordersCount: 15,
        totalSpent: 4500,
        status: "active",
        createdAt: "2023-09-10"
    }
];
// Initial delivery agents
const initialDeliveryAgents = [
    {
        id: "DEL-001",
        name: "Suresh Kumar",
        email: "suresh@delivery.com",
        phone: "+91 98765 11111",
        vehicleType: "Bike",
        vehicleNumber: "TN-01-AB-1234",
        status: "active",
        verified: true,
        rating: 4.8,
        completedDeliveries: 1456,
        hub: "Chennai Central",
        currentOrders: 3
    },
    {
        id: "DEL-002",
        name: "Ravi Shankar",
        email: "ravi@delivery.com",
        phone: "+91 98765 22222",
        vehicleType: "Bike",
        vehicleNumber: "TN-01-CD-5678",
        status: "on_delivery",
        verified: true,
        rating: 4.6,
        completedDeliveries: 890,
        hub: "Chennai South",
        currentOrders: 5
    },
    {
        id: "DEL-003",
        name: "Kumar M",
        email: "kumar@delivery.com",
        phone: "+91 98765 33333",
        vehicleType: "Scooter",
        vehicleNumber: "TN-02-EF-9012",
        status: "active",
        verified: false,
        rating: 4.2,
        completedDeliveries: 234,
        hub: "Chennai North",
        currentOrders: 2
    }
];
// Initial notifications
const initialNotifications = [
    {
        id: "NOT-001",
        title: "Flash Sale!",
        message: "Get 20% off on all vegetables today!",
        type: "push",
        targetAudience: "All Users",
        status: "sent",
        sentAt: "2024-01-15T10:00:00Z",
        recipients: 5000
    },
    {
        id: "NOT-002",
        title: "New Products",
        message: "Check out our new organic products",
        type: "push",
        targetAudience: "Premium Users",
        status: "scheduled",
        scheduledAt: "2024-01-20T09:00:00Z",
        recipients: 1200
    }
];
// Initial delivery slots
const initialDeliverySlots = [
    {
        id: "SLOT-001",
        name: "Early Morning",
        startTime: "06:00",
        endTime: "08:00",
        maxOrders: 50,
        currentOrders: 35,
        status: "active",
        days: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ]
    },
    {
        id: "SLOT-002",
        name: "Morning",
        startTime: "08:00",
        endTime: "10:00",
        maxOrders: 75,
        currentOrders: 60,
        status: "active",
        days: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ]
    },
    {
        id: "SLOT-003",
        name: "Late Morning",
        startTime: "10:00",
        endTime: "12:00",
        maxOrders: 100,
        currentOrders: 85,
        status: "active",
        days: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ]
    },
    {
        id: "SLOT-004",
        name: "Afternoon",
        startTime: "14:00",
        endTime: "16:00",
        maxOrders: 80,
        currentOrders: 45,
        status: "active",
        days: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ]
    },
    {
        id: "SLOT-005",
        name: "Evening",
        startTime: "16:00",
        endTime: "18:00",
        maxOrders: 90,
        currentOrders: 70,
        status: "active",
        days: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ]
    },
    {
        id: "SLOT-006",
        name: "Night",
        startTime: "18:00",
        endTime: "20:00",
        maxOrders: 60,
        currentOrders: 40,
        status: "inactive",
        days: [
            "Fri",
            "Sat",
            "Sun"
        ]
    }
];
// Initial audit logs
const initialAuditLogs = [
    {
        id: "1",
        action: "Order Status Updated",
        category: "order",
        entityId: "ORD-001",
        entityName: "Order #ORD-001",
        user: {
            name: "Admin User",
            role: "Super Admin"
        },
        changes: [
            {
                field: "status",
                oldValue: "packed",
                newValue: "out_for_delivery"
            }
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        ipAddress: "192.168.1.100",
        canRestore: true
    },
    {
        id: "2",
        action: "Product Price Changed",
        category: "product",
        entityId: "PRD-045",
        entityName: "Fresh Tomatoes",
        user: {
            name: "Procurement Lead",
            role: "Procurement"
        },
        changes: [
            {
                field: "price",
                oldValue: "₹40",
                newValue: "₹45"
            }
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        ipAddress: "192.168.1.105",
        canRestore: true
    },
    {
        id: "3",
        action: "User Deactivated",
        category: "user",
        entityId: "USR-089",
        entityName: "Rajesh Kumar",
        user: {
            name: "Admin User",
            role: "Super Admin"
        },
        changes: [
            {
                field: "status",
                oldValue: "active",
                newValue: "deactivated"
            }
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        ipAddress: "192.168.1.100",
        canRestore: true
    },
    {
        id: "4",
        action: "Delivery Slot Modified",
        category: "settings",
        entityId: "SLOT-003",
        entityName: "Evening Slot",
        user: {
            name: "Operations Manager",
            role: "Operations"
        },
        changes: [
            {
                field: "startTime",
                oldValue: "4:00 PM",
                newValue: "5:00 PM"
            }
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        ipAddress: "192.168.1.110",
        canRestore: true
    },
    {
        id: "5",
        action: "New Team Member Added",
        category: "team",
        entityId: "TM-012",
        entityName: "Priya Sharma",
        user: {
            name: "HR Manager",
            role: "HR"
        },
        changes: [
            {
                field: "department",
                oldValue: "-",
                newValue: "Delivery"
            }
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        ipAddress: "192.168.1.115",
        canRestore: false
    }
];
const StoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function StoreProvider({ children }) {
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockOrders"]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockProducts"]);
    const [teamMembers, setTeamMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockTeamMembers"]);
    const [coupons, setCoupons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockCoupons"]);
    const [hubs, setHubs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockHubs"]);
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialCustomers);
    const [deliveryAgents, setDeliveryAgents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialDeliveryAgents);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialNotifications);
    const [deliverySlots, setDeliverySlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialDeliverySlots);
    const [auditLogs, setAuditLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAuditLogs);
    const [stockMovements, setStockMovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [dashboardStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockDashboardStats"]);
    // Helper to add audit log
    const addAuditLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((log)=>{
        const newLog = {
            ...log,
            id: `audit-${Date.now()}`,
            timestamp: new Date(),
            ipAddress: "192.168.1.100"
        };
        setAuditLogs((prev)=>[
                newLog,
                ...prev
            ]);
    }, []);
    // Order actions
    const addOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((order)=>{
        setOrders((prev)=>[
                order,
                ...prev
            ]);
        addAuditLog({
            action: "Order Created",
            category: "order",
            entityId: order.orderNumber,
            entityName: `Order #${order.orderNumber}`,
            user: {
                name: "Admin User",
                role: "Super Admin"
            },
            changes: [
                {
                    field: "status",
                    oldValue: "-",
                    newValue: order.status
                }
            ],
            canRestore: false
        });
    }, [
        addAuditLog
    ]);
    const updateOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setOrders((prev)=>prev.map((order)=>order.id === id ? {
                    ...order,
                    ...updates,
                    updatedAt: new Date().toISOString()
                } : order));
    }, []);
    const deleteOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setOrders((prev)=>prev.filter((order)=>order.id !== id));
    }, []);
    // Product actions
    const addProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((product)=>{
        setProducts((prev)=>[
                product,
                ...prev
            ]);
        addAuditLog({
            action: "Product Created",
            category: "product",
            entityId: product.sku,
            entityName: product.name,
            user: {
                name: "Admin User",
                role: "Super Admin"
            },
            changes: [
                {
                    field: "stock",
                    oldValue: "-",
                    newValue: String(product.stock)
                }
            ],
            canRestore: false
        });
    }, [
        addAuditLog
    ]);
    const updateProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setProducts((prev)=>prev.map((product)=>product.id === id ? {
                    ...product,
                    ...updates
                } : product));
    }, []);
    const deleteProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        const product = products.find((p)=>p.id === id);
        setProducts((prev)=>prev.filter((p)=>p.id !== id));
        if (product) {
            addAuditLog({
                action: "Product Deleted",
                category: "product",
                entityId: product.sku,
                entityName: product.name,
                user: {
                    name: "Admin User",
                    role: "Super Admin"
                },
                changes: [
                    {
                        field: "status",
                        oldValue: "active",
                        newValue: "deleted"
                    }
                ],
                canRestore: true
            });
        }
    }, [
        products,
        addAuditLog
    ]);
    // Team member actions
    const addTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((member)=>{
        setTeamMembers((prev)=>[
                member,
                ...prev
            ]);
        addAuditLog({
            action: "Team Member Added",
            category: "team",
            entityId: member.id,
            entityName: member.name,
            user: {
                name: "Admin User",
                role: "Super Admin"
            },
            changes: [
                {
                    field: "department",
                    oldValue: "-",
                    newValue: member.department
                }
            ],
            canRestore: false
        });
    }, [
        addAuditLog
    ]);
    const updateTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setTeamMembers((prev)=>prev.map((member)=>member.id === id ? {
                    ...member,
                    ...updates
                } : member));
    }, []);
    const deleteTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setTeamMembers((prev)=>prev.filter((member)=>member.id !== id));
    }, []);
    // Coupon actions
    const addCoupon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((coupon)=>{
        setCoupons((prev)=>[
                coupon,
                ...prev
            ]);
        addAuditLog({
            action: "Coupon Created",
            category: "coupon",
            entityId: coupon.id,
            entityName: coupon.code,
            user: {
                name: "Admin User",
                role: "Super Admin"
            },
            changes: [
                {
                    field: "discount",
                    oldValue: "-",
                    newValue: `${coupon.value}${coupon.type === "percentage" ? "%" : "₹"}`
                }
            ],
            canRestore: false
        });
    }, [
        addAuditLog
    ]);
    const updateCoupon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setCoupons((prev)=>prev.map((coupon)=>coupon.id === id ? {
                    ...coupon,
                    ...updates
                } : coupon));
    }, []);
    const deleteCoupon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setCoupons((prev)=>prev.filter((coupon)=>coupon.id !== id));
    }, []);
    // Hub actions
    const addHub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((hub)=>{
        setHubs((prev)=>[
                hub,
                ...prev
            ]);
    }, []);
    const updateHub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setHubs((prev)=>prev.map((hub)=>hub.id === id ? {
                    ...hub,
                    ...updates
                } : hub));
    }, []);
    const deleteHub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setHubs((prev)=>prev.filter((hub)=>hub.id !== id));
    }, []);
    // Customer actions
    const addCustomer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((customer)=>{
        setCustomers((prev)=>[
                customer,
                ...prev
            ]);
    }, []);
    const updateCustomer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setCustomers((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    ...updates
                } : c));
    }, []);
    const deleteCustomer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setCustomers((prev)=>prev.filter((c)=>c.id !== id));
    }, []);
    // Delivery Agent actions
    const addDeliveryAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((agent)=>{
        setDeliveryAgents((prev)=>[
                agent,
                ...prev
            ]);
    }, []);
    const updateDeliveryAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setDeliveryAgents((prev)=>prev.map((a)=>a.id === id ? {
                    ...a,
                    ...updates
                } : a));
    }, []);
    const deleteDeliveryAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setDeliveryAgents((prev)=>prev.filter((a)=>a.id !== id));
    }, []);
    // Notification actions
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((notification)=>{
        setNotifications((prev)=>[
                notification,
                ...prev
            ]);
    }, []);
    const updateNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setNotifications((prev)=>prev.map((n)=>n.id === id ? {
                    ...n,
                    ...updates
                } : n));
    }, []);
    const deleteNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setNotifications((prev)=>prev.filter((n)=>n.id !== id));
    }, []);
    // Delivery Slot actions
    const addDeliverySlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((slot)=>{
        setDeliverySlots((prev)=>[
                slot,
                ...prev
            ]);
        addAuditLog({
            action: "Delivery Slot Created",
            category: "settings",
            entityId: slot.id,
            entityName: slot.name,
            user: {
                name: "Admin User",
                role: "Super Admin"
            },
            changes: [
                {
                    field: "time",
                    oldValue: "-",
                    newValue: `${slot.startTime} - ${slot.endTime}`
                }
            ],
            canRestore: false
        });
    }, [
        addAuditLog
    ]);
    const updateDeliverySlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setDeliverySlots((prev)=>prev.map((slot)=>slot.id === id ? {
                    ...slot,
                    ...updates
                } : slot));
    }, []);
    const deleteDeliverySlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setDeliverySlots((prev)=>prev.filter((slot)=>slot.id !== id));
    }, []);
    // Restore audit log
    const restoreAuditLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        const log = auditLogs.find((l)=>l.id === id);
        if (log) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Restored: ${log.entityName}`);
            setAuditLogs((prev)=>prev.map((l)=>l.id === id ? {
                        ...l,
                        canRestore: false
                    } : l));
        }
    }, [
        auditLogs
    ]);
    // Stock movement
    const addStockMovement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((movement)=>{
        const newMovement = {
            ...movement,
            id: `MOV-${Date.now()}`,
            timestamp: new Date()
        };
        setStockMovements((prev)=>[
                newMovement,
                ...prev
            ]);
    }, []);
    const updateProductStock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((productId, quantity, type)=>{
        setProducts((prev)=>prev.map((product)=>{
                if (product.id === productId) {
                    let newStock = product.stock;
                    if (type === "add") newStock += quantity;
                    else if (type === "remove") newStock = Math.max(0, newStock - quantity);
                    else newStock = quantity;
                    return {
                        ...product,
                        stock: newStock
                    };
                }
                return product;
            }));
    }, []);
    const value = {
        orders,
        products,
        teamMembers,
        coupons,
        hubs,
        customers,
        deliveryAgents,
        notifications,
        deliverySlots,
        auditLogs,
        stockMovements,
        dashboardStats,
        addOrder,
        updateOrder,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addHub,
        updateHub,
        deleteHub,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addDeliveryAgent,
        updateDeliveryAgent,
        deleteDeliveryAgent,
        addNotification,
        updateNotification,
        deleteNotification,
        addDeliverySlot,
        updateDeliverySlot,
        deleteDeliverySlot,
        addAuditLog,
        restoreAuditLog,
        addStockMovement,
        updateProductStock
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StoreContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/store.tsx",
        lineNumber: 698,
        columnNumber: 10
    }, this);
}
function useStore() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e6cef3a6._.js.map