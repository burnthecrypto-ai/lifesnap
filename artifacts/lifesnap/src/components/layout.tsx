import { ReactNode } from "react";
import { Link } from "wouter";
import { Menu, Home, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center">
      <div className="w-full max-w-[430px] bg-background border-x border-border/40 min-h-[100dvh] flex flex-col relative shadow-2xl">
        <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-lg z-50 border-b border-border/40">
          <Link href="/" className="font-bold text-lg tracking-tight text-foreground flex items-center gap-2" data-testid="link-home">
            <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent animate-pulse" />
            LifeSnap
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-l-border/40">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors" data-testid="link-nav-home">
                  <Home className="w-5 h-5 text-primary" /> Home
                </Link>
                <Link href="/snapshots" className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-muted rounded-md transition-colors" data-testid="link-nav-snapshots">
                  <List className="w-5 h-5 text-secondary" /> My Snapshots
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 flex flex-col overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
