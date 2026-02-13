"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Proper Auth Handling
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);
      fetchBookmarks(session.user.id);
      setLoading(false);
    };

    getSession();

    // ✅ Listen for logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push("/");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // 🔹 Fetch Bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // 🔹 Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ]);

    setTitle("");
    setUrl("");
    fetchBookmarks(session.user.id);
  };

  // 🔹 Delete Bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    if (user) fetchBookmarks(user.id);
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </h2>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transform transition duration-200 text-white px-5 py-2 rounded-xl shadow-md"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 rounded-xl w-full shadow-sm"
          />

          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 rounded-xl w-full shadow-sm"
          />

          <button
            onClick={addBookmark}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transform transition duration-200 text-white px-6 py-3 rounded-xl shadow-md"
          >
            Add
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Your Bookmarks
        </h3>

        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center">
            No bookmarks added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center bg-gradient-to-r from-gray-50 to-indigo-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3 md:mb-0 md:w-4/5">
                  <p className="font-semibold text-gray-800 mb-1">
                    {bookmark.title}
                  </p>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm break-all hover:underline block"
                  >
                    {bookmark.url}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
