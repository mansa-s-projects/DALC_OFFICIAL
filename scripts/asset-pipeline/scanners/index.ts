import type { ManifestItem } from '../types.js';
import { scanHotels } from './hotels.js';
import { scanCars } from './cars.js';
import { scanYachts } from './yachts.js';
import { scanJets } from './jets.js';
import { scanVenues } from './venues.js';
import { scanExperiences } from './experiences.js';

export async function runAllScanners(): Promise<ManifestItem[]> {
  const [hotels, cars, yachts, jets, venues, experiences] = await Promise.all([
    Promise.resolve(scanHotels()),
    scanCars(),
    scanYachts(),
    scanJets(),
    scanVenues(),
    scanExperiences(),
  ]);

  return [...hotels, ...cars, ...yachts, ...jets, ...venues, ...experiences];
}

export { scanHotels, scanCars, scanYachts, scanJets, scanVenues, scanExperiences };
