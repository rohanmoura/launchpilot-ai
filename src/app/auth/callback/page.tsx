"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getSupabaseClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    async function completeAuth() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setMessage("Supabase is not configured.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const errorDescription =
        params.get("error_description") ?? params.get("error");

      if (errorDescription) {
        setMessage(errorDescription);
        return;
      }

      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          const { data } = await supabase.auth.getSession();

          if (!data.session) {
            setMessage(
              "Sign-in could not be completed. Go back to the home page and try Google sign-in again.",
            );
            return;
          }
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setMessage(
          "No sign-in session was found. Go back to the home page and start sign-in again.",
        );
        return;
      }

      router.replace("/dashboard");
    }

    void completeAuth();
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5ef] px-5 text-[#191816]">
      <div className="rounded-lg border border-black/10 bg-white p-6 text-center shadow-xl shadow-black/5">
        <Loader2 className="mx-auto size-6 animate-spin text-[#14756b]" />
        <h1 className="mt-4 text-xl font-semibold">{message}</h1>
      </div>
    </main>
  );
}
