"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  // ✅ Handle Google Login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // works for local + production
      },
    });

    if (error) {
      console.error("Login Error:", error.message);
    }
  };

  // ✅ Check session on page load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard"); // change if your dashboard route is different
      }
    };

    checkSession();

    // ✅ Listen for login after redirect
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/dashboard"); // redirect after login
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-gray-100">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            🔖
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Bookmark Manager
        </h1>

        <p className="text-gray-500 mb-8">
          Save and manage your favorite links securely in one place.
        </p>

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

        <p className="text-xs text-gray-400 mt-8">
          Secure login powered by Supabase
        </p>
      </div>
    </div>
  );
}
