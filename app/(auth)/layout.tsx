import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-12 sm:pt-20 bg-background p-4 sm:p-6">
      {/* Header / Logo Area */}
      <div className="mb-8 flex items-center gap-3">
        {/* Using the SVG from public folder */}
        <Image
          src="/images/logo.svg"
          alt="Connct Dev Logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority
        />
        <span className="text-xl font-bold text-foreground tracking-tight">
          Connct Dev
        </span>
      </div>

      {/* Main Content Area (The Card) */}
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
