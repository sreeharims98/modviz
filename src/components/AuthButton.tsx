import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = supabase.auth;

    // Get initial auth state
    auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  console.log("user", user);

  return (
    <>
      {user ? (
        <Button onClick={handleLogout}>Sign out</Button>
      ) : (
        <Button onClick={handleLogin}>Sign in</Button>
      )}
    </>
  );
}
