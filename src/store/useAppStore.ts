import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSkill, UserStage, UserProfile } from '../types';
import type { Session } from '@supabase/supabase-js';

interface FilterState {
  skills: UserSkill[];
  priceTier: number | null;
  vibes: string[];
}

interface OnboardingData {
  skills: UserSkill[];
  scene: 'INTIMATE' | 'HIGH_ENERGY' | 'ROOFTOP' | 'CULTURAL' | null;
  timing: string[];
}

interface AppState {
  // Auth — display-only, never used as a security gate
  session: Session | null;
  profile: UserProfile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  clearAuth: () => void;

  // User (local onboarding profile — fallback when not logged in)
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  onboardingData: OnboardingData;
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Discovery
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  activeFilters: FilterState;
  setActiveFilters: (filters: FilterState) => void;
  resetFilters: () => void;

  // Saved venues
  savedVenues: string[];
  toggleSavedVenue: (venueId: string) => void;
  isVenueSaved: (venueId: string) => boolean;

  // UI
  isTrendingStripPaused: boolean;
  setTrendingStripPaused: (paused: boolean) => void;

  // Requests
  activeRequests: Array<{
    id: string;
    title: string;
    status: string;
    category: string;
    created_at: string;
  }>;
  setActiveRequests: (requests: AppState['activeRequests']) => void;
  addRequest: (request: AppState['activeRequests'][0]) => void;
}

const DEFAULT_FILTERS: FilterState = {
  skills: [],
  priceTier: null,
  vibes: [],
};

const DEFAULT_ONBOARDING: OnboardingData = {
  skills: [],
  scene: null,
  timing: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth — display-only; security enforcement is in middleware + API routes
      session: null,
      profile: null,
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () => set({ session: null, profile: null }),

      // User (local)
      user: null,
      setUser: (user) => set({ user }),

      // Onboarding
      hasCompletedOnboarding: false,
      onboardingStep: 0,
      onboardingData: { ...DEFAULT_ONBOARDING },
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      updateOnboardingData: (data) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        })),
      completeOnboarding: () => {
        const { onboardingData } = get();
        const userProfile: UserProfile = {
          id: 'local-user',
          skills: onboardingData.skills,
          preferences: {
            scene: onboardingData.scene ?? undefined,
            timing: onboardingData.timing,
          },
          relocation_stage: 'EXPLORING',
        };
        set({
          user: userProfile,
          hasCompletedOnboarding: true,
          onboardingStep: 0,
        });
      },
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          onboardingStep: 0,
          onboardingData: { ...DEFAULT_ONBOARDING },
          user: null,
        }),

      // Discovery
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      activeFilters: { ...DEFAULT_FILTERS },
      setActiveFilters: (filters) => set({ activeFilters: filters }),
      resetFilters: () => set({ activeFilters: { ...DEFAULT_FILTERS } }),

      // Saved venues
      savedVenues: [],
      toggleSavedVenue: (venueId) =>
        set((state) => ({
          savedVenues: state.savedVenues.includes(venueId)
            ? state.savedVenues.filter((id) => id !== venueId)
            : [...state.savedVenues, venueId],
        })),
      isVenueSaved: (venueId) => get().savedVenues.includes(venueId),

      // UI
      isTrendingStripPaused: false,
      setTrendingStripPaused: (paused) => set({ isTrendingStripPaused: paused }),

      // Requests
      activeRequests: [],
      setActiveRequests: (requests) => set({ activeRequests: requests }),
      addRequest: (request) =>
        set((state) => ({
          activeRequests: [request, ...state.activeRequests],
        })),
    }),
    {
      name: 'dalc-app-store',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        onboardingData: state.onboardingData,
        user: state.user,
        savedVenues: state.savedVenues,
        // profile and session are intentionally excluded from localStorage.
        // Auth state rehydrates fresh from Supabase on every mount via AuthListener.
      }),
    }
  )
);
