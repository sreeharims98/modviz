import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export const useGetUser = () => {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  return { user, loading };
};
