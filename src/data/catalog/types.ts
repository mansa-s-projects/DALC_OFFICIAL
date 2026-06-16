export type CatalogSection =
  | "explore"
  | "experiences"
  | "travel"
  | "concierge"
  | "moveToDubai";

export type ExploreSubsection =
  | "restaurants"
  | "beachClubs"
  | "nightClubs"
  | "diningEntertainment";

export type ExperiencesSubsection =
  | "marine"
  | "aerialAdrenaline"
  | "desertAdventure"
  | "wellness"
  | "ticketsCulture"
  | "luxuryLeisure";

export type TravelSubsection = "carRental" | "flights" | "hotels" | "villas" | "privateJets";

export type ConciergeSubsection =
  | "vipReservations"
  | "customPlanning"
  | "lifestyleManagement"
  | "personalRequests";

export type MoveToDubaiSubsection =
  | "visaServices"
  | "companyFormation"
  | "banking"
  | "relocationSupport";

export type CatalogSubsection =
  | ExploreSubsection
  | ExperiencesSubsection
  | TravelSubsection
  | ConciergeSubsection
  | MoveToDubaiSubsection;

export interface CatalogItemStub {
  name: string;
  slug: string;
  section: CatalogSection;
  subsection: CatalogSubsection;
  folderType: string;
  imageFolder: string;
  status: "draft" | "ready" | "published";
  tags: string[];
  shortDescription: string;
  description: string;
}

export interface CatalogSubsectionIndexItem {
  slug: string;
  name: string;
}

export type CatalogSubsectionIndex = CatalogSubsectionIndexItem[];

export interface CatalogManifestMeta {
  generatedAt: string;
  totalManifestItems: number;
  subsectionBuckets: number;
  base: string;
}
