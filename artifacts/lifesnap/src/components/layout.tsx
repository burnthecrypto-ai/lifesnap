import { ReactNode } from "react";
import { Link } from "wouter";
import { Menu, Home, List, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center text-foreground font-sans">
      <div
        className="w-full max-w-[430px] bg-background min-h-[100dvh] flex flex-col relative"
        style={{
          boxShadow:
            "-1px 0 0 hsl(330 100% 62% / .12), 1px 0 0 hsl(188 100% 54% / .12), 0 0 120px hsl(272 95% 68% / .08)",
        }}
      >
        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-50"
          style={{
            background:
              "linear-gradient(180deg, hsl(240 18% 3% / .98) 0%, hsl(240 18% 2% / .95) 100%)",
            backdropFilter: "blur(24px)",
            borderBottom: "2px solid hsl(330 100% 62% / .45)",
            boxShadow:
              "0 2px 0 hsl(330 100% 62% / .2), 0 4px 24px hsl(330 100% 62% / .15), 0 8px 40px hsl(272 95% 68% / .08)",
          }}
        >
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            {/* Pulsing orb dot */}
            <span
              className="block w-3.5 h-3.5 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(330 100% 80%) 0%, hsl(330 100% 62%) 50%, hsl(330 100% 40%) 100%)",
                boxShadow:
                  "0 0 8px hsl(330 100% 62%), 0 0 22px hsl(330 100% 62% / .7), 0 0 50px hsl(330 100% 62% / .35)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <div className="flex items-baseline gap-2.5">
              <span
                className="font-extrabold text-xl uppercase tracking-tight text-white"
                style={{
                  textShadow:
                    "0 0 18px hsl(0 0% 100% / .6), 0 0 40px hsl(330 100% 62% / .3)",
                }}
              >
                LifeSnap
              </span>
            </div>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-menu"
                className="text-white hover:text-primary transition-colors"
                style={{ "--tw-ring-shadow": "none" } as React.CSSProperties}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px]"
              style={{
                background: "hsl(240 18% 3%)",
                borderLeft: "2px solid hsl(272 95% 68% / .5)",
                boxShadow:
                  "-12px 0 60px hsl(272 95% 68% / .18), -4px 0 20px hsl(330 100% 62% / .1)",
              }}
            >
              <SheetHeader>
                <SheetTitle
                  className="text-left font-extrabold uppercase tracking-widest text-sm text-white"
                  style={{
                    textShadow:
                      "0 0 16px hsl(0 0% 100% / .5), 0 0 40px hsl(330 100% 62% / .25)",
                  }}
                >
                  Command Console
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 mt-8 font-mono">
                <Link
                  href="/"
                  className="flex items-center gap-3 p-3 text-white hover:text-accent transition-all rounded"
                  style={{
                    border: "1px solid hsl(240 10% 18%)",
                    background: "hsl(240 14% 7%)",
                  }}
                  data-testid="link-nav-home"
                >
                  <Home className="w-4 h-4 text-accent" />
                  <span className="tracking-widest uppercase text-xs">Home</span>
                </Link>
                <Link
                  href="/snapshots"
                  className="flex items-center gap-3 p-3 text-white hover:text-secondary transition-all rounded"
                  style={{
                    border: "1px solid hsl(240 10% 18%)",
                    background: "hsl(240 14% 7%)",
                  }}
                  data-testid="link-nav-snapshots"
                >
                  <List className="w-4 h-4 text-secondary" />
                  <span className="tracking-widest uppercase text-xs">My Snapshots</span>
                </Link>
                <div className="section-divider my-1" />
                <Link
                  href="/"
                  className="flex items-center gap-3 p-4 rounded font-bold transition-all btn-dayglo-pink"
                  data-testid="link-nav-founder"
                >
                  <Zap className="w-4 h-4" />
                  <span className="tracking-wider uppercase text-xs">Join Founder Pilot — $39</span>
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
