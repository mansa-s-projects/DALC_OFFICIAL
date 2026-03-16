export type VenueEntity = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  supplierId: string | null;
  status: string | null;
};

export type VenueCardModel = {
  id: string;
  name: string;
  area: string;
  vibe: string;
};
