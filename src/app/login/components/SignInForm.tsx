"use client";

import { useState } from "react";

interface SignInFormProps {
  onSignIn: (email: string) => void;
  isSigningIn: boolean;
}

export default function SignInForm({ onSignIn, isSigningIn }: SignInFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email.trim()) {
      onSignIn(email);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="emailInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSigningIn && email.trim()) {
              handleSubmit();
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
          disabled={isSigningIn}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSigningIn || !email.trim()}
        className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg ${
          isSigningIn || !email.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {isSigningIn ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sending link...
          </div>
        ) : (
          "Sign in with Email"
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          We'll send you a magic link to sign in securely
        </p>
      </div>
    </div>
  );
}
