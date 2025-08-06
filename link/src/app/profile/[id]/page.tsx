"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { User, Mail, MapPin, Calendar } from "lucide-react";

interface Post {
  id: string;
  name: string;
  userId: string;
  timestamp: string;
  content: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  joinDate: string;
  posts: Post[];
}

const Profile = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // For editing bio
  const [editing, setEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Get logged-in userId from localStorage
  const loggedInUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`http://localhost:3001/api/users/${userId}`),
          fetch(`http://localhost:3001/api/posts`),
        ]);

        if (!userRes.ok || !postsRes.ok) throw new Error("Error fetching data");

        const userData = await userRes.json();
        const postsData: Post[] = await postsRes.json();

        const userPosts = postsData.filter((post) => post.userId === userId);

        setUser({
          id: userId.toString(),
          name: userData.name || "Anonymous",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "Unknown",
          joinDate: new Date(
            userData.createdAt || Date.now()
          ).toLocaleDateString(),
          posts: userPosts,
        });
        setBioInput(userData.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handler to update bio
  const handleBioUpdate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: bioInput }),
      });
      if (!res.ok) throw new Error("Failed to update bio");
      setUser((prev) => (prev ? { ...prev, bio: bioInput } : prev));
      setEditing(false);
    } catch (err) {
      console.error("Error updating bio:", err);
      alert("Failed to update bio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center text-lg font-bold">
          Loading profile...
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center text-lg font-bold text-red-500">
          User not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card border-4 border-foreground shadow-brutalist-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 bg-primary border-4 border-foreground shadow-brutalist flex items-center justify-center">
              <User size={64} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-4">{user.name}</h1>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={16} />
                  <span className="font-bold">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span className="font-bold">{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="font-bold">Joined {user.joinDate}</span>
                </div>
              </div>
              {/* Bio section with edit option */}
              {loggedInUserId === user.id ? (
                <div>
                  {editing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="border rounded p-2 w-full"
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        rows={3}
                        disabled={saving}
                      />
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1 bg-green-600 text-white rounded"
                          onClick={handleBioUpdate}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="px-4 py-1 bg-gray-400 text-white rounded"
                          onClick={() => {
                            setEditing(false);
                            setBioInput(user.bio || "");
                          }}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-bold leading-relaxed">
                        {user.bio}
                      </p>
                      <button
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => setEditing(true)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-foreground font-bold leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Posts Section */}
        <div>
          <h2 className="text-3xl font-black mb-6">POSTS</h2>
          <div className="space-y-0">
            {user.posts.length > 0 ? (
              user.posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  name={user.name}
                  userId={user.id}
                  timestamp={post.timestamp}
                  content={post.content}
                />
              ))
            ) : (
              <p className="text-muted-foreground font-bold">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
