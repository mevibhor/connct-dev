"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";

import { loginSchema, type LoginInput } from "@/validations/auth-schema";
import { useAuthStore } from "@/stores/use-auth-store";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuestRoute } from "@/components/shared/guest-route";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Setup React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test-user@connct.dev", // Pre-filled for easy testing
      password: "test@password123",
    },
  });

  // 2. The API Call & State Update
  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        login(result.user, result.token); // Save to Zustand & LocalStorage
        toast({ title: "Welcome back!", type: "success" });
        router.push("/feed");
      } else {
        toast({ title: result.error || "Login failed", type: "error" });
      }
    } catch (error) {
      toast({ title: `oops! ${error}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestRoute>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col space-y-6">
          {/* Option 1: Login with Email Button (Visual only for now) */}
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            <Mail className="mr-2 h-4 w-4" />
            Log in with Google
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                disabled={isLoading}
                className={`h-11 w-full border-input bg-card text-foreground transition-all duration-300 ease-in-out placeholder:text-muted-foreground focus:border-primary focus-visible:ring-ring ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                disabled={isLoading}
                className={`h-11 w-full border-input bg-card text-foreground transition-all duration-300 ease-in-out placeholder:text-muted-foreground focus:border-primary focus-visible:ring-ring ${
                  errors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                Forget Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full bg-primary font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          {/* Footer / Sign Up */}
          <div className="pt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}
