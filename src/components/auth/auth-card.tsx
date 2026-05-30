"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, LockKeyhole, LogOut, Sparkles } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { getCurrentSupabaseUser } from "@/lib/blueprint-cloud";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase-client";

type AuthMode = "sign-in" | "sign-up";

export function AuthCard() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    getCurrentSupabaseUser().then(setUser);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function continueWithGoogle() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(getAuthErrorMessage(error));
    }
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();

    if (!supabase || !email.trim() || password.length < 6) {
      toast.error("Use a valid email and a password with at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        email: email.trim(),
        password,
      };
      const { error } =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp({
              ...credentials,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });

      if (error) {
        throw error;
      }

      toast.success(
        mode === "sign-in"
          ? "Signed in successfully"
          : "Account created. Check your email if confirmation is required.",
      );
      setPassword("");
      router.push("/dashboard");
    } catch (authError) {
      toast.error(getAuthErrorMessage(authError));
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-5">
        <LockKeyhole className="size-5 text-[#14756b]" />
        <h2 className="mt-4 text-xl font-semibold">Account setup needed</h2>
        <p className="mt-2 text-sm leading-6 text-[#625d54]">
          Add Supabase keys before account sign-in and credit tracking can run.
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-lg border border-[#14756b]/20 bg-[#e3f0ec] p-5 text-[#103f3a]">
        <CheckCircle2 className="size-6 text-[#14756b]" />
        <h2 className="mt-4 text-xl font-semibold">You are signed in</h2>
        <p className="mt-2 break-words text-sm leading-6 text-[#3f625d]">
          {user.email}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="rounded-md bg-[#191816] text-white">
            <a href="/create">Create blueprint</a>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-md border-[#14756b]/20 bg-transparent"
            onClick={signOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="signin" className="rounded-lg border border-black/10 bg-white p-5 shadow-xl shadow-black/5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#191816] text-white">
          <LockKeyhole className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Sign in to generate blueprints</h2>
          <p className="mt-1 text-sm leading-6 text-[#625d54]">
            Credits, saved plans, and cloud sync are attached to your account.
          </p>
        </div>
      </div>

      <Button
        type="button"
        className="mt-5 h-11 w-full rounded-md bg-[#191816] text-white"
        onClick={continueWithGoogle}
      >
        <Sparkles className="size-4" />
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3 text-xs uppercase text-[#7a746b]">
        <span className="h-px flex-1 bg-black/10" />
        or use email
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form className="space-y-3" onSubmit={handleEmailAuth}>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 rounded-md"
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="h-11 rounded-md"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-md bg-[#14756b] text-white"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-[#14756b]"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
      >
        {mode === "sign-in"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
