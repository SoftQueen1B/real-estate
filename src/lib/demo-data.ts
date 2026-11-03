import property1 from "@/assets/sample-property-1.jpg";
import property2 from "@/assets/sample-property-2.jpg";
import property3 from "@/assets/sample-property-3.jpg";
import property4 from "@/assets/sample-property-4.jpg";
import agent1 from "@/assets/sample-agent-1.jpg";
import agent2 from "@/assets/sample-agent-2.jpg";
import agent3 from "@/assets/sample-agent-3.jpg";
import agent4 from "@/assets/sample-agent-4.jpg";
import type { AuthUser, BlogPost, Faq, PublicAgent, PublicProperty, Testimonial } from "./types";

export const sampleUser: AuthUser = { id: 0, name: "Sample Administrator", email: "preview@example.com", role: "admin" };
export const sampleAgents: PublicAgent[] = [
  { id: 1, first_name: "Ada", last_name: "Okafor", specialization: "Residential sales", profile_image: agent1 },
  { id: 2, first_name: "Tunde", last_name: "Bello", specialization: "Commercial property", profile_image: agent2 },
  { id: 3, first_name: "Nneka", last_name: "Williams", specialization: "Lettings & management", profile_image: agent3 },
  { id: 4, first_name: "Emeka", last_name: "Obi", specialization: "Land & investment", profile_image: agent4 },
].map((agent) => ({ ...agent, bio: "Sample team profile. A property advisor focused on matching clients with homes and investment opportunities across Nigeria." }));

const propertySeeds = [
  { title: "Contemporary 5-bedroom duplex", slug: "contemporary-lekki-duplex", property_type: "duplex", city: "Lekki", state: "Lagos", bedrooms: 5, bathrooms: 5, price: "285000000", purpose: "sale", image: property1, agent: 1 },
  { title: "Modern 3-bedroom apartment", slug: "modern-port-harcourt-apartment", property_type: "apartment", city: "Port Harcourt", state: "Rivers", bedrooms: 3, bathrooms: 3, price: "6500000", purpose: "rent", image: property2, agent: 3 },
  { title: "Residential plot in a gated estate", slug: "abuja-residential-plot", property_type: "land", city: "Abuja", state: "FCT", bedrooms: 0, bathrooms: 0, price: "45000000", purpose: "sale", image: property3, agent: 4 },
  { title: "Grade A commercial office space", slug: "victoria-island-office", property_type: "office", city: "Victoria Island", state: "Lagos", bedrooms: 0, bathrooms: 4, price: "24000000", purpose: "lease", image: property4, agent: 2 },
  { title: "Spacious family duplex with pool", slug: "ikoyi-family-duplex", property_type: "duplex", city: "Ikoyi", state: "Lagos", bedrooms: 4, bathrooms: 4, price: "18000000", purpose: "rent", image: property1, agent: 1 },
  { title: "Serviced 2-bedroom city apartment", slug: "garki-serviced-apartment", property_type: "apartment", city: "Abuja", state: "FCT", bedrooms: 2, bathrooms: 2, price: "95000000", purpose: "sale", image: property2, agent: 3 },
  { title: "600 sqm development land", slug: "port-harcourt-development-land", property_type: "land", city: "Port Harcourt", state: "Rivers", bedrooms: 0, bathrooms: 0, price: "32000000", purpose: "sale", image: property3, agent: 4 },
  { title: "Flexible business workspace", slug: "ikeja-business-workspace", property_type: "office", city: "Ikeja", state: "Lagos", bedrooms: 0, bathrooms: 2, price: "12000000", purpose: "rent", image: property4, agent: 2 },
] as const;

export const sampleProperties: PublicProperty[] = propertySeeds.map((seed, index) => ({
  id: index + 1, slug: seed.slug, title: seed.title, property_type: seed.property_type,
  city: seed.city, state: seed.state, bedrooms: seed.bedrooms, bathrooms: seed.bathrooms,
  address_line: "Sample estate address", land_size: "600", floor_area: "240", size_unit: "sqm", parking_spaces: 2,
  description: "Sample listing for preview purposes only. A thoughtfully designed property in an established neighbourhood, with generous space and convenient access to local amenities. Pricing, availability and specifications are illustrative, not an actual offer.",
  cover_image: seed.image, images: [{ id: index + 1, url: seed.image, alt_text: seed.title, is_cover: true }],
  amenities: [{ id: 1, name: "Security" }, { id: 2, name: "Parking" }],
  listing: { id: index + 1, listing_purpose: seed.purpose, price: seed.price, currency: "NGN", price_period: seed.purpose === "sale" ? "one_time" : "yearly", status: "active", is_featured: index < 6, agent: sampleAgents.find((agent) => agent.id === seed.agent) ?? null },
}));

export const samplePosts: BlogPost[] = [
  { id: 1, title: "What to check before buying a home", slug: "what-to-check-before-buying", category: "Buying", excerpt: "A practical look at documents, inspections and budgeting before a property purchase.", featured_image: property1 },
  { id: 2, title: "Finding the right rental property", slug: "finding-the-right-rental", category: "Renting", excerpt: "Location, tenancy terms and the details that make a rental feel like home.", featured_image: property2 },
  { id: 3, title: "Planning your first land investment", slug: "planning-a-land-investment", category: "Investment", excerpt: "Consider access, title verification and your long-term plans before choosing land.", featured_image: property3 },
].map((post) => ({ ...post, published_at: "2026-10-15", content: `${post.excerpt}\n\nThis is a sample article for the frontend preview. Before making a commitment, request independent advice, review the property's documents and arrange an inspection.\n\nYour budget should account for the purchase or rent as well as any agreed fees, maintenance and moving costs. Confirm every term in writing before proceeding.` }));

export const sampleTestimonials: Testimonial[] = [
  { id: 1, name: "Sample buyer", role: "Home buyer · Sample testimonial", content: "The viewing process was clear and well organised, and we found a home that suited our family." },
  { id: 2, name: "Sample landlord", role: "Property owner · Sample testimonial", content: "Regular updates made it easy to follow the letting process and understand the next steps." },
  { id: 3, name: "Sample investor", role: "Investor · Sample testimonial", content: "The team helped us compare locations and consider our longer-term property plans." },
];
export const sampleFaqs: Faq[] = [
  { id: 1, question: "How can I arrange a property inspection?", answer: "Select a property and complete its inspection request form. Live scheduling will be available when the property service is connected." },
  { id: 2, question: "Can I list my property?", answer: "Property owners can submit their details using the List a property page once the live service is available." },
  { id: 3, question: "Are these listings currently available?", answer: "These are sample listings for the frontend preview. Availability, prices and addresses are illustrative." },
  { id: 4, question: "What should I check before buying?", answer: "Arrange an inspection and obtain independent advice on title documents, fees and the proposed contract." },
];

export const sampleEnquiries = [
  { id: 1, name: "Sample buyer A", email: "buyer.a@example.com", phone: "—", property_id: 1, property: sampleProperties[0], message: "I would like to arrange a viewing of the duplex.", enquiry_type: "purchase", status: "new", notes: "", created_at: "2026-10-22T09:30:00Z" },
  { id: 2, name: "Sample tenant B", email: "tenant.b@example.com", phone: "—", property_id: 2, property: sampleProperties[1], message: "Please share more details about the apartment.", enquiry_type: "rental", status: "in_progress", notes: "Awaiting preferred viewing date.", created_at: "2026-10-21T14:00:00Z" },
  { id: 3, name: "Sample investor C", email: "investor.c@example.com", phone: "—", property_id: 3, property: sampleProperties[2], message: "Interested in the residential plot and its documents.", enquiry_type: "purchase", status: "new", notes: "", created_at: "2026-10-21T11:15:00Z" },
  { id: 4, name: "Sample business D", email: "business.d@example.com", phone: "—", property_id: 4, property: sampleProperties[3], message: "Can we inspect the office space next week?", enquiry_type: "lease", status: "closed", notes: "Sample enquiry closed.", created_at: "2026-10-20T10:00:00Z" },
].map((row) => ({ ...row, subject: row.message, listing: { id: row.property_id, property: row.property }, internal_notes: row.notes }));

const pages: Record<string, { title: string; content: string }> = {
  "privacy-policy": { title: "Privacy policy", content: "Sample privacy policy — not a final legal document.\n\nThis frontend preview does not submit or store enquiry details while the live service is unavailable.\n\nThe final policy should explain how personal information is collected, used, retained and protected, and how clients can exercise their rights." },
  terms: { title: "Terms & conditions", content: "Sample terms — not a final legal document.\n\nAll properties, prices, testimonials and team profiles shown in sample mode are illustrative and are not actual offers.\n\nFinal terms will be provided by the business before the live property service becomes available." },
};

type Row = Record<string, unknown>;
export function paginateSamples<T>(rows: T[], query: Record<string, unknown> = {}) {
  const perPage = Math.max(1, Math.min(100, Number(query["per_page"]) || 12));
  const page = Math.max(1, Number(query["page"]) || 1);
  return { data: rows.slice((page - 1) * perPage, page * perPage), meta: { current_page: page, last_page: Math.max(1, Math.ceil(rows.length / perPage)), per_page: perPage, total: rows.length } };
}

export function filterSampleProperties(query: Record<string, unknown> = {}) {
  const contains = (value: unknown, filter: unknown) => !filter || String(value ?? "").toLowerCase().includes(String(filter).toLowerCase());
  const rows = sampleProperties.filter((property) =>
    contains(`${property.title} ${property.description} ${property.city} ${property.state}`, query["q"]) &&
    contains(property.city, query["city"]) && contains(property.state, query["state"]) &&
    (!query["purpose"] || property.listing?.listing_purpose === query["purpose"]) &&
    (!query["property_type"] || property.property_type === query["property_type"]) &&
    (!query["agent_id"] || property.listing?.agent?.id === Number(query["agent_id"])) &&
    (!query["bedrooms"] || (property.bedrooms ?? 0) >= Number(query["bedrooms"])) &&
    (!query["bathrooms"] || (property.bathrooms ?? 0) >= Number(query["bathrooms"])) &&
    (!query["min_price"] || Number(property.listing?.price) >= Number(query["min_price"])) &&
    (!query["max_price"] || Number(property.listing?.price) <= Number(query["max_price"])));
  if (query["sort"] === "price_asc") rows.sort((a, b) => Number(a.listing?.price) - Number(b.listing?.price));
  else if (query["sort"] === "price_desc") rows.sort((a, b) => Number(b.listing?.price) - Number(a.listing?.price));
  else rows.sort((a, b) => b.id - a.id);
  return rows;
}

/** Read-only fixtures; no sample mutations or fabricated authentication responses. */
export function getSampleResponse(path: string, query: Record<string, unknown> = {}): unknown {
  if (path === "/auth/me" || path === "/admin/profile") return sampleUser;
  if (path === "/public/properties") return paginateSamples(filterSampleProperties(query), query);
  if (path === "/public/properties/featured") return paginateSamples(sampleProperties.filter((property) => property.listing?.is_featured), query);
  const propertyMatch = path.match(/^\/public\/properties\/([^/]+)(\/related)?$/);
  if (propertyMatch) {
    const property = sampleProperties.find((row) => row.slug === decodeURIComponent(propertyMatch[1] ?? ""));
    return propertyMatch[2] && property ? paginateSamples(sampleProperties.filter((row) => row.id !== property.id).slice(0, 3), query) : property;
  }
  const publicLists: Record<string, unknown[]> = { agents: sampleAgents, "blog-posts": samplePosts, testimonials: sampleTestimonials, faqs: sampleFaqs, "property-types": [...new Set(sampleProperties.map((row) => row.property_type))] };
  const publicMatch = path.match(/^\/public\/([^/]+)(?:\/([^/]+))?$/);
  if (publicMatch) {
    const name = publicMatch[1] ?? "";
    const id = decodeURIComponent(publicMatch[2] ?? "");
    if (name === "pages") return pages[id];
    const rows = publicLists[name];
    if (rows) return id ? rows.find((item) => { const row = item as Row; return String(row["id"]) === id || row["slug"] === id; }) : paginateSamples(rows, query);
  }
  return undefined;
}