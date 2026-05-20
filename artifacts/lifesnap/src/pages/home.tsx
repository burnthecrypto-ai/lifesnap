import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mic, Keyboard, Paperclip, ChevronRight } from "lucide-react";
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
      title: "Coming Soon",
      description: "File upload feature is coming in V2.",
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 items-center justify-between pb-10">
      
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mt-8 space-y-2 w-full text-center"
      >
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent animate-pulse blur-xl opacity-50" />
          <div className="relative w-full h-full rounded-full bg-card border-2 border-primary/50 flex items-center justify-center overflow-hidden shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent opacity-80 mix-blend-screen" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">LifeSnap</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">DAAI007</p>
        
        <h2 className="text-xl font-medium mt-6 text-foreground">
          What's on your mind today?
        </h2>
      </motion.div>

      {/* Mode Selector */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full mt-8"
      >
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide snap-x" style={{ scrollbarWidth: "none" }}>
          {MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setSelectedMode(mode.value)}
              className={`snap-center shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedMode === mode.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
              }`}
              data-testid={`mode-${mode.value}`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-col gap-3 mt-8"
      >
        <Button 
          size="lg" 
          className="w-full h-16 text-lg rounded-2xl bg-card hover:bg-muted border border-border/50 justify-start px-6"
          onClick={() => handleAction("talk")}
          data-testid="button-talk"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          Talk it out
        </Button>
        <Button 
          size="lg" 
          className="w-full h-16 text-lg rounded-2xl bg-card hover:bg-muted border border-border/50 justify-start px-6"
          onClick={() => handleAction("type")}
          data-testid="button-type"
        >
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
            <Keyboard className="w-5 h-5 text-secondary" />
          </div>
          Type it out
        </Button>
        <Button 
          size="lg" 
          className="w-full h-16 text-lg rounded-2xl bg-card hover:bg-muted border border-border/50 justify-start px-6"
          onClick={handleUpload}
          data-testid="button-upload"
        >
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-4">
            <Paperclip className="w-5 h-5 text-accent" />
          </div>
          Upload file
        </Button>
      </motion.div>

      {/* Footer / CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-10 space-y-4"
      >
        <div className="w-full rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-4 flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
          <div>
            <h4 className="font-semibold text-primary">Founder Pilot</h4>
            <p className="text-xs text-muted-foreground mt-1">Join the pilot — $39/month. Limited spots.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs text-center text-muted-foreground/60 w-full px-4">
          Text-first storage only. No raw audio or video stored.
        </p>
      </motion.div>
    </div>
  );
}
