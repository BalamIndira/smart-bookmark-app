"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Login Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-gray-100">

        {/* Logo / Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            🔖
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Bookmark Manager
        </h1>

        <p className="text-gray-500 mb-8">
          Save and manage your favorite links securely in one place.
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 px-6 py-3 rounded-xl font-medium text-gray-700 hover:scale-105"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Secure login powered by Supabase
        </p>

      </div>
    </div>
  );
}
