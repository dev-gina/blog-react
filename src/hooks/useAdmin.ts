import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export function useAdmin(session: Session | null): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session) return;

    const check = async () => {
      const { data, error } = await supabase
        .from("admin")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (!error && data) setIsAdmin(true);
    };

    check();
  }, [session]);

  return isAdmin;
}
