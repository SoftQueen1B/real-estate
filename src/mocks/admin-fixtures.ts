/**
 * DEVELOPMENT-ONLY sample records for mock data mode. Never shown when the live API is connected.
 * Field names mirror the admin API contract; related ids point at records in this file.
 */
import type { DashboardData } from "@/types/dashboard";

export type MockRow = Record<string, any>;

const owners: MockRow[] = [
  { id: 1, first_name: "Chukwuma", last_name: "Eze", email: "c.eze@example.com", phone: "+2348030000001", alternate_phone: null, address_line: "12 Admiralty Way", city: "Lekki", state: "Lagos", notes: "Prefers written correspondence." },
  { id: 2, first_name: "Ngozi", last_name: "Amadi", email: "n.amadi@example.com", phone: "+2348030000002", alternate_phone: null, address_line: "7 Trans-Amadi Road", city: "Port Harcourt", state: "Rivers", notes: null },
  { id: 3, first_name: "Musa", last_name: "Ibrahim", email: "m.ibrahim@example.com", phone: "+2348030000003", alternate_phone: "+2348030000004", address_line: "Plot 44, Maitama", city: "Abuja", state: "FCT", notes: null },
  { id: 4, first_name: "Funke", last_name: "Adeniyi", email: "f.adeniyi@example.com", phone: "+2348030000005", alternate_phone: null, address_line: "3 Adeola Odeku Street", city: "Victoria Island", state: "Lagos", notes: "Corporate owner." },
];

const agents: MockRow[] = [
  { id: 1, user_id: null, first_name: "Ada", last_name: "Okafor", email: "ada.okafor@example.com", phone: "+2348031000001", bio: "Residential sales specialist.", profile_image: null, specialization: "Residential sales", status: "active" },
  { id: 2, user_id: null, first_name: "Tunde", last_name: "Bello", email: "tunde.bello@example.com", phone: "+2348031000002", bio: "Commercial property advisor.", profile_image: null, specialization: "Commercial property", status: "active" },
  { id: 3, user_id: null, first_name: "Nneka", last_name: "Williams", email: "nneka.williams@example.com", phone: "+2348031000003", bio: "Lettings and property management.", profile_image: null, specialization: "Lettings & management", status: "active" },
  { id: 4, user_id: null, first_name: "Emeka", last_name: "Obi", email: "emeka.obi@example.com", phone: "+2348031000004", bio: "Land and investment advisor.", profile_image: null, specialization: "Land & investment", status: "inactive" },
];

const properties: MockRow[] = [
  { id: 1, title: "Contemporary 5-bedroom duplex", slug: "contemporary-lekki-duplex", description: "Sample record for development.", property_type: "duplex", owner_id: 1, address_line: "Admiralty Way, Lekki Phase 1", city: "Lekki", state: "Lagos", country: "Nigeria", postal_code: "101245", bedrooms: 5, bathrooms: 5, toilets: 6, parking_spaces: 3, land_size: "600", floor_area: "480", size_unit: "sqm", status: "published", created_at: "2026-09-02T09:00:00Z" },
  { id: 2, title: "Modern 3-bedroom apartment", slug: "modern-port-harcourt-apartment", description: "Sample record for development.", property_type: "apartment", owner_id: 2, address_line: "Trans-Amadi Industrial Layout", city: "Port Harcourt", state: "Rivers", country: "Nigeria", postal_code: "500272", bedrooms: 3, bathrooms: 3, toilets: 4, parking_spaces: 1, land_size: null, floor_area: "140", size_unit: "sqm", status: "published", created_at: "2026-09-10T09:00:00Z" },
  { id: 3, title: "Residential plot in a gated estate", slug: "abuja-residential-plot", description: "Sample record for development.", property_type: "land", owner_id: 3, address_line: "Plot 44, Maitama", city: "Abuja", state: "FCT", country: "Nigeria", postal_code: "900211", bedrooms: 0, bathrooms: 0, toilets: 0, parking_spaces: 0, land_size: "800", floor_area: null, size_unit: "sqm", status: "published", created_at: "2026-09-14T09:00:00Z" },
  { id: 4, title: "Grade A commercial office space", slug: "victoria-island-office", description: "Sample record for development.", property_type: "office", owner_id: 4, address_line: "Adeola Odeku Street", city: "Victoria Island", state: "Lagos", country: "Nigeria", postal_code: "101241", bedrooms: 0, bathrooms: 4, toilets: 6, parking_spaces: 10, land_size: null, floor_area: "320", size_unit: "sqm", status: "published", created_at: "2026-09-18T09:00:00Z" },
  { id: 5, title: "Spacious family duplex with pool", slug: "ikoyi-family-duplex", description: "Sample record for development.", property_type: "duplex", owner_id: 1, address_line: "Bourdillon Road", city: "Ikoyi", state: "Lagos", country: "Nigeria", postal_code: "101233", bedrooms: 4, bathrooms: 4, toilets: 5, parking_spaces: 2, land_size: null, floor_area: "360", size_unit: "sqm", status: "published", created_at: "2026-09-22T09:00:00Z" },
  { id: 6, title: "Serviced 2-bedroom city apartment", slug: "garki-serviced-apartment", description: "Sample record for development.", property_type: "apartment", owner_id: 3, address_line: "Garki Area 11", city: "Abuja", state: "FCT", country: "Nigeria", postal_code: "900103", bedrooms: 2, bathrooms: 2, toilets: 2, parking_spaces: 1, land_size: null, floor_area: "110", size_unit: "sqm", status: "published", created_at: "2026-10-01T09:00:00Z" },
  { id: 7, title: "600 sqm development land", slug: "port-harcourt-development-land", description: "Sample record for development.", property_type: "land", owner_id: 2, address_line: "Rumuola Road", city: "Port Harcourt", state: "Rivers", country: "Nigeria", postal_code: "500102", bedrooms: 0, bathrooms: 0, toilets: 0, parking_spaces: 0, land_size: "600", floor_area: null, size_unit: "sqm", status: "draft", created_at: "2026-10-05T09:00:00Z" },
  { id: 8, title: "Flexible business workspace", slug: "ikeja-business-workspace", description: "Sample record for development.", property_type: "office", owner_id: 4, address_line: "Allen Avenue", city: "Ikeja", state: "Lagos", country: "Nigeria", postal_code: "100271", bedrooms: 0, bathrooms: 2, toilets: 3, parking_spaces: 4, land_size: null, floor_area: "95", size_unit: "sqm", status: "published", created_at: "2026-10-12T09:00:00Z" },
];

const listings: MockRow[] = [
  { id: 1, property_id: 1, listing_purpose: "sale", price: "285000000.00", currency: "NGN", price_period: "one_time", available_from: "2026-11-01", agent_id: 1, is_featured: true, status: "active", created_at: "2026-09-03T09:00:00Z" },
  { id: 2, property_id: 2, listing_purpose: "rent", price: "6500000.00", currency: "NGN", price_period: "yearly", available_from: "2026-11-15", agent_id: 3, is_featured: false, status: "active", created_at: "2026-09-11T09:00:00Z" },
  { id: 3, property_id: 3, listing_purpose: "sale", price: "45000000.00", currency: "NGN", price_period: "one_time", available_from: null, agent_id: 4, is_featured: false, status: "active", created_at: "2026-09-15T09:00:00Z" },
  { id: 4, property_id: 4, listing_purpose: "lease", price: "24000000.00", currency: "NGN", price_period: "yearly", available_from: "2026-12-01", agent_id: 2, is_featured: true, status: "active", created_at: "2026-09-19T09:00:00Z" },
  { id: 5, property_id: 5, listing_purpose: "rent", price: "18000000.00", currency: "NGN", price_period: "yearly", available_from: null, agent_id: 1, is_featured: false, status: "active", created_at: "2026-09-23T09:00:00Z" },
  { id: 6, property_id: 6, listing_purpose: "sale", price: "95000000.00", currency: "NGN", price_period: "one_time", available_from: null, agent_id: 3, is_featured: false, status: "active", created_at: "2026-10-02T09:00:00Z" },
  { id: 7, property_id: 7, listing_purpose: "sale", price: "32000000.00", currency: "NGN", price_period: "one_time", available_from: null, agent_id: 4, is_featured: false, status: "draft", created_at: "2026-10-06T09:00:00Z" },
  { id: 8, property_id: 8, listing_purpose: "rent", price: "12000000.00", currency: "NGN", price_period: "yearly", available_from: "2026-11-20", agent_id: 2, is_featured: false, status: "active", created_at: "2026-10-13T09:00:00Z" },
];

const enquiries: MockRow[] = [
  { id: 1, listing_id: 1, name: "Amaka Nwosu", email: "amaka.nwosu@example.com", phone: "+2348032000001", subject: "Viewing request for the Lekki duplex", message: "I would like to arrange a viewing this week.", preferred_contact_method: "phone", status: "new", assigned_agent_id: null, created_at: "2026-10-26T09:30:00Z" },
  { id: 2, listing_id: 2, name: "David Ajayi", email: "david.ajayi@example.com", phone: "+2348032000002", subject: "Question about the annual rent", message: "Is the rent negotiable for a two-year lease?", preferred_contact_method: "email", status: "in_progress", assigned_agent_id: 3, created_at: "2026-10-25T14:00:00Z" },
  { id: 3, listing_id: 3, name: "Zainab Bello", email: "zainab.bello@example.com", phone: "+2348032000003", subject: "Land documentation enquiry", message: "Could you share the title documents for the plot?", preferred_contact_method: "email", status: "new", assigned_agent_id: null, created_at: "2026-10-25T11:15:00Z" },
  { id: 4, listing_id: 4, name: "Kola Adeyemi", email: "kola.adeyemi@example.com", phone: "+2348032000004", subject: "Office space inspection", message: "Can we inspect the office next Tuesday?", preferred_contact_method: "whatsapp", status: "responded", assigned_agent_id: 2, created_at: "2026-10-24T10:00:00Z" },
];

const inspections: MockRow[] = [
  { id: 1, listing_id: 1, client_id: null, name: "Amaka Nwosu", email: "amaka.nwosu@example.com", phone: "+2348032000001", requested_date: "2026-11-02", requested_time: "10:30", message: "Two adults attending.", status: "confirmed", created_at: "2026-10-26T09:45:00Z" },
  { id: 2, listing_id: 4, client_id: null, name: "Kola Adeyemi", email: "kola.adeyemi@example.com", phone: "+2348032000004", requested_date: "2026-11-03", requested_time: "14:00", message: null, status: "pending", created_at: "2026-10-24T10:30:00Z" },
  { id: 3, listing_id: 6, client_id: null, name: "Bola Yusuf", email: "bola.yusuf@example.com", phone: "+2348032000005", requested_date: "2026-11-04", requested_time: "11:00", message: null, status: "pending", created_at: "2026-10-27T08:15:00Z" },
];

/** Seed data for resources not listed here starts empty in mock mode. */
export const seedTables: Record<string, MockRow[]> = { owners, agents, properties, listings, enquiries, inspections };

export const mockActivity: DashboardData["activity"] = [
  { label: "Sample: property added", detail: "Modern 3-bedroom apartment, Port Harcourt", time: "Sample data", tone: "gold" },
  { label: "Sample: listing published", detail: "Victoria Island office space", time: "Sample data", tone: "wine" },
  { label: "Sample: inspection requested", detail: "Victoria Island office space", time: "Sample data", tone: "blue" },
];
