"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/brutalist-button";
import { Home, User, PlusSquare, LogOut } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);
  const handleProtectedRoute = (href: string) => (e: React.MouseEvent) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      e.preventDefault();
      alert("Please register or login first.");
      router.push("/login");
    }
  };

  // Listen for login event and update state
  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        setUserId(localStorage.getItem("userId") || "1");
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
    router.push("/login");
  };

  return (
    <nav className="border-b-4 border-gray-900 bg-white p-4 brutalist-shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="bg-gray-400 text-white px-3 py-1 border-4 border-gray-900 shadow-lg">
            LINKED
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/feed" onClick={handleProtectedRoute("/feed")}>
            <Button
              variant={isActive("/feed") ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-2 bg-purple-500 bottom-4 border-purple-400 brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100"
            >
              <Home size={16} />
              Feed
            </Button>
          </Link>
          {isLoggedIn && userId && (
            <Link href={`/profile/${userId}`}>
              <Button
                variant={isActive(`/profile/${userId}`) ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2 bg-green-500 bottom-4 border-green-400 brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100"
              >
                <User size={16} />
                Profile
              </Button>
            </Link>
          )}
          <Link href="/CreatePost" onClick={handleProtectedRoute("/feed")}>
            <Button
              variant="outline"
              size="sm"
              className="flex bg-pink-500 bottom-4 border-pink-400 items-center gap-2  active:shadow-none active:translate-y-1 transition-all duration-100"
            >
              <PlusSquare size={16} />
              Create
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-blue-500 bg-blue-300 brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="border-red-500 bg-red-300 brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
