"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail } from "lucide-react";

export default function SignupPage() {
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col space-y-6">
        {/* Option 1: Sign up with Email Button */}
        <Button
          variant="outline"
          className="w-full h-11 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
        >
          <Mail className="mr-2 h-4 w-4" />
          Sign up with Email
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
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Name"
              className="w-full h-11 border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-all duration-300 ease-in-out focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              className="w-full h-11 border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-all duration-300 ease-in-out focus:border-primary"
            />
          </div>

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

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="terms"
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-colors duration-300"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground leading-none cursor-pointer select-none"
            >
              I agree to the Terms and Privacy Policy.
            </label>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-4 font-medium transition-all duration-300"
          >
            Continue
          </Button>
        </form>

        {/* Footer / Log In Link */}
        <div className="text-center text-sm text-muted-foreground pt-2">
          Have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-primary transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
