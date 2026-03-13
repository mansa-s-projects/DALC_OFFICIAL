import { Bell, Briefcase, Hotel, Martini, Plane, Sun, Ticket, Waves } from 'lucide-react';
import type { CategoryItem, RequestItem, ServiceItem, VenueItem } from './types';

export const CATEGORIES: CategoryItem[] = [
  { title: 'Move To Dubai', subtitle: 'Relocation and life setup', icon: Plane, href: '/move-to-dubai' },
  { title: 'Experiences', subtitle: 'Things to do in Dubai', icon: Sun, href: '/experiences' },
  { title: 'Nightlife', subtitle: 'Clubs and reservations', icon: Martini, href: '/nightlife' },
  { title: 'Travel', subtitle: 'Flights and stays', icon: Hotel, href: '/stays' },
  { title: 'Business Setup', subtitle: 'Launch in Dubai', icon: Briefcase, href: '/business' },
  { title: 'Concierge', subtitle: 'Special requests', icon: Bell, href: '/concierge' },
];

export const EDITORS_PICKS: ServiceItem[] = [
  { title: 'Desert Safari', subtitle: 'Golden-hour convoy and private guide', tag: 'Adventure' },
  { title: 'Helicopter Tour', subtitle: 'Skyline circuit over Palm and Marina', tag: 'Sky' },
  { title: 'VIP Club Table', subtitle: 'Prime floor placement and host support', tag: 'Nightlife' },
  { title: 'Jet Ski', subtitle: 'Open-water ride near Burj Al Arab', tag: 'Water' },
  { title: 'Hot Air Balloon', subtitle: 'Sunrise ascent with desert breakfast', tag: 'Signature' },
];

export const FEATURED_VENUES: VenueItem[] = [
  { title: 'Cove 7 Rooftop', area: 'Downtown', vibe: 'View Dining' },
  { title: 'Luna Marina Club', area: 'Dubai Marina', vibe: 'After-Hours' },
  { title: 'Salt Ember', area: 'Jumeirah', vibe: 'Chef-Led' },
];

export const SAMPLE_REQUESTS: RequestItem[] = [
  { title: 'Private transfer + check-in', status: 'Assigned', eta: '2h' },
  { title: 'Dinner reservation request', status: 'In Progress', eta: '4h' },
  { title: 'Weekend yacht shortlist', status: 'Pending', eta: 'Today' },
];

export const EAGLE_PATH = 'M15 42 C 170 24, 420 26, 640 40 C 780 50, 920 56, 1090 48';

export const EXPLORE_ITEMS = [
  { name: 'Dune Escape', category: 'experiences', icon: Waves },
  { name: 'Skyline Supper', category: 'nightlife', icon: Martini },
  { name: 'Marina Cruise', category: 'travel', icon: Plane },
  { name: 'Palm Retreat', category: 'travel', icon: Hotel },
  { name: 'Palm Circuit', category: 'experiences', icon: Ticket },
  { name: 'Afterglow Lounge', category: 'nightlife', icon: Martini },
] as const;
