import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main container: Centers the app and limits max width on huge screens
    <div className="mx-auto flex min-h-screen max-w-7xl">
      {/* LEFT SIDEBAR 
          - Hidden on mobile (default)
          - Visible on medium screens and up (md:flex)
          - Fixed width, sticky so it doesn't scroll with the feed
      */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border md:flex md:w-64 lg:w-72">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT 
          - Takes up all remaining space (flex-1)
          - min-w-0 prevents flexbox overflow issues
      */}
      <main className="min-w-0 flex-1 border-r border-border pb-20 md:pb-0">
        {children}
      </main>

      {/* RIGHT PANEL 
          - Hidden on mobile and tablet (default)
          - Visible on large screens (lg:block)
          - Fixed width, sticky
      */}
      <aside className="sticky top-0 hidden h-screen overflow-y-auto p-4 xl:block xl:w-80">
        <RightPanel />
      </aside>

      {/* MOBILE BOTTOM NAV 
          - Visible only on mobile (md:hidden)
          - Fixed to the bottom of the screen
      */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-card md:hidden">
        <MobileNav />
      </nav>
    </div>
  );
}
