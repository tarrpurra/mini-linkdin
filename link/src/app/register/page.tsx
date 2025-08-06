"use client";
import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/brutalist-button";
import { Input } from "@/components/ui/brutalist-input";
import { Label } from "@/components/ui/brutalist-label";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Registration failed: ${error.error}`);
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.token); 
    localStorage.setItem("email", email);
    localStorage.setItem("name", name || "Anonymous");
    localStorage.setItem("userId", data.user.uid); 

    alert("Registration successful!");
    window.location.href = "/feed"; // or use useRouter
  } catch (err) {
    console.error("Registration error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <Layout>
      <div className="max-w-md mx-auto ">
        <div className="bg-red-400 border-4 border-black brutalist-shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2">REGISTER</h1>
            <p className="text-muted-foreground font-bold">Connect to Community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block mb-2">
                FULL NAME
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                className="brutalist-shadow-lg border-black"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="block mb-2">
                EMAIL ADDRESS
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                className="brutalist-shadow-lg border-black"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="block mb-2 ">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                className="brutalist-shadow-lg border-black"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="success" className="w-full text-lg py-3 bg-white  border-black brutalist-shadow-lg active:shadow-none active:translate-y-1 transition-all duration-100">
              CREATE ACCOUNT
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted-foreground font-bold">
              Already have an account?{" "}
              <Link 
                href ="/login" 
                className="text-primary font-black hover:underline "
              >
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;