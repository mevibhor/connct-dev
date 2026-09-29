import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 pt-12 sm:p-6 sm:pt-20">
      {/* Header / Logo Area */}
      <div className="mb-8 flex items-center gap-3">
        {/* Using the SVG from public folder */}
        <Image
          src="/favicon.svg"
          alt="Connct Dev Logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority
        />
        <span className="text-xl font-bold tracking-tight text-foreground">
          Connct Dev
        </span>
      </div>

      {/* Main Content Area (The Card) */}
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}
