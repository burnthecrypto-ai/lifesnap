import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mic, Keyboard, Paperclip, Brain, Activity, FileText, BookOpen, CheckSquare, Users, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { ProcessInputMode } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MODES: { value: ProcessInputMode; label: string }[] = [
  { value: "ai_recommended", label: "AI Recommended" },
  { value: "life_admin", label: "Life Admin" },
  { value: "health", label: "Health Appt Prep" },
  { value: "legal", label: "Legal / Incident" },
  { value: "business", label: "Business Build" },
  { value: "legacy", label: "Legacy / Final Admin" },
  { value: "diary", label: "Diary / Reflection" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { selectedMode, setSelectedMode, setInputType } = useApp();
  const { toast } = useToast();

  const handleAction = (type: "talk" | "type") => {
    setInputType(type);
    setLocation("/input");
  };

  const handleUpload = () => {
    toast({
      title: "V2 Feature",
      description: "File upload is coming in the next release.",
    });
  };

  return (
    <div className="flex-1 flex flex-col pb-12 overflow-y-auto">
      
      {/* HERO SECTION */}
      <section className="px-6 pt-10 pb-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-40 h-40 mb-8 flex items-center justify-center"
        >
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-accent opacity-50 glow-cyan"
          />
          {/* Mid Ring */}
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-t-secondary border-r-transparent border-b-secondary border-l-transparent opacity-70 glow-purple"
          />
          {/* Inner Ring */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border-4 border-dotted border-primary opacity-90 glow-pink"
          />
          {/* Core Orb */}
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3 w-full"
        >
          <h1 className="text-5xl font-bold tracking-tighter text-white font-sans uppercase">LifeSnap</h1>
          <h2 className="text-lg text-accent tracking-wide font-medium">AI Case Intelligence for Real Life</h2>
          <div className="inline-block mt-2 px-3 py-1 rounded-sm border border-amber bg-amber/10 text-amber text-[10px] uppercase tracking-widest font-mono font-bold">
            DAAI007 — Founder Beta
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-3 mt-10"
        >
          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-bold rounded-none bg-primary/10 hover:bg-primary/20 text-white border border-primary glow-pink justify-start px-6 uppercase tracking-wider"
            onClick={() => handleAction("talk")}
            data-testid="button-talk"
          >
            <Mic className="w-5 h-5 text-primary mr-4" />
            Talk it out
          </Button>
          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-bold rounded-none bg-accent/5 hover:bg-accent/10 text-white border border-accent glow-cyan justify-start px-6 uppercase tracking-wider"
            onClick={() => handleAction("type")}
            data-testid="button-type"
          >
            <Keyboard className="w-5 h-5 text-accent mr-4" />
            Type it out
          </Button>
          <Button 
            size="lg" 
            variant="ghost"
            className="w-full h-16 text-sm font-medium rounded-none bg-transparent hover:bg-muted text-muted-foreground border border-border justify-start px-6 uppercase tracking-wider"
            onClick={handleUpload}
            data-testid="button-upload"
          >
            <Paperclip className="w-5 h-5 mr-4 opacity-50" />
            Upload file (V2)
          </Button>
        </motion.div>

        {/* Mode Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-8"
        >
          <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide snap-x" style={{ scrollbarWidth: "none" }}>
            {MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setSelectedMode(mode.value)}
                className={`snap-center shrink-0 whitespace-nowrap px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedMode === mode.value
                    ? "bg-primary text-white border-primary glow-pink"
                    : "bg-card text-muted-foreground hover:text-white border-border hover:border-muted-foreground glass-panel"
                }`}
                data-testid={`mode-${mode.value}`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FOUNDER ACCESS SECTION */}
      <section className="px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel border-primary p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">Founder's Access</h3>
            <div className="text-4xl font-black text-primary mb-4 glow-pink">$39<span className="text-lg text-primary/70">/month</span></div>
            <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
              Lock in lifetime founder pricing before public launch. Limited to 100 members.
            </p>
            <ul className="text-left text-sm space-y-3 mb-8 text-white/80 font-medium">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full glow-pink" /> AI Case Mapping</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full glow-pink" /> Skin-Body Timeline Report</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full glow-pink" /> Doctor-Facing Report Export</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full glow-pink" /> Priority Support</li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-14 font-bold tracking-widest uppercase glow-pink text-sm">
              Join the Founder Pilot
            </Button>
          </div>
        </motion.div>
      </section>

      {/* VERTICALS SECTION */}
      <section className="px-6 py-10">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">Everything on one intelligence platform</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="glass-panel p-5 border-primary/50 relative overflow-hidden group hover:border-primary transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-sm border border-primary/30">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">AI Case Mapping Assistant</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Describe any situation. Get a structured case map, timeline, and action plan in seconds.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 border-accent/50 relative overflow-hidden group hover:border-accent transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-sm border border-accent/30">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">Skin-Body Timeline Report</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Track symptoms, flares, treatments, and patterns over time. Build your evidence trail.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 border-secondary/50 relative overflow-hidden group hover:border-secondary transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-sm border border-secondary/30">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">Doctor-Facing Report Tools</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Generate clinical-grade summaries ready to share with your GP, specialist, or solicitor.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 border-amber/50 relative overflow-hidden group hover:border-amber transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber/10 rounded-sm border border-amber/30">
                <BookOpen className="w-6 h-6 text-amber" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">The Book</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Pre-order: The LifeSnap Method — a complete guide to documenting your health journey.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 border-accent/30 relative overflow-hidden flex flex-col">
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-accent text-[9px] font-bold uppercase text-background tracking-widest">Free</div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/5 rounded-sm border border-accent/20">
                <CheckSquare className="w-6 h-6 text-accent/70" />
              </div>
              <div className="flex-1 pr-8">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">Evidence Checklist</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Free lead magnet. Download the LifeSnap Evidence Starter Kit.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 border-secondary/30 relative overflow-hidden flex flex-col">
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-secondary/20 text-secondary text-[9px] font-bold uppercase border border-secondary/30 tracking-widest">Coming Soon</div>
            <div className="flex items-start gap-4 opacity-70">
              <div className="p-3 bg-secondary/5 rounded-sm border border-secondary/20">
                <Users className="w-6 h-6 text-secondary/70" />
              </div>
              <div className="flex-1 pr-16">
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">Community & Courses</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Peer support, live sessions, and structured learning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI AGENT CONSOLE SHOWCASE */}
      <section className="px-6 py-10">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">Your AI produces this, instantly</h3>
        
        <div className="glass-panel border-accent/60 relative overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          {/* Header Bar */}
          <div className="bg-accent/10 border-b border-accent/30 p-2 flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-accent" />
            <div className="text-[10px] text-accent font-bold tracking-widest flex items-center">
              LIFESNAP // CASE INTELLIGENCE ACTIVE
              <span className="inline-block w-2 h-3 bg-accent ml-1 animate-pulse" />
            </div>
          </div>
          
          <div className="p-4 space-y-4 relative">
            <div className="absolute inset-0 scan-line pointer-events-none z-10" />
            
            {/* Mock Card 1 */}
            <div className="bg-background/80 border border-border p-3 relative z-0">
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2 border-b border-border/50 pb-1">Situation Summary</div>
              <div className="space-y-2">
                <div className="h-2 bg-muted/60 rounded w-full" />
                <div className="h-2 bg-muted/60 rounded w-4/5" />
              </div>
            </div>

            {/* Mock Card 2 */}
            <div className="bg-background/80 border border-border p-3 relative z-0">
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2 border-b border-border/50 pb-1">Next 3 Actions</div>
              <div className="space-y-2 font-mono text-[10px] text-white/70">
                <div className="flex gap-2"><span className="text-accent">1.</span> <div className="h-2 bg-muted/60 rounded w-3/4 mt-1" /></div>
                <div className="flex gap-2"><span className="text-accent">2.</span> <div className="h-2 bg-muted/60 rounded w-5/6 mt-1" /></div>
                <div className="flex gap-2"><span className="text-accent">3.</span> <div className="h-2 bg-muted/60 rounded w-2/3 mt-1" /></div>
              </div>
            </div>

            {/* Mock Card 3 */}
            <div className="bg-amber/5 border border-amber/20 p-3 relative z-0">
              <div className="text-[10px] text-amber font-mono uppercase tracking-wider mb-2 border-b border-amber/20 pb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Risk & Deadline Flags
              </div>
              <div className="space-y-2 font-mono text-[10px] text-amber/80">
                <div className="flex gap-2"><span className="text-amber">!</span> <div className="h-2 bg-amber/20 rounded w-full mt-1" /></div>
                <div className="flex gap-2"><span className="text-amber">!</span> <div className="h-2 bg-amber/20 rounded w-4/5 mt-1" /></div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4 font-mono uppercase tracking-widest">
          Tap Talk or Type above to run your own case
        </p>
      </section>

      {/* SAFETY / DISCLAIMERS */}
      <section className="px-6 pb-12 pt-4">
        <div className="glass-panel border-amber/40 p-4 border-l-4 border-l-amber relative">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber" />
            <h4 className="font-bold text-amber uppercase text-sm tracking-wider">Important Boundaries</h4>
          </div>
          <p className="text-xs text-white/80 leading-relaxed mb-3">
            LifeSnap is an AI documentation and organisation tool. It is NOT a substitute for medical, legal, financial, psychological, or emergency professional advice. Always consult a qualified professional. In an emergency, call 999 or 112.
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            No raw audio or video stored. Text-first storage only.
          </p>
        </div>
      </section>

    </div>
  );
}
