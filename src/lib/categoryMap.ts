export type IntentType = "relocation" | "business_setup" | "lifestyle" | "unknown";

const relocationKeywords = [
  "move",
  "moving",
  "relocate",
  "relocation",
  "visa",
  "residency",
  "residence visa",
  "golden visa",
  "school",
  "schools",
  "villa",
  "apartment",
  "housing",
  "family",
];

const businessKeywords = [
  "business",
  "company",
  "startup",
  "founder",
  "license",
  "licence",
  "freezone",
  "mainland",
  "incorporate",
  "bank account",
  "setup company",
];

const lifestyleKeywords = [
  "yacht",
  "jet",
  "hotel",
  "stay",
  "stays",
  "book",
  "booking",
  "nightlife",
  "restaurant",
  "club",
  "driver",
  "transport",
  "experience",
  "concierge",
];

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function detectIntentType(userInput: string): IntentType {
  const text = userInput.toLowerCase().trim();

  if (!text) {
    return "unknown";
  }

  if (hasKeyword(text, relocationKeywords)) {
    return "relocation";
  }

  if (hasKeyword(text, businessKeywords)) {
    return "business_setup";
  }

  if (hasKeyword(text, lifestyleKeywords)) {
    return "lifestyle";
  }

  return "unknown";
}