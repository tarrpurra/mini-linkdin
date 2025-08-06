"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/brutalist-button";
import { Textarea } from "@/components/ui/brutalist-textarea";
import { Label } from "@/components/ui/brutalist-label";
import { ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      // Get userId and name from localStorage
      const userId = localStorage.getItem("userId");
      const name = localStorage.getItem("name") || "Anonymous";

      // Make API call to your backend
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content,
          userId,
          name, // send name as well
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Post creation failed:", err);
        alert("Failed to create post.");
        return;
      }

      // Success
      console.log("Post created");
      alert("Post created successfully!");
      setContent(""); // Clear the textarea
      router.push("/feed"); // Redirect to feed
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong while creating the post.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/feed">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-4xl font-black ">CREATE POST</h1>
        </div>
        <div className="bg-green-300 border-4 border-black brutalist-shadow-lg-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="content" className="block mb-4 text-lg">
                WHATS ON YOUR MIND?
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, insights, or experiences with the community..."
                className="min-h-[200px] text-base border-black brutalist-shadow-lg"
                required
                maxLength={1000}
              />
              <div className="text-right mt-2">
                <span className="text-sm text-muted-foreground font-bold">
                  {content.length}/1000
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="flex-1 text-lg py-3 bg-white border-black brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100"
                disabled={!content.trim()}
                onClick={handleSubmit}
              >
                PUBLISH POST
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 text-lg py-3 bg-white border-black brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100"
                onClick={handleCancel}
              >
                CANCEL
              </Button>
            </div>
          </form>
        </div>
        <div className="mt-6 p-4 bg-muted border-4 border-black brutalist-shadow-lg">
          <h3 className="font-black mb-2 ">💡 POSTING TIPS</h3>
          <ul className="text-sm font-bold text-muted-foreground space-y-1">
            <li>• Be authentic and share your genuine experiences</li>
            <li>• Ask questions to encourage engagement</li>
            <li>• Share insights that could help others</li>
            <li>• Keep it professional but personable</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
