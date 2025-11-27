import { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  // MOCK AUTHENTICATION - ALWAYS LOGGED IN AS ADMIN
  const mockUser: User = {
    id: "00000000-0000-0000-0000-000000000000",
    app_metadata: {},
    user_metadata: {
      display_name: "Admin User",
      avatar_url: null,
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;

  const mockSession: Session = {
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    token_type: "bearer",
    user: mockUser,
  };

  const signOut = async () => {
    console.log("Sign out disabled in mock mode");
  };

  return { 
    user: mockUser, 
    session: mockSession, 
    loading: false, 
    isAdmin: true, 
    signOut 
  };
};