import { TOURRADAR_OPERATOR_URL, type TourRadarReview, type TourRadarSummary } from "./tourradar-types";

const REVALIDATE_SECONDS = 60 * 60 * 24;

/* Used when TourRadar can't be reached (e.g. at build time offline). Last checked 2026-11-20. */
const FALLBACK: TourRadarSummary = { rating: 4.8, reviewCount: 51, reviews: [] };

const ENTITIES: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };

function decode(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m);
}

function stripTags(html: string): string {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""))
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();
}

function match(source: string, pattern: RegExp): string | null {
  return pattern.exec(source)?.[1] ?? null;
}

export function parseTourRadarPage(html: string): TourRadarSummary | null {
  const count = Number(match(html, /itemprop="reviewCount" content="(\d+)"/));
  const rating = Number(match(html, /itemprop="ratingValue" content="([\d.]+)"/));
  if (!count || !rating) return null;

  const items = html.split(/<li class="ao-clp-operator-reviews__review-item\b/).slice(1);
  const reviews: TourRadarReview[] = [];
  for (const item of items) {
    const body = item.split("</li>")[0];
    const author = match(body, /itemprop="author"[\s\S]*?itemprop="name">([\s\S]*?)<\/p>/);
    const tour = /<h3 itemprop="name"[^>]*><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(body);
    const text = match(body, /itemprop="reviewBody">([\s\S]*?)<\/div>/);
    if (!author || !tour || !text) continue;
    const avatar = match(body, /data-src="(\/\/cdn\.tourradar\.com\/[^"]+)"/);
    reviews.push({
      id: match(body, /data-label="(\d+)"/) ?? `review-${reviews.length}`,
      author: stripTags(author),
      avatar: avatar ? `https:${avatar}` : null,
      date: match(body, /itemprop="datePublished" content="([\d-]+)"/) ?? "",
      rating: Number(match(body, /itemprop="ratingValue" content="([\d.]+)"/)) || 5,
      tourTitle: stripTags(tour[2]),
      tourUrl: new URL(tour[1], "https://www.tourradar.com").toString(),
      text: stripTags(text),
    });
  }
  return { rating, reviewCount: count, reviews };
}

export async function getTourRadarSummary(): Promise<TourRadarSummary> {
  try {
    const res = await fetch(TOURRADAR_OPERATOR_URL, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "accept-language": "en",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return FALLBACK;
    return parseTourRadarPage(await res.text()) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
