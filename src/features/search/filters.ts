export type SearchFilter = {
  key: string;
  value: string;
};

export const SEARCH_FILTER_LABELS: Record<string, string> = {
  venue: 'Venues',
  experience: 'Experiences',
  service: 'Services',
  nightlife: 'Nightlife',
  dining: 'Dining',
  'beach-clubs': 'Beach Clubs',
  stays: 'Travel Stays',
  transport: 'Travel',
  business: 'Business',
  wellness: 'Wellness',
};

export const SEARCH_SUGGESTIONS = [
  'Beach Clubs',
  'Fine Dining',
  'Nightlife',
  'Yacht Charters',
  'Desert',
  'Wellness',
  'Rooftop',
  'Sunset',
  'Private Jets',
  'Michelin',
] as const;

export type SearchSuggestion = typeof SEARCH_SUGGESTIONS[number];
