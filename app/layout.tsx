import type { Metadata } from "next";
import "./index.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Connct Dev",
  description: "A platform for developers",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
