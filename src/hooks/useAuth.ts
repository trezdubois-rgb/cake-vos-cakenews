import { useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// MOCK USER FOR TESTING - AUTH DISABLED
const MOCK_USER: User = {
  id: "00000000-0000-0000-0000-000000000000",
  app_metadata: {},
  user_metadata: {
    display_name: "Admin Test",
    email: "admin@test.local"
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "admin@test.local",
} as User;

export const useAuth = () => {
  const [user] = useState<User | null>(MOCK_USER);
  const [session] = useState<Session | null>(null);
  const [loading] = useState(false);
  const [isAdmin] = useState(true);

  const signOut = () => supabase.auth.signOut();

  return { user, session, loading, isAdmin, signOut };
};