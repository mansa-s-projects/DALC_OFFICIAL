import type { Country } from './types';

export const COUNTRIES: Country[] = [
  // GCC
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', popular: true, isGCC: true },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', popular: true, isGCC: true },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', isGCC: true },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', isGCC: true },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', isGCC: true },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'Middle East', isGCC: true },
  // Middle East & North Africa
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Middle East', popular: true },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'Middle East' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Middle East', popular: true },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', region: 'Middle East' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', region: 'Middle East' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', region: 'Middle East' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', region: 'Middle East' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa', popular: true },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', region: 'Africa' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', region: 'Africa' },
  // South Asia
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', popular: true },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia', popular: true },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'Asia' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia' },
  // Southeast Asia
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia', popular: true },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', popular: true },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', popular: true },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', popular: true },
  // East Asia
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', popular: true },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', popular: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  // Americas
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', popular: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Americas', popular: true },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Americas' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Americas' },
  // Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', popular: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', popular: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', popular: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', popular: true },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', popular: true },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'Africa' },
];

export const POPULAR_DESTINATIONS = ['AE', 'GB', 'US', 'FR', 'IT', 'JP', 'TH', 'TR', 'MA', 'SG', 'AU', 'DE'];
export const TRENDING_DESTINATIONS = ['AE', 'SA', 'JP', 'TR', 'TH', 'MA', 'GR'];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

export function searchCountries(query: string, exclude: string[] = []): Country[] {
  const q = query.toLowerCase().trim();
  const pool = COUNTRIES.filter(c => !exclude.includes(c.code));
  if (!q) return pool;
  return pool.filter(
    c => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q
  );
}
