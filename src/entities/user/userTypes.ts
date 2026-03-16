export type UserEntity = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: 'user' | 'concierge' | 'admin';
  createdAt: string | null;
};
