import type {
  CatalogItemStub,
  CatalogManifestMeta,
  CatalogSection,
  CatalogSubsection,
  CatalogSubsectionIndex,
} from "./types";

const CATALOG_BASE_URL = "/src/data/catalog";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const SECTION_SUBSECTIONS: Record<CatalogSection, CatalogSubsection[]> = {
  explore: ["restaurants", "beachClubs", "nightClubs", "diningEntertainment"],
  experiences: [
    "marine",
    "aerialAdrenaline",
    "desertAdventure",
    "wellness",
    "ticketsCulture",
    "luxuryLeisure",
  ],
  travel: ["carRental", "flights", "hotels", "villas", "privateJets"],
  concierge: ["vipReservations", "customPlanning", "lifestyleManagement", "personalRequests"],
  moveToDubai: ["visaServices", "companyFormation", "banking", "relocationSupport"],
};

function buildPath(path: string, baseUrl = CATALOG_BASE_URL): string {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  return `${normalizedBase}/${normalizedPath}`;
}

async function readJson<T>(path: string, fetcher: FetchLike, baseUrl?: string): Promise<T> {
  const response = await fetcher(buildPath(path, baseUrl));

  if (!response.ok) {
    throw new Error(`Failed to load catalog file: ${path} (HTTP ${response.status})`);
  }

  return (await response.json()) as T;
}

export function getCatalogSections(): CatalogSection[] {
  return Object.keys(SECTION_SUBSECTIONS) as CatalogSection[];
}

export function getSubsectionsForSection(section: CatalogSection): CatalogSubsection[] {
  return [...SECTION_SUBSECTIONS[section]];
}

export async function loadCatalogManifestMeta(
  fetcher: FetchLike = fetch,
  baseUrl?: string
): Promise<CatalogManifestMeta> {
  return readJson<CatalogManifestMeta>("manifest.meta.json", fetcher, baseUrl);
}

export async function loadSubsectionIndex(
  section: CatalogSection,
  subsection: CatalogSubsection,
  fetcher: FetchLike = fetch,
  baseUrl?: string
): Promise<CatalogSubsectionIndex> {
  return readJson<CatalogSubsectionIndex>(`${section}/${subsection}/index.json`, fetcher, baseUrl);
}

export async function loadCatalogItem(
  section: CatalogSection,
  subsection: CatalogSubsection,
  slug: string,
  fetcher: FetchLike = fetch,
  baseUrl?: string
): Promise<CatalogItemStub> {
  return readJson<CatalogItemStub>(`${section}/${subsection}/${slug}.json`, fetcher, baseUrl);
}

export async function listSubsectionItems(
  section: CatalogSection,
  subsection: CatalogSubsection,
  fetcher: FetchLike = fetch,
  baseUrl?: string
): Promise<CatalogItemStub[]> {
  const index = await loadSubsectionIndex(section, subsection, fetcher, baseUrl);
  const items = await Promise.all(
    index.map((entry) => loadCatalogItem(section, subsection, entry.slug, fetcher, baseUrl))
  );

  return items;
}
