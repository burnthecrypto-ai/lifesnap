import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mic, StopCircle, ArrowRight, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/context";
import { useProcessInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const PINK   = "hsl(330 100% 62%)";
const CYAN   = "hsl(188 100% 54%)";
const PURPLE = "hsl(272 95% 68%)";
const ORANGE = "hsl(28 100% 58%)";
const AMBER  = "hsl(45 100% 60%)";

export default function InputPage() {
  const [, setLocation] = useLocation();
  const { selectedMode, inputType, setInputType, setCurrentResult } = useApp();
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const processInput = useProcessInput();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (inputType === "talk" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (e: any) => {
        let t = "";
        for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
        setTranscript((prev) => prev + t);
      };
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, [inputType]);

  useEffect(() => { if (transcript) setText(transcript); }, [transcript]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript(""); setText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({ title: "Nothing entered", description: "Please provide some input first.", variant: "destructive" });
      return;
    }
    processInput.mutate({ data: { text, mode: selectedMode } }, {
      onSuccess: (data) => { setCurrentResult(data); setLocation("/result"); },
      onError: () => toast({ title: "Error", description: "Failed to process. Please try again.", variant: "destructive" }),
    });
  };

  /* ── Loading state ────────────────────────────────────────────── */
  if (processInput.isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 scan-line opacity-40" />
          <div className="absolute top-0 left-0 right-0 bottom-0"
            style={{ background: `radial-gradient(ellipse at 50% 40%, hsl(188 100% 54% / .08) 0%, transparent 70%)` }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm relative z-10 card-cyan rounded-xl p-6"
        >
          <div className="flex items-center gap-2.5 mb-8 pb-3 border-b-2"
            style={{ borderColor: `${CYAN}40` }}>
            <Terminal className="w-4 h-4" style={{ color: CYAN, filter: `drop-shadow(0 0 6px ${CYAN})` }} />
            <span className="font-black text-[10px] uppercase tracking-widest font-mono"
              style={{ color: CYAN, textShadow: `0 0 8px ${CYAN}` }}>
              LIFESNAP AI // PROCESSING CASE
            </span>
            <span className="inline-block w-2 h-3.5 rounded-sm animate-pulse ml-auto"
              style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          </div>

          <div className="space-y-6 font-mono text-xs uppercase tracking-wider">
            {[
              { color: CYAN,   label: "Parsing situation data...",  delay: 0.4 },
              { color: PURPLE, label: "Building case structure...",  delay: 2.2 },
              { color: PINK,   label: "Generating action plan...",   delay: 3.8 },
            ].map(({ color, label, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay }}
                className="flex items-center gap-3"
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay }}
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 20px ${color}60` }}
                />
                <span style={{ color, textShadow: `0 0 8px ${color}80` }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Mode badge ───────────────────────────────────────────────── */
  const modeBadge = (
    <div className="flex justify-center mb-6">
      <span
        className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest font-mono rounded-full"
        style={{
          background: `linear-gradient(135deg, hsl(188 100% 54% / .18), hsl(272 95% 68% / .14))`,
          border: `2px solid ${CYAN}80`,
          color: CYAN,
          boxShadow: `0 0 12px ${CYAN}40, 0 0 30px ${CYAN}18`,
          textShadow: `0 0 8px ${CYAN}`,
        }}
      >
        {selectedMode.replace(/_/g, " ")}
      </span>
    </div>
  );

  /* ── Browser doesn't support speech ──────────────────────────── */
  if (inputType === "talk" && !("webkitSpeechRecognition" in window)) {
    return (
      <div className="flex-1 flex flex-col p-4 relative h-full">
        {modeBadge}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 card-amber rounded-xl gap-5">
          <AlertTriangle className="w-14 h-14" style={{ color: AMBER, filter: `drop-shadow(0 0 12px ${AMBER})` }} />
          <div>
            <h3 className="font-black text-white uppercase tracking-wide mb-2"
              style={{ textShadow: "0 0 14px hsl(0 0% 100% / .4)" }}>
              Voice Input Unavailable
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voice input requires Chrome or Edge. Type your situation below instead.
            </p>
          </div>
          <button
            className="btn-dayglo-cyan px-8 py-4 font-black uppercase tracking-wider text-sm rounded-lg"
            onClick={() => setInputType("type")}
          >
            Switch to Type Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 relative h-full">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, ${PURPLE}08 0%, transparent 60%)`,
        }} />
      </div>

      {modeBadge}

      <div className="flex-1 flex flex-col space-y-4 relative z-10">
        {inputType === "talk" ? (
          <div className="flex-1 flex flex-col">
            {/* Transcript area */}
            <div className="flex-1 rounded-xl p-4 relative overflow-hidden card-purple focus-within:border-primary"
              style={{ transition: "border-color .2s" }}>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your transcript will appear here..."
                className="w-full h-full resize-none border-none bg-transparent focus-visible:ring-0 text-base leading-relaxed shadow-none p-0 text-white/95 placeholder:text-muted-foreground/40"
                data-testid="input-textarea"
              />
              {isRecording && (
                <div className="absolute bottom-4 left-0 right-0 flex items-end justify-center gap-1 h-10 pointer-events-none">
                  {[PINK, PURPLE, CYAN, PINK, PURPLE].map((c, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                      className="w-1.5 rounded-full"
                      style={{ height: 24 + i * 4, background: c, boxShadow: `0 0 8px ${c}`, transformOrigin: "bottom" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Record button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={toggleRecording}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all"
                data-testid="button-record"
                style={isRecording ? {
                  background: `radial-gradient(circle, hsl(0 100% 70%) 0%, hsl(0 100% 50%) 100%)`,
                  border: "3px solid hsl(0 100% 70%)",
                  boxShadow: "0 0 20px hsl(0 100% 60%), 0 0 50px hsl(0 100% 60% / .5), 0 0 100px hsl(0 100% 60% / .25)",
                  animation: "pulse 1s ease-in-out infinite",
                } : {
                  background: `radial-gradient(circle at 38% 35%, hsl(330 100% 75%) 0%, hsl(330 100% 62%) 50%, hsl(330 100% 45%) 100%)`,
                  border: "3px solid hsl(330 100% 75%)",
                  boxShadow: "0 0 20px hsl(330 100% 62%), 0 0 50px hsl(330 100% 62% / .5), inset 0 2px 0 hsl(330 100% 85% / .4)",
                }}
              >
                {isRecording
                  ? <StopCircle className="w-8 h-8 text-white" />
                  : <Mic className="w-8 h-8 text-white" />}
              </button>
            </div>
          </div>
        ) : (
          /* Type mode */
          <div className="flex-1 flex flex-col rounded-xl p-4 relative overflow-hidden card-cyan"
            style={{ transition: "border-color .2s" }}>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely. We'll organise it..."
              className="w-full flex-1 resize-none border-none bg-transparent focus-visible:ring-0 text-base leading-relaxed shadow-none p-0 text-white/95 placeholder:text-muted-foreground/40"
              data-testid="input-textarea"
            />
          </div>
        )}
      </div>

      {/* Submit + disclaimer */}
      <div className="mt-6 space-y-4 pb-4 relative z-10">
        <button
          className="w-full h-16 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm btn-dayglo-pink rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handleSubmit}
          disabled={!text.trim() || processInput.isPending}
          data-testid="button-submit"
        >
          Run Case Analysis <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-2 px-1 pt-3 border-t border-border/40">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBER, opacity: 0.7 }} />
          <p className="text-[10px] leading-tight font-mono uppercase tracking-wide text-muted-foreground/60">
            LifeSnap is not medical, legal, financial, therapy, or emergency support. Always consult a qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}
