import { vi } from 'vitest';

// Silence console.error in tests unless explicitly testing for it
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
