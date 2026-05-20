import { ReactNode } from "react";
import { Link } from "wouter";
import { Menu, Home, List, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center text-foreground font-sans">
      <div className="w-full max-w-[430px] bg-background border-x border-border/40 min-h-[100dvh] flex flex-col relative shadow-2xl">
        <header className="flex items-center justify-between p-4 sticky top-0 bg-background/90 backdrop-blur-md z-50 border-b border-primary/30 shadow-[0_1px_10px_rgba(255,20,147,0.15)]">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="w-2.5 h-2.5 rounded-full bg-primary glow-pink animate-pulse" />
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl tracking-tight text-white font-sans uppercase">LifeSnap</span>
              <span className="text-[10px] text-accent tracking-widest font-mono uppercase">DAAI007</span>
            </div>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu" className="text-foreground hover:bg-muted hover:text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-l-border/40">
              <SheetHeader>
                <SheetTitle className="text-left text-white font-sans uppercase tracking-widest text-sm">Command Console</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8 font-mono">
                <Link href="/" className="flex items-center gap-3 text-sm p-3 hover:bg-muted rounded-md transition-colors text-white" data-testid="link-nav-home">
                  <Home className="w-4 h-4 text-accent" /> HOME_
                </Link>
                <Link href="/snapshots" className="flex items-center gap-3 text-sm p-3 hover:bg-muted rounded-md transition-colors text-white" data-testid="link-nav-snapshots">
                  <List className="w-4 h-4 text-secondary" /> MY_SNAPSHOTS_
                </Link>
                <div className="w-full h-px bg-border my-2" />
                <Link href="/" className="flex items-center gap-3 text-sm p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors font-bold neon-border-pink border" data-testid="link-nav-founder">
                  <Zap className="w-4 h-4" /> JOIN_FOUNDER_PILOT_
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
