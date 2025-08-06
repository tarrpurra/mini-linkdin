"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/brutalist-button";
import { Users, MessageSquare, Share2, Zap } from "lucide-react";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
      setUserId(localStorage.getItem("userId"));
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-slate-600 text-primary-foreground px-8 py-4 border-4 border-black brutalist-shadow-lg mb-8 ">
            <h1 className="text-6xl md:text-8xl text-white font-white tracking-tight">
              LINKED
            </h1>
          </div>

          <h1 className="text-6xl z-10 ab md:text-8xl font-black mb-6 tracking-tight">
            PROFESSIONAL
            <br />
            <span className="bg-amber-400 text-secondary-foreground px-4 py-2 border-4 border-foreground brutalist-shadow-lg">
              NETWORKING
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-muted-foreground mb-12 max-w-2xl mt-4 mx-auto pt-4">
            Connect with professionals, share your thoughts, and build your
            network in a clean, focused environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoggedIn ? (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-blue-500 border4 border-blue-300"
                  >
                    JOIN NOW
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 bg-red-500 border4 border-red-300"
                  >
                    LOGIN
                  </Button>
                </Link>
              </>
            ) : (
              <Link href={userId ? `/profile/${userId}` : "/feed"}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-green-500 border4 border-green-300"
                >
                  GO TO PROFILE
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-pink-400 border-4 border-black t p-6 text-center brutalist-shadow-lg">
            <Users size={48} className="mx-auto mb-4 text-accent-foreground" />
            <h3 className="font-black text-lg mb-2">CONNECT</h3>
            <p className="font-bold text-sm">Network with professionals</p>
          </div>

          <div className="bg-green-400 border-4 border-black  p-6 text-center brutalist-shadow-lg">
            <MessageSquare
              size={48}
              className="mx-auto mb-4 text-secondary-foreground"
            />
            <h3 className="font-black text-lg mb-2">SHARE</h3>
            <p className="font-bold text-sm">Post your thoughts</p>
          </div>

          <div className="bg-purple-400 border-4 border-black brutalist-shadow-lg p-6 text-center">
            <Share2
              size={48}
              className="mx-auto mb-4 text-success-foreground"
            />
            <h3 className="font-black text-lg mb-2">ENGAGE</h3>
            <p className="font-bold text-sm">Build relationships</p>
          </div>

          <div className="bg-amber-400 border-4 border-black brutalist-shadow-lg p-6 text-center">
            <Zap size={48} className="mx-auto mb-4 text-primary-foreground" />
            <h3 className="font-black text-lg mb-2">GROW</h3>
            <p className="font-bold text-sm">Expand your reach</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
