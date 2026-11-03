import { Link } from "@/lib/legacy-router";
import { Award, Eye, HeartHandshake, Target } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";

export function About() {
  return (
    <PublicLayout>
      <PageHero eyebrow="About Lena" title="A trusted partner in every property decision" description="We combine local expertise with a refined, client-first service." />
      <section className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
        <img src={hero} alt="A Lena Real Estate residence" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-elegant" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 text-4xl text-burgundy">Built on trust, driven by results</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">Lena Real Estate was founded to bring clarity and care to property in Nigeria. From first homes to large land acquisitions, we guide clients with honest advice, verified listings and a team that answers the phone.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Today we manage sales, lettings and property portfolios for families, investors and businesses who expect discretion and excellence.</p>
          <Button asChild className="mt-8"><Link to="/contact">Talk to our team</Link></Button>
        </div>
      </section>
      <section className="bg-secondary">
        <div className="container-page grid gap-6 py-20 md:grid-cols-2 lg:grid-cols-4">
          {[[Target, "Mission", "Make property ownership and renting simple, safe and rewarding."], [Eye, "Vision", "To be the most trusted name in premium real estate."], [HeartHandshake, "Integrity", "Transparent fees and honest guidance, always."], [Award, "Excellence", "Exceptional service at every step of the journey."]].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-xl bg-card p-7 shadow-card"><Icon className="h-7 w-7 text-gold" /><h3 className="mt-4 text-xl">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
