import type { User } from "../types"
import { api } from "./api"

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: {
    message?: string
  }
}

export interface DeliverySlotRecord {
  id: string
  name: string
  startTime: string
  endTime: string
  capacity: number
  cutoffTime: string
  isActive: boolean
  days: string[]
  utilizationPercentage?: number
  bookedOrders?: number
}

export interface DeliveryHolidayRecord {
  id: string
  date: string
  name: string
  description?: string
  isActive?: boolean
}

export interface DeliverySlotsPayload {
  settings: {
    cutoffTime: string
    advanceBookingDays: number
    allowSameDayDelivery: boolean
    blockDeliveryOnHolidays: boolean
    enableExpressDelivery: boolean
    weekendDelivery: boolean
  }
  slots: DeliverySlotRecord[]
  holidays: DeliveryHolidayRecord[]
}

export interface ShippingZoneRecord {
  id: string
  name: string
  areas: string[]
  baseCharge: number
  freeDeliveryThreshold: number
  expressCharge: number
  expressDeliveryEnabled: boolean
  isActive: boolean
}

export interface ShippingWeightChargeRecord {
  id?: string
  minWeight: number
  maxWeight: number
  charge: number
  isActive?: boolean
}

export interface ShippingChargesPayload {
  globalSettings: {
    freeDeliveryThreshold: number
    shipmentModel: "hub_only" | "hub_and_store"
    hubDeliveryCharge: number
    storeDeliveryCharge: number
    expressDeliveryEnabled: boolean
    expressDeliveryCharge: number
    weightBasedChargesEnabled: boolean
    surgeChargesEnabled: boolean
    surgeCharge: number
    surgeChargeDescription: string
    weatherAlertAutoEnable: boolean
    weatherAlertSurgeCharge: number
  }
  zones: ShippingZoneRecord[]
  weightBasedCharges: ShippingWeightChargeRecord[]
}

export interface IntegrationRecord {
  id: string
  name: string
  description: string
  connected: boolean
  status: "active" | "inactive" | "error"
  category: "payment" | "communication" | "analytics" | "location"
  configValue?: Record<string, unknown>
  configPreview?: Record<string, string>
}

export interface IntegrationSettingsPayload {
  integrations: IntegrationRecord[]
  summary?: {
    active: number
    error: number
    inactive: number
    total: number
  }
}

export interface WeatherAlertRecord {
  id: string
  condition: string
  threshold: number
  action: string
  isActive: boolean
  message: string
  thresholdUnit?: string
}

export interface WeatherLocationRecord {
  id: string
  name: string
  lat: number
  lng: number
  isActive: boolean
  weather?: {
    condition: string
    temperature: number
  } | null
}

export interface WeatherSettingsPayload {
  weatherSettings: {
    enableWeatherAlerts: boolean
    showWeatherOnDashboard: boolean
    enableDeliveryRestrictions: boolean
    enableCustomerNotifications: boolean
    weatherProvider: string
    updateInterval: number
    temperatureUnit: string
    windSpeedUnit: string
  }
  currentWeather: {
    temperature: number
    humidity: number
    windSpeed: number
    condition: string
    rainfall: number
    visibility: number
    uvIndex: number
    observedAt?: string | null
  }
  weatherAlerts: WeatherAlertRecord[]
  locations: WeatherLocationRecord[]
  impactSummary: {
    suspendedDeliveries: number
    delayedDeliveries: number
    customerNotifications: number
  }
}

export interface ExpiryAlertRecord {
  enabled: boolean
  type?: "loyalty_points" | "wallet_cash"
  alertMethods?: Array<"email" | "sms" | "push" | "whatsapp">
  daysBefore: number
  customMessage?: string
  autoReminder?: boolean
  reminderFrequency?: number
  trackingEnabled?: boolean
  includeClickTracking?: boolean
  expiryDate?: string
  alertType?: "email" | "sms" | "push" | "whatsapp"
  message?: string
}

export interface NotificationTemplateRecord {
  id: string
  name: string
  type: "email" | "sms" | "push" | "whatsapp"
  trigger: string
  subject?: string | null
  content: string
  isActive: boolean
  variables: string[]
}

export interface NotificationSettingsPayload {
  notificationSettings: {
    newOrderAlerts: boolean
    lowStockAlerts: boolean
    paymentFailureAlerts: boolean
    customerSupportAlerts: boolean
    dailySummaryEmail: boolean
    orderStatusUpdates: boolean
    promotionalEmails: boolean
    maintenanceAlerts: boolean
  }
  expiryDateAlert: ExpiryAlertRecord
  loyaltyPointsAlert: Required<Pick<ExpiryAlertRecord,
    "enabled" | "daysBefore" | "customMessage" | "autoReminder" | "reminderFrequency" | "trackingEnabled" | "includeClickTracking">> & {
      type: "loyalty_points"
      alertMethods: Array<"email" | "sms" | "push" | "whatsapp">
    }
  walletCashAlert: Required<Pick<ExpiryAlertRecord,
    "enabled" | "daysBefore" | "customMessage" | "autoReminder" | "reminderFrequency" | "trackingEnabled" | "includeClickTracking">> & {
      type: "wallet_cash"
      alertMethods: Array<"email" | "sms" | "push" | "whatsapp">
    }
  templates: NotificationTemplateRecord[]
  emailConfig: {
    fromName: string
    fromEmail: string
    replyToEmail: string
    emailProvider: string
    emailSignature: string
  }
  smsConfig: {
    senderId: string
    smsProvider: string
    characterLimit: number
  }
}

export interface LegalDocumentRecord {
  id: string
  title: string
  type: "privacy" | "terms" | "refund" | "shipping" | "cookie" | "disclaimer" | "custom"
  content: string
  lastUpdated: string
  version: string
  isActive: boolean
  isRequired: boolean
}

export interface LegalSettingsPayload {
  documents: LegalDocumentRecord[]
  complianceSettings: {
    gdprCompliance: boolean
    ccpaCompliance: boolean
    coppaCompliance: boolean
    requireConsent: boolean
    consentLogging: boolean
    autoUpdateNotification: boolean
  }
}

export interface AdvertisementRecord {
  id: string
  title: string
  type: "festival" | "regular" | "seasonal"
  videoUrl: string
  isActive: boolean
  uploadDate: string
  schedule?: {
    startDate: string
    endDate: string
  } | null
}

export interface AdvertisementSettingsPayload {
  ads: AdvertisementRecord[]
}

export interface OfferTemplateRecord {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  isActive: boolean
  type: "carousel" | "other"
  order: number
}

export interface OfferTemplateSettingsPayload {
  carouselTemplates: OfferTemplateRecord[]
  otherTemplates: OfferTemplateRecord[]
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): T {
  const payload = response.data

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || "Request failed")
  }

  return payload.data
}

export function buildSettingsScopeParams(user?: User | null) {
  if (user?.loginType === "hub" && user.hubId) {
    return {
      moduleScope: "hub",
      hubId: user.hubId,
    }
  }

  if (user?.loginType === "store" && user.storeId) {
    return {
      moduleScope: "store",
      storeId: user.storeId,
    }
  }

  return {
    moduleScope: "global",
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Unable to read file"))
    }

    reader.onerror = () => {
      reject(reader.error || new Error("Unable to read file"))
    }

    reader.readAsDataURL(file)
  })
}

export const settingsBackend = {
  async loadDeliverySlots(user?: User | null) {
    const response = await api.get("/settings/delivery-slots", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<DeliverySlotsPayload>(response)
  },

  async saveDeliverySlots(payload: DeliverySlotsPayload, user?: User | null) {
    const response = await api.put("/settings/delivery-slots", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<DeliverySlotsPayload>(response)
  },

  async loadShippingCharges(user?: User | null) {
    const response = await api.get("/settings/shipping-charges", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<ShippingChargesPayload>(response)
  },

  async saveShippingCharges(payload: ShippingChargesPayload, user?: User | null) {
    const response = await api.put("/settings/shipping-charges", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<ShippingChargesPayload>(response)
  },

  async loadIntegrations(user?: User | null) {
    const response = await api.get("/settings/integrations", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<IntegrationSettingsPayload>(response)
  },

  async saveIntegrations(payload: IntegrationSettingsPayload, user?: User | null) {
    const response = await api.put("/settings/integrations", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<IntegrationSettingsPayload>(response)
  },

  async loadWeather(user?: User | null) {
    const response = await api.get("/settings/weather", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<WeatherSettingsPayload>(response)
  },

  async saveWeather(payload: Pick<WeatherSettingsPayload, "weatherSettings" | "weatherAlerts" | "locations">, user?: User | null) {
    const response = await api.put("/settings/weather", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<WeatherSettingsPayload>(response)
  },

  async loadNotifications(user?: User | null) {
    const response = await api.get("/settings/notifications", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<NotificationSettingsPayload>(response)
  },

  async saveNotifications(payload: NotificationSettingsPayload, user?: User | null) {
    const response = await api.put("/settings/notifications", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<NotificationSettingsPayload>(response)
  },

  async loadLegal(user?: User | null) {
    const response = await api.get("/settings/legal", {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<LegalSettingsPayload>(response)
  },

  async saveLegal(payload: LegalSettingsPayload, user?: User | null) {
    const response = await api.put("/settings/legal", payload, {
      params: buildSettingsScopeParams(user),
    })

    return unwrapResponse<LegalSettingsPayload>(response)
  },

  async loadAdvertisements() {
    const response = await api.get("/settings/advertisements")
    return unwrapResponse<AdvertisementSettingsPayload>(response)
  },

  async saveAdvertisements(payload: AdvertisementSettingsPayload) {
    const response = await api.put("/settings/advertisements", payload)
    return unwrapResponse<AdvertisementSettingsPayload>(response)
  },

  async loadOfferTemplates() {
    const response = await api.get("/settings/offer-templates")
    return unwrapResponse<OfferTemplateSettingsPayload>(response)
  },

  async saveOfferTemplates(payload: OfferTemplateSettingsPayload) {
    const response = await api.put("/settings/offer-templates", payload)
    return unwrapResponse<OfferTemplateSettingsPayload>(response)
  },
}
