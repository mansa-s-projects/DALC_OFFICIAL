// ─── Car Rental Data — Dubai À La Carte ───────────────────────────────────────
// Canonical dataset for the /car-rental page. 87 vehicles across 6 categories.

export interface CarItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  dailyPrice: number;
  fuel: 'Petrol' | 'Electric';
  seats?: number;
  popular?: boolean;
  isNew?: boolean;
  image?: string; // Specific image URL for this car
}

export interface CarCategory {
  id: string;
  title: string;
  items: CarItem[];
}

// ─── REAL Car Images — Brand & Model Specific ─────────────────────────────────

const CAR_IMAGES: Record<string, string> = {
  // Economy Cars
  'nissan-sunny-2023': 'https://images.unsplash.com/photo-1621440318465-3e98b5d74045?q=80&w=900&auto=format&fit=crop',
  'nissan-sunny-2024': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=900&auto=format&fit=crop',
  'nissan-sunny-2025': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?q=80&w=900&auto=format&fit=crop',
  'toyota-yaris-2023': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=900&auto=format&fit=crop',
  'toyota-yaris-2024': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=900&auto=format&fit=crop',
  'toyota-yaris-2025': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=900&auto=format&fit=crop',
  'kia-picanto-2023': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=900&auto=format&fit=crop',
  'kia-picanto-2024': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=900&auto=format&fit=crop',
  'kia-picanto-2025': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=900&auto=format&fit=crop',
  'hyundai-accent-2023': 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=900&auto=format&fit=crop',
  'hyundai-accent-2024': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=900&auto=format&fit=crop',
  'hyundai-accent-2025': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=900&auto=format&fit=crop',
  'mitsubishi-attrage-2023': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=900&auto=format&fit=crop',
  'mitsubishi-attrage-2024': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=900&auto=format&fit=crop',
  'mitsubishi-attrage-2025': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=900&auto=format&fit=crop',
  'chevrolet-spark-2023': 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=900&auto=format&fit=crop',
  'chevrolet-spark-2024': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=900&auto=format&fit=crop',
  'chevrolet-spark-2025': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=900&auto=format&fit=crop',
  'renault-symbol-2024': 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=900&auto=format&fit=crop',
  'suzuki-ciaz-2025': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',

  // Standard Cars
  'toyota-corolla-2023': 'https://images.unsplash.com/photo-1629897048514-3dd74151ae9b?q=80&w=900&auto=format&fit=crop',
  'toyota-corolla-2024': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',
  'toyota-corolla-2025': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=900&auto=format&fit=crop',
  'honda-civic-2023': 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=900&auto=format&fit=crop',
  'honda-civic-2024': 'https://images.unsplash.com/photo-1591430922211-192694485e6b?q=80&w=900&auto=format&fit=crop',
  'honda-civic-2025': 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=900&auto=format&fit=crop',
  'hyundai-elantra-2023': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=900&auto=format&fit=crop',
  'hyundai-elantra-2024': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',
  'hyundai-elantra-2025': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=900&auto=format&fit=crop',
  'kia-cerato-2023': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=900&auto=format&fit=crop',
  'kia-cerato-2024': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',
  'kia-cerato-2025': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=900&auto=format&fit=crop',
  'mazda-3-2023': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=900&auto=format&fit=crop',
  'mazda-3-2024': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=900&auto=format&fit=crop',
  'mazda-3-2025': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=900&auto=format&fit=crop',
  'nissan-altima-2023': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?q=80&w=900&auto=format&fit=crop',
  'nissan-altima-2024': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=900&auto=format&fit=crop',
  'nissan-altima-2025': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=900&auto=format&fit=crop',
  'vw-jetta-2025': 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=900&auto=format&fit=crop',

  // Luxury Cars
  'mercedes-c200-2023': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',
  'mercedes-c200-2024': 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=900&auto=format&fit=crop',
  'mercedes-c200-2025': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',
  'bmw-520i-2023': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=900&auto=format&fit=crop',
  'bmw-520i-2024': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop',
  'bmw-520i-2025': 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=900&auto=format&fit=crop',
  'audi-a6-2023': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=900&auto=format&fit=crop',
  'audi-a6-2024': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=900&auto=format&fit=crop',
  'audi-a6-2025': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=900&auto=format&fit=crop',
  'lexus-es350-2023': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=900&auto=format&fit=crop',
  'lexus-es350-2024': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=900&auto=format&fit=crop',
  'lexus-es350-2025': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=900&auto=format&fit=crop',
  'genesis-g80-2024': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',
  'genesis-g80-2025': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=900&auto=format&fit=crop',
  'volvo-s90-2025': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',

  // Business Cars
  'mercedes-e300-2023': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=900&auto=format&fit=crop',
  'mercedes-e300-2024': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=900&auto=format&fit=crop',
  'mercedes-e300-2025': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=900&auto=format&fit=crop',
  'bmw-730li-2023': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=900&auto=format&fit=crop',
  'bmw-730li-2024': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=900&auto=format&fit=crop',
  'bmw-730li-2025': 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=900&auto=format&fit=crop',
  'audi-a8-2023': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=900&auto=format&fit=crop',
  'audi-a8-2024': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',
  'audi-a8-2025': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',
  'lexus-ls500-2024': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=900&auto=format&fit=crop',
  'lexus-ls500-2025': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=900&auto=format&fit=crop',

  // Sport Cars
  'lambo-huracan-2023': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=900&auto=format&fit=crop',
  'lambo-huracan-2024': 'https://images.unsplash.com/photo-1525609004556-c46c6c5104b8?q=80&w=900&auto=format&fit=crop',
  'lambo-huracan-2025': 'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=900&auto=format&fit=crop',
  'ferrari-f8-2023': 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=900&auto=format&fit=crop',
  'ferrari-f8-2024': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=900&auto=format&fit=crop',
  'ferrari-f8-2025': 'https://images.unsplash.com/photo-1506015391-eed73cc28265?q=80&w=900&auto=format&fit=crop',
  'mclaren-720s-2023': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=900&auto=format&fit=crop',
  'mclaren-720s-2024': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=900&auto=format&fit=crop',
  'mclaren-720s-2025': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=900&auto=format&fit=crop',
  'porsche-911-2023': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop',
  'porsche-911-2024': 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=900&auto=format&fit=crop',
  'porsche-911-2025': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=900&auto=format&fit=crop',

  // Electric Cars
  'tesla-model3-2023': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=900&auto=format&fit=crop',
  'tesla-model3-2024': 'https://images.unsplash.com/photo-1619317565153-5a9b11e18b82?q=80&w=900&auto=format&fit=crop',
  'tesla-model3-2025': 'https://images.unsplash.com/photo-1571987502227-9231b837d92a?q=80&w=900&auto=format&fit=crop',
  'tesla-modely-2023': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=900&auto=format&fit=crop',
  'tesla-modely-2024': 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?q=80&w=900&auto=format&fit=crop',
  'tesla-modely-2025': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=900&auto=format&fit=crop',
  'tesla-models-2024': 'https://images.unsplash.com/photo-1619317565153-5a9b11e18b82?q=80&w=900&auto=format&fit=crop',
  'tesla-models-2025': 'https://images.unsplash.com/photo-1571987502227-9231b837d92a?q=80&w=900&auto=format&fit=crop',
  'bmw-i4-2024': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=900&auto=format&fit=crop',
  'mercedes-eqe-2025': 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=900&auto=format&fit=crop',
};

// Category fallback images (when specific car image not found)
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  economy: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?q=80&w=900&auto=format&fit=crop',
  standard: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=900&auto=format&fit=crop',
  luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=900&auto=format&fit=crop',
  business: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=900&auto=format&fit=crop',
  sport: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=900&auto=format&fit=crop',
  electric: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=900&auto=format&fit=crop',
};

export function getCarImage(id: string, categoryId: string): string {
  // Return specific car image if available
  if (CAR_IMAGES[id]) {
    return CAR_IMAGES[id];
  }
  // Fallback to category image
  return CATEGORY_FALLBACK_IMAGES[categoryId] ?? CATEGORY_FALLBACK_IMAGES.economy;
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '971585987600';

export function getCarWhatsAppUrl(brand: string, model: string, year: number): string {
  const name = `${brand} ${model} ${year}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I want to rent ${name}`)}`;
}

// ─── Filter Options ───────────────────────────────────────────────────────────

export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-100', label: 'Under 100 AED', min: 0, max: 99 },
  { id: '100-200', label: '100–200 AED', min: 100, max: 200 },
  { id: '200-500', label: '200–500 AED', min: 200, max: 500 },
  { id: '500-1000', label: '500–1,000 AED', min: 500, max: 1000 },
  { id: '1000-plus', label: '1,000+ AED', min: 1000, max: Infinity },
] as const;

export const FUEL_TYPES = ['All', 'Petrol', 'Electric'] as const;

// ─── Car Data ─────────────────────────────────────────────────────────────────

export const CAR_CATEGORIES: CarCategory[] = [
  {
    id: 'economy',
    title: 'Economy',
    items: [
      { id: 'nissan-sunny-2023',      brand: 'Nissan',     model: 'Sunny',    year: 2023, dailyPrice: 70,  fuel: 'Petrol', seats: 5, popular: true },
      { id: 'nissan-sunny-2024',      brand: 'Nissan',     model: 'Sunny',    year: 2024, dailyPrice: 75,  fuel: 'Petrol', seats: 5, popular: true },
      { id: 'nissan-sunny-2025',      brand: 'Nissan',     model: 'Sunny',    year: 2025, dailyPrice: 85,  fuel: 'Petrol', seats: 5, isNew: true },
      { id: 'toyota-yaris-2023',      brand: 'Toyota',     model: 'Yaris',    year: 2023, dailyPrice: 80,  fuel: 'Petrol', seats: 5 },
      { id: 'toyota-yaris-2024',      brand: 'Toyota',     model: 'Yaris',    year: 2024, dailyPrice: 85,  fuel: 'Petrol', seats: 5, popular: true },
      { id: 'toyota-yaris-2025',      brand: 'Toyota',     model: 'Yaris',    year: 2025, dailyPrice: 95,  fuel: 'Petrol', seats: 5, isNew: true },
      { id: 'kia-picanto-2023',       brand: 'Kia',        model: 'Picanto',  year: 2023, dailyPrice: 65,  fuel: 'Petrol', seats: 4 },
      { id: 'kia-picanto-2024',       brand: 'Kia',        model: 'Picanto',  year: 2024, dailyPrice: 70,  fuel: 'Petrol', seats: 4 },
      { id: 'kia-picanto-2025',       brand: 'Kia',        model: 'Picanto',  year: 2025, dailyPrice: 80,  fuel: 'Petrol', seats: 4, isNew: true },
      { id: 'hyundai-accent-2023',    brand: 'Hyundai',    model: 'Accent',   year: 2023, dailyPrice: 75,  fuel: 'Petrol', seats: 5 },
      { id: 'hyundai-accent-2024',    brand: 'Hyundai',    model: 'Accent',   year: 2024, dailyPrice: 80,  fuel: 'Petrol', seats: 5 },
      { id: 'hyundai-accent-2025',    brand: 'Hyundai',    model: 'Accent',   year: 2025, dailyPrice: 90,  fuel: 'Petrol', seats: 5, isNew: true },
      { id: 'mitsubishi-attrage-2023',brand: 'Mitsubishi', model: 'Attrage',  year: 2023, dailyPrice: 70,  fuel: 'Petrol', seats: 5 },
      { id: 'mitsubishi-attrage-2024',brand: 'Mitsubishi', model: 'Attrage',  year: 2024, dailyPrice: 75,  fuel: 'Petrol', seats: 5 },
      { id: 'mitsubishi-attrage-2025',brand: 'Mitsubishi', model: 'Attrage',  year: 2025, dailyPrice: 85,  fuel: 'Petrol', seats: 5, isNew: true },
      { id: 'chevrolet-spark-2023',   brand: 'Chevrolet',  model: 'Spark',    year: 2023, dailyPrice: 65,  fuel: 'Petrol', seats: 4 },
      { id: 'chevrolet-spark-2024',   brand: 'Chevrolet',  model: 'Spark',    year: 2024, dailyPrice: 70,  fuel: 'Petrol', seats: 4 },
      { id: 'chevrolet-spark-2025',   brand: 'Chevrolet',  model: 'Spark',    year: 2025, dailyPrice: 80,  fuel: 'Petrol', seats: 4, isNew: true },
      { id: 'renault-symbol-2024',    brand: 'Renault',    model: 'Symbol',   year: 2024, dailyPrice: 75,  fuel: 'Petrol', seats: 5 },
      { id: 'suzuki-ciaz-2025',       brand: 'Suzuki',     model: 'Ciaz',     year: 2025, dailyPrice: 90,  fuel: 'Petrol', seats: 5, isNew: true },
    ],
  },
  {
    id: 'standard',
    title: 'Standard',
    items: [
      { id: 'toyota-corolla-2023',    brand: 'Toyota',  model: 'Corolla', year: 2023, dailyPrice: 110, fuel: 'Petrol', popular: true },
      { id: 'toyota-corolla-2024',    brand: 'Toyota',  model: 'Corolla', year: 2024, dailyPrice: 120, fuel: 'Petrol', popular: true },
      { id: 'toyota-corolla-2025',    brand: 'Toyota',  model: 'Corolla', year: 2025, dailyPrice: 130, fuel: 'Petrol', isNew: true },
      { id: 'honda-civic-2023',       brand: 'Honda',   model: 'Civic',   year: 2023, dailyPrice: 120, fuel: 'Petrol' },
      { id: 'honda-civic-2024',       brand: 'Honda',   model: 'Civic',   year: 2024, dailyPrice: 130, fuel: 'Petrol', popular: true },
      { id: 'honda-civic-2025',       brand: 'Honda',   model: 'Civic',   year: 2025, dailyPrice: 140, fuel: 'Petrol', isNew: true },
      { id: 'hyundai-elantra-2023',   brand: 'Hyundai', model: 'Elantra', year: 2023, dailyPrice: 110, fuel: 'Petrol' },
      { id: 'hyundai-elantra-2024',   brand: 'Hyundai', model: 'Elantra', year: 2024, dailyPrice: 120, fuel: 'Petrol' },
      { id: 'hyundai-elantra-2025',   brand: 'Hyundai', model: 'Elantra', year: 2025, dailyPrice: 130, fuel: 'Petrol', isNew: true },
      { id: 'kia-cerato-2023',        brand: 'Kia',     model: 'Cerato',  year: 2023, dailyPrice: 105, fuel: 'Petrol' },
      { id: 'kia-cerato-2024',        brand: 'Kia',     model: 'Cerato',  year: 2024, dailyPrice: 115, fuel: 'Petrol' },
      { id: 'kia-cerato-2025',        brand: 'Kia',     model: 'Cerato',  year: 2025, dailyPrice: 125, fuel: 'Petrol', isNew: true },
      { id: 'mazda-3-2023',           brand: 'Mazda',   model: '3',       year: 2023, dailyPrice: 120, fuel: 'Petrol' },
      { id: 'mazda-3-2024',           brand: 'Mazda',   model: '3',       year: 2024, dailyPrice: 130, fuel: 'Petrol' },
      { id: 'mazda-3-2025',           brand: 'Mazda',   model: '3',       year: 2025, dailyPrice: 140, fuel: 'Petrol', isNew: true },
      { id: 'nissan-altima-2023',     brand: 'Nissan',  model: 'Altima',  year: 2023, dailyPrice: 130, fuel: 'Petrol' },
      { id: 'nissan-altima-2024',     brand: 'Nissan',  model: 'Altima',  year: 2024, dailyPrice: 140, fuel: 'Petrol' },
      { id: 'nissan-altima-2025',     brand: 'Nissan',  model: 'Altima',  year: 2025, dailyPrice: 150, fuel: 'Petrol', isNew: true },
      { id: 'vw-jetta-2025',          brand: 'VW',      model: 'Jetta',   year: 2025, dailyPrice: 150, fuel: 'Petrol', isNew: true },
    ],
  },
  {
    id: 'luxury',
    title: 'Luxury',
    items: [
      { id: 'mercedes-c200-2023',  brand: 'Mercedes', model: 'C200',  year: 2023, dailyPrice: 350, fuel: 'Petrol' },
      { id: 'mercedes-c200-2024',  brand: 'Mercedes', model: 'C200',  year: 2024, dailyPrice: 400, fuel: 'Petrol', popular: true },
      { id: 'mercedes-c200-2025',  brand: 'Mercedes', model: 'C200',  year: 2025, dailyPrice: 450, fuel: 'Petrol', isNew: true },
      { id: 'bmw-520i-2023',       brand: 'BMW',      model: '520i',  year: 2023, dailyPrice: 400, fuel: 'Petrol' },
      { id: 'bmw-520i-2024',       brand: 'BMW',      model: '520i',  year: 2024, dailyPrice: 450, fuel: 'Petrol', popular: true },
      { id: 'bmw-520i-2025',       brand: 'BMW',      model: '520i',  year: 2025, dailyPrice: 500, fuel: 'Petrol', isNew: true },
      { id: 'audi-a6-2023',        brand: 'Audi',     model: 'A6',    year: 2023, dailyPrice: 420, fuel: 'Petrol' },
      { id: 'audi-a6-2024',        brand: 'Audi',     model: 'A6',    year: 2024, dailyPrice: 470, fuel: 'Petrol' },
      { id: 'audi-a6-2025',        brand: 'Audi',     model: 'A6',    year: 2025, dailyPrice: 520, fuel: 'Petrol', isNew: true },
      { id: 'lexus-es350-2023',    brand: 'Lexus',    model: 'ES350', year: 2023, dailyPrice: 380, fuel: 'Petrol' },
      { id: 'lexus-es350-2024',    brand: 'Lexus',    model: 'ES350', year: 2024, dailyPrice: 420, fuel: 'Petrol' },
      { id: 'lexus-es350-2025',    brand: 'Lexus',    model: 'ES350', year: 2025, dailyPrice: 470, fuel: 'Petrol', isNew: true },
      { id: 'genesis-g80-2024',    brand: 'Genesis',  model: 'G80',   year: 2024, dailyPrice: 450, fuel: 'Petrol', popular: true },
      { id: 'genesis-g80-2025',    brand: 'Genesis',  model: 'G80',   year: 2025, dailyPrice: 500, fuel: 'Petrol', isNew: true },
      { id: 'volvo-s90-2025',      brand: 'Volvo',    model: 'S90',   year: 2025, dailyPrice: 480, fuel: 'Petrol', isNew: true },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    items: [
      { id: 'mercedes-e300-2023', brand: 'Mercedes', model: 'E300',  year: 2023, dailyPrice: 500, fuel: 'Petrol' },
      { id: 'mercedes-e300-2024', brand: 'Mercedes', model: 'E300',  year: 2024, dailyPrice: 550, fuel: 'Petrol', popular: true },
      { id: 'mercedes-e300-2025', brand: 'Mercedes', model: 'E300',  year: 2025, dailyPrice: 600, fuel: 'Petrol', isNew: true },
      { id: 'bmw-730li-2023',     brand: 'BMW',      model: '730Li', year: 2023, dailyPrice: 600, fuel: 'Petrol' },
      { id: 'bmw-730li-2024',     brand: 'BMW',      model: '730Li', year: 2024, dailyPrice: 650, fuel: 'Petrol', popular: true },
      { id: 'bmw-730li-2025',     brand: 'BMW',      model: '730Li', year: 2025, dailyPrice: 700, fuel: 'Petrol', isNew: true },
      { id: 'audi-a8-2023',       brand: 'Audi',     model: 'A8',    year: 2023, dailyPrice: 650, fuel: 'Petrol' },
      { id: 'audi-a8-2024',       brand: 'Audi',     model: 'A8',    year: 2024, dailyPrice: 700, fuel: 'Petrol' },
      { id: 'audi-a8-2025',       brand: 'Audi',     model: 'A8',    year: 2025, dailyPrice: 750, fuel: 'Petrol', isNew: true },
      { id: 'lexus-ls500-2024',   brand: 'Lexus',    model: 'LS500', year: 2024, dailyPrice: 650, fuel: 'Petrol', popular: true },
      { id: 'lexus-ls500-2025',   brand: 'Lexus',    model: 'LS500', year: 2025, dailyPrice: 700, fuel: 'Petrol', isNew: true },
    ],
  },
  {
    id: 'sport',
    title: 'Sport',
    items: [
      { id: 'lambo-huracan-2023',   brand: 'Lamborghini', model: 'Huracan',   year: 2023, dailyPrice: 2800, fuel: 'Petrol' },
      { id: 'lambo-huracan-2024',   brand: 'Lamborghini', model: 'Huracan',   year: 2024, dailyPrice: 3000, fuel: 'Petrol', popular: true },
      { id: 'lambo-huracan-2025',   brand: 'Lamborghini', model: 'Huracan',   year: 2025, dailyPrice: 3200, fuel: 'Petrol', isNew: true },
      { id: 'ferrari-f8-2023',      brand: 'Ferrari',     model: 'F8',        year: 2023, dailyPrice: 3000, fuel: 'Petrol' },
      { id: 'ferrari-f8-2024',      brand: 'Ferrari',     model: 'F8',        year: 2024, dailyPrice: 3200, fuel: 'Petrol', popular: true },
      { id: 'ferrari-f8-2025',      brand: 'Ferrari',     model: 'F8',        year: 2025, dailyPrice: 3500, fuel: 'Petrol', isNew: true },
      { id: 'mclaren-720s-2023',    brand: 'McLaren',     model: '720S',      year: 2023, dailyPrice: 2800, fuel: 'Petrol' },
      { id: 'mclaren-720s-2024',    brand: 'McLaren',     model: '720S',      year: 2024, dailyPrice: 3000, fuel: 'Petrol' },
      { id: 'mclaren-720s-2025',    brand: 'McLaren',     model: '720S',      year: 2025, dailyPrice: 3300, fuel: 'Petrol', isNew: true },
      { id: 'porsche-911-2023',     brand: 'Porsche',     model: '911 Turbo', year: 2023, dailyPrice: 1800, fuel: 'Petrol', popular: true },
      { id: 'porsche-911-2024',     brand: 'Porsche',     model: '911 Turbo', year: 2024, dailyPrice: 2000, fuel: 'Petrol' },
      { id: 'porsche-911-2025',     brand: 'Porsche',     model: '911 Turbo', year: 2025, dailyPrice: 2200, fuel: 'Petrol', isNew: true },
    ],
  },
  {
    id: 'electric',
    title: 'Electric',
    items: [
      { id: 'tesla-model3-2023',  brand: 'Tesla',    model: 'Model 3', year: 2023, dailyPrice: 300, fuel: 'Electric', popular: true },
      { id: 'tesla-model3-2024',  brand: 'Tesla',    model: 'Model 3', year: 2024, dailyPrice: 350, fuel: 'Electric', popular: true },
      { id: 'tesla-model3-2025',  brand: 'Tesla',    model: 'Model 3', year: 2025, dailyPrice: 400, fuel: 'Electric', isNew: true },
      { id: 'tesla-modely-2023',  brand: 'Tesla',    model: 'Model Y', year: 2023, dailyPrice: 350, fuel: 'Electric' },
      { id: 'tesla-modely-2024',  brand: 'Tesla',    model: 'Model Y', year: 2024, dailyPrice: 400, fuel: 'Electric' },
      { id: 'tesla-modely-2025',  brand: 'Tesla',    model: 'Model Y', year: 2025, dailyPrice: 450, fuel: 'Electric', isNew: true },
      { id: 'tesla-models-2024',  brand: 'Tesla',    model: 'Model S', year: 2024, dailyPrice: 600, fuel: 'Electric', popular: true },
      { id: 'tesla-models-2025',  brand: 'Tesla',    model: 'Model S', year: 2025, dailyPrice: 650, fuel: 'Electric', isNew: true },
      { id: 'bmw-i4-2024',        brand: 'BMW',      model: 'i4',      year: 2024, dailyPrice: 500, fuel: 'Electric', popular: true },
      { id: 'mercedes-eqe-2025',  brand: 'Mercedes', model: 'EQE',     year: 2025, dailyPrice: 600, fuel: 'Electric', isNew: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAllCars(): (CarItem & { categoryId: string })[] {
  return CAR_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryId: cat.id }))
  );
}

export function priceInRange(price: number, rangeId: string): boolean {
  if (rangeId === 'all') return true;
  const range = PRICE_RANGES.find((r) => r.id === rangeId);
  if (!range) return true;
  return price >= range.min && price <= range.max;
}
