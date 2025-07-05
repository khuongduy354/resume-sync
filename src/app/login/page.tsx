"use client";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "@/components/Toast";
import LoadingSpinner from "./components/LoadingSpinner";
import AuthenticatedDashboard from "./components/AuthenticatedDashboard";
import SignInForm from "./components/SignInForm";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const supabaseRef = useRef(createSupabaseBrowserClient());

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ message, type });
    },
    []
  );

  useEffect(() => {
    let ran = false;
    if (ran) return;

    async function checkSession() {
      setLoading(true);
      try {
        const { data, error } = await supabaseRef.current.auth.getUser();
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || "");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();

    return () => {
      ran = true;
    };
  }, []);

  const signInWithEmail = useCallback(
    async function signInWithEmail(email: string) {
      if (!email.trim()) {
        showToast("Please enter a valid email address", "error");
        return;
      }

      setIsSigningIn(true);
      try {
        const redirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
        console.log(redirectUrl);
        const { data, error } = await supabaseRef.current.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) {
          console.error("Error signing in:", error);
          showToast(`Error signing in: ${error.message}`, "error");
        } else {
          showToast("Check your email for the sign-in link! 📧", "success");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        showToast("An unexpected error occurred. Please try again.", "error");
      } finally {
        setIsSigningIn(false);
      }
    },
    [showToast]
  );

  const signOut = useCallback(
    async function signOut() {
      try {
        const { error } = await supabaseRef.current.auth.signOut();
        if (error) {
          console.error("Error signing out:", error);
          showToast(`Error signing out: ${error.message}`, "error");
        } else {
          setIsAuthenticated(false);
          setUserEmail("");
          showToast("You have been signed out successfully! 👋", "success");
        }
      } catch (error) {
        console.error("Unexpected error during sign out:", error);
        showToast("An unexpected error occurred during sign out.", "error");
      }
    },
    [showToast]
  );

  const goToMain = useCallback(() => {
    window.location.href = "/main";
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Sync</h1>
          <p className="text-gray-600">
            {isAuthenticated ? "Welcome back!" : "Sign in to your account"}
          </p>
        </div>

        {isAuthenticated ? (
          /* Authenticated User Dashboard */
          <AuthenticatedDashboard
            userEmail={userEmail}
            onGoToMain={goToMain}
            onSignOut={signOut}
          />
        ) : (
          /* Sign In Form */
          <SignInForm onSignIn={signInWithEmail} isSigningIn={isSigningIn} />
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
