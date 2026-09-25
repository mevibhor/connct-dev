"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col space-y-6">
        {/* Option 1: Login with Email Button */}
        <Button
          variant="outline"
          className="w-full h-11 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
        >
          <Mail className="mr-2 h-4 w-4" />
          Log in with Email
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground uppercase">
            Or
          </span>
        </div>

        {/* Option 2: Manual Input Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              className="w-full h-11 border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-all duration-300 ease-in-out focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              className="w-full h-11 border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-all duration-300 ease-in-out focus:border-primary"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Forget Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 font-medium transition-all duration-300"
          >
            Log in
          </Button>
        </form>

        {/* Footer / Sign Up */}
        <div className="text-center text-sm text-muted-foreground pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground hover:text-primary transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
