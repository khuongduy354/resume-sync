"use client";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const supabaseRef = useRef(createSupabaseBrowserClient());

  useEffect(() => {
    let ran = false;
    if (ran) return;

    async function checkSession() {
      // check auth
      const { data, error } = await supabaseRef.current.auth.getUser();
      if (data.user) {
        alert("User is authenticated");
      } else {
        alert("User is not authenticated");
      }
    }
    checkSession();

    return () => {
      ran = true;
    };
  }, []);

  const signInWithEmail = useCallback(
    async function signInWithEmail(_email: string) {
      const redirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
      console.log("Redirect URL:", redirectUrl);
      const { data, error } = await supabaseRef.current.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) {
        console.error("Error signing in:", error);
      } else {
        alert("Check your email for the sign-in link!");
      }
    },
    [email]
  );
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signInWithEmail(email)}>Sign in with Email</button>
      <input
        type="email"
        placeholder="Enter your email"
        id="emailInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}
