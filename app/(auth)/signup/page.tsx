"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";

import { signupSchema, type SignupInput } from "@/validations/auth-schema";
import { useAuthStore } from "@/stores/use-auth-store";
import { useToast } from "@/hooks/use-toast";
import { GuestRoute } from "@/components/shared/guest-route";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        login(result.user, result.token);
        toast({ title: "Account created successfully!", type: "success" });
        router.replace("/feed");
      } else {
        toast({ title: result.error || "Signup failed", type: "error" });
      }
    } catch (error) {
      toast({ title: "Network error. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestRoute>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col space-y-6">
          {/* Option 1: Sign up with Google Button (Visual) */}
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full border-border text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            <Mail className="mr-2 h-4 w-4" />
            Sign up with Google
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
            {/* Name Field */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Name"
                {...register("name")}
                disabled={isLoading}
                className={`h-11 w-full border-input bg-card text-foreground transition-all duration-300 ease-in-out placeholder:text-muted-foreground focus:border-primary focus-visible:ring-ring ${
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            {/* Profession Field */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Profession (e.g., Frontend Developer)"
                {...register("profession")}
                disabled={isLoading}
                maxLength={50}
                className={`h-11 w-full border-input bg-card text-foreground transition-all duration-300 ease-in-out placeholder:text-muted-foreground focus:border-primary focus-visible:ring-ring ${
                  errors.profession
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.profession && (
                <p className="text-xs text-destructive">
                  {errors.profession.message}
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

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className={`border-border transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${
                      errors.terms ? "border-destructive" : ""
                    }`}
                  />
                )}
              />
              <label
                htmlFor="terms"
                className="cursor-pointer text-sm leading-none text-muted-foreground select-none"
              >
                I agree to the Terms and Privacy Policy.
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-11 w-full bg-primary font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Footer / Log In Link */}
          <div className="pt-2 text-center text-sm text-muted-foreground">
            Have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}
