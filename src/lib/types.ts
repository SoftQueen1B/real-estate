export interface ImageRef {
  id: number;
  url: string;
  alt_text?: string | null;
  is_cover?: boolean;
  sort_order?: number;
}

export interface PublicAgent {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  specialization?: string | null;
}

/** Public property shape (property + its active listing), as returned by the API. */
export interface PublicProperty {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  property_type: string;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  toilets?: number | null;
  parking_spaces?: number | null;
  land_size?: string | null;
  floor_area?: string | null;
  size_unit?: string | null;
  amenities?: { id: number; name: string }[];
  images?: ImageRef[];
  cover_image?: string | null;
  listing?: {
    id: number;
    listing_purpose: "sale" | "rent" | "lease";
    price: string;
    currency: string;
    price_period?: string | null;
    available_from?: string | null;
    is_featured?: boolean;
    status: string;
    agent?: PublicAgent | null;
  } | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  category?: string | null;
  published_at?: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string | null;
  content: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export type Role =
  | "super_admin"
  | "admin"
  | "property_manager"
  | "agent"
  | "finance_officer";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  permissions?: string[];
}
