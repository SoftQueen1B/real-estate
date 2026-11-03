import Link from "next/link";
import { Bath, BedDouble, MapPin, Star } from "lucide-react";
import { formatMoney, humanize, PRICE_PERIOD_LABEL } from "@/lib/format";
import type { PublicProperty } from "@/lib/types";

export function coverOf(p: PublicProperty): string | null {
  return p.cover_image ?? p.images?.find((i) => i.is_cover)?.url ?? p.images?.[0]?.url ?? null;
}

export function PropertyCard({ property }: { property: PublicProperty }) {
  const l = property.listing;
  const cover = coverOf(property);
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <img src={cover} alt={`${property.title} in ${property.city ?? ""}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Photos coming soon</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {l && <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">For {l.listing_purpose}</span>}
          {l?.is_featured && (
            <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-medium text-gold-foreground">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{humanize(property.property_type)}</p>
        <h3 className="line-clamp-1 text-lg font-semibold group-hover:text-primary">{property.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-gold" /> {[property.city, property.state].filter(Boolean).join(", ")}
        </p>
        <div className="flex items-center justify-between border-t pt-3">
          <p className="font-display text-xl text-primary">
            {l ? formatMoney(l.price, l.currency) : "Price on request"}
            {l?.price_period && <span className="text-sm text-muted-foreground"> {PRICE_PERIOD_LABEL[l.price_period] ?? ""}</span>}
          </p>
          <div className="flex gap-3 text-sm text-muted-foreground">
            {property.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{property.bedrooms}</span>}
            {property.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
