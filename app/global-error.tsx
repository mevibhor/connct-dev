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
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-primary/10 px-4">
      <section className="my-10 mx-auto text-center text-destructive/10 flex flex-col items-center">
        <div className="m-10 animate-[animateIcon_5s_infinite_ease-in-out]">
          <Unlink className="w-8.5 h-8.5 stroke-[2.2] text-destructive" />
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-destructive">
          Whoops! An error occurred
        </h1>
        <p className="text-[14px] opacity-90 max-w-sm text-destructive">
          Something went Wrong. Try Again
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            className="inline-flex border border-destructive bg-background/10 text-destructive hover:bg-destructive/10 cursor-pointer font-medium rounded-lg text-sm w-fit h-10 text-center items-center justify-center"
            onClick={handleRefresh}
          >
            <RotateCw className="animate-spin" />
          </Button>
          {/* Homepage Button */}
          <Button className="inline-flex border border-destructive hover:bg-destructive/10 text-destructive cursor-pointer font-medium rounded-lg text-sm w-fit h-10 text-center bg-background/10">
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
