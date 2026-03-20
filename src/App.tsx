import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './app/router';
import { supabase } from './lib/supabase';
import { getProfile } from './lib/auth';
import { useAppStore } from './store/useAppStore';
import { NotificationsProvider } from './features/notifications/context/NotificationsContext';

const queryClient = new QueryClient();

function AuthListener() {
  const setSession = useAppStore((s) => s.setSession);
  const setProfile = useAppStore((s) => s.setProfile);
  const clearAuth = useAppStore((s) => s.clearAuth);

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getProfile(session.user.id).then((profile) => {
          if (profile) setProfile(profile);
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (profile) setProfile(profile);
        } else {
          clearAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, setProfile, clearAuth]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthListener />
        <NotificationsProvider>
          <AppRouter />
        </NotificationsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
