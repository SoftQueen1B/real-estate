export function pageMeta(title: string, description: string, type: "website" | "article" = "website") {
  const full = `${title} — Lena Real Estate`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

export const noindex = { name: "robots", content: "noindex" };
