/**
 * Every Laravel endpoint path used by the frontend, in one place.
 * These MUST be reconciled with the backend API contract before release —
 * see API_INTEGRATION.md. Pages import from here; never inline paths.
 */
export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  public: {
    properties: "/public/properties",
    property: (slug: string) => `/public/properties/${encodeURIComponent(slug)}`,
    relatedProperties: (slug: string) => `/public/properties/${encodeURIComponent(slug)}/related`,
    featured: "/public/properties/featured",
    propertyTypes: "/public/property-types",
    agents: "/public/agents",
    agent: (id: string) => `/public/agents/${encodeURIComponent(id)}`,
    testimonials: "/public/testimonials",
    blog: "/public/blog-posts",
    blogPost: (slug: string) => `/public/blog-posts/${encodeURIComponent(slug)}`,
    faqs: "/public/faqs",
    page: (slug: string) => `/public/pages/${encodeURIComponent(slug)}`,
    settings: "/public/settings",
    enquiries: "/public/enquiries",
    inspections: "/public/inspections",
    contact: "/public/contact",
    propertySubmissions: "/public/property-submissions",
  },
  admin: {
    dashboard: "/admin/dashboard",
    amenities: "/admin/amenities",
    propertyImages: (propertyId: string | number) => `/admin/properties/${propertyId}/images`,
    propertyImage: (propertyId: string | number, imageId: string | number) =>
      `/admin/properties/${propertyId}/images/${imageId}`,
    propertyImagesReorder: (propertyId: string | number) =>
      `/admin/properties/${propertyId}/images/reorder`,
    reports: "/admin/reports",
    settings: "/admin/settings",
    profile: "/admin/profile",
    notifications: "/admin/notifications",
    resource: (name: string) => `/admin/${name}`,
    resourceItem: (name: string, id: string | number) => `/admin/${name}/${id}`,
  },
} as const;
