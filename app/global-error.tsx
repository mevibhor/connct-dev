"use client";

import React from "react";
import Link from "next/link";
import { Unlink, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function GlobalErrorPage({ reset }: GlobalErrorPageProps) {
  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-primary/10 px-4">
      <section className="mx-auto my-10 flex flex-col items-center text-center text-destructive/10">
        <div className="m-10 animate-[animateIcon_5s_infinite_ease-in-out]">
          <Unlink className="h-8.5 w-8.5 stroke-[2.2] text-destructive" />
        </div>

        <h1 className="mb-1 text-xl font-bold tracking-tight text-destructive md:text-2xl">
          Whoops! An error occurred
        </h1>
        <p className="max-w-sm text-[14px] text-destructive opacity-90">
          Something went Wrong. Try Again
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            className="inline-flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border border-destructive bg-background/10 text-center text-sm font-medium text-destructive hover:bg-destructive/10"
            onClick={handleRefresh}
          >
            <RotateCw className="animate-spin" />
          </Button>
          {/* Homepage Button */}
          <Button className="inline-flex h-10 w-fit cursor-pointer rounded-lg border border-destructive bg-background/10 text-center text-sm font-medium text-destructive hover:bg-destructive/10">
            <Link href="/" replace={true}>
              <Home />
            </Link>
          </Button>
        </div>
      </section>

      {/* Embedded keyframe definition */}
      <style jsx global>{`
        @keyframes animateIcon {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(2);
          }
        }
      `}</style>
    </main>
  );
}
