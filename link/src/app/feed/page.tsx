"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/brutalist-button";
import { Plus } from "lucide-react";

interface Post {
  id: string;
  name: string;
  userId: string;
  timestamp: string;
  content: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://mini-linkdin-ktmx.onrender.com/api/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black">FEED</h1>
          <Link href="/CreatePost">
            <Button
              variant="accent"
              size="lg"
              className="flex items-center gap-2 fixed bottom-6 right-6 z-50 shadow-brutalist-lg"
            >
              <Plus size={24} />
              CREATE POST
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="font-bold text-muted-foreground">Loading posts...</p>
        ) : (
          <div className="space-y-0">
            {posts.length === 0 ? (
              <p className="font-bold text-muted-foreground">No posts found.</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  name={post.name || "Anonymous"} // Adjust if username isn't returned
                  userId={post.userId}
                  timestamp={formatTimestamp(post.timestamp)}
                  content={post.content}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};


const formatTimestamp = (ts: string | number) => {
  if (typeof ts === "string") ts = parseInt(ts);
  const date = new Date(ts);
  return date.toLocaleString(); // e.g., "8/6/2025, 1:00 AM"
};

export default Feed;
