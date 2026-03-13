import type { LucideIcon } from 'lucide-react';

export type CategoryItem = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
};

export type ServiceItem = {
  title: string;
  subtitle: string;
  tag: string;
};

export type VenueItem = {
  title: string;
  area: string;
  vibe: string;
};

export type RequestItem = {
  title: string;
  status: 'Pending' | 'In Progress' | 'Assigned';
  eta: string;
};
