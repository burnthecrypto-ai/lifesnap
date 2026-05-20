import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mic, StopCircle, ArrowRight, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/context";
import { useProcessInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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
    if (inputType === "talk" && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [inputType]);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please provide some input first.", variant: "destructive" });
      return;
    }

    processInput.mutate({ data: { text, mode: selectedMode } }, {
      onSuccess: (data) => {
        setCurrentResult(data);
        setLocation("/result");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to process your input. Please try again.", variant: "destructive" });
      }
    });
  };

  if (processInput.isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 scan-line pointer-events-none opacity-50" />
        
        <div className="glass-panel border-accent p-6 w-full max-w-sm relative z-10 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
          <div className="flex items-center gap-2 mb-8 font-mono text-accent text-xs font-bold tracking-widest border-b border-accent/30 pb-3">
            <Terminal className="w-4 h-4" />
            LIFESNAP AI // PROCESSING CASE
            <span className="inline-block w-2 h-3 bg-accent ml-1 animate-pulse" />
          </div>

          <div className="space-y-6 font-mono text-xs text-white uppercase tracking-wider">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-accent" />
              Parsing situation data...
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-secondary" />
              Building case structure...
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              Generating action plan...
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 relative h-full">
      <div className="flex justify-center mb-6">
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest glow-cyan">
          {selectedMode.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {inputType === "talk" && !('webkitSpeechRecognition' in window) ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 glass-panel border-amber/50">
            <AlertTriangle className="w-12 h-12 text-amber mb-4" />
            <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Voice Input Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Voice input requires Chrome or Edge. You can type your situation below instead.
            </p>
            <Button 
              className="bg-accent text-background font-bold uppercase tracking-wider rounded-none px-8 py-6 glow-cyan hover:bg-accent/90"
              onClick={() => setInputType("type")}
            >
              Switch to Type Mode
            </Button>
          </div>
        ) : inputType === "talk" ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 glass-panel border-border p-4 relative overflow-hidden focus-within:border-primary/50 transition-colors">
              <Textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your transcript will appear here..."
                className="w-full h-full resize-none border-none bg-transparent focus-visible:ring-0 text-lg leading-relaxed shadow-none p-0 font-sans text-white/90 placeholder:text-muted-foreground/50"
                data-testid="input-textarea"
              />
              {isRecording && (
                <div className="absolute bottom-4 left-4 right-4 h-12 flex items-center justify-center gap-1 opacity-70">
                  <div className="w-1.5 h-6 bg-primary rounded-none animate-pulse" />
                  <div className="w-1.5 h-10 bg-secondary rounded-none animate-pulse delay-75" />
                  <div className="w-1.5 h-4 bg-accent rounded-none animate-pulse delay-150" />
                  <div className="w-1.5 h-8 bg-primary rounded-none animate-pulse delay-200" />
                  <div className="w-1.5 h-5 bg-secondary rounded-none animate-pulse delay-300" />
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                size="icon" 
                variant={isRecording ? "destructive" : "default"}
                className={`w-20 h-20 rounded-full shadow-lg transition-all duration-300 ${isRecording ? "animate-pulse glow-pink" : "bg-primary text-white glow-pink hover:bg-primary/90"}`}
                onClick={toggleRecording}
                data-testid="button-record"
              >
                {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col glass-panel border-border p-4 focus-within:border-accent/50 transition-colors">
            <Textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely. We'll organise it..."
              className="w-full flex-1 resize-none border-none bg-transparent focus-visible:ring-0 text-lg leading-relaxed shadow-none p-0 font-sans text-white/90 placeholder:text-muted-foreground/50"
              data-testid="input-textarea"
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4 pb-4">
        <Button 
          size="lg" 
          className="w-full h-16 text-sm font-bold uppercase tracking-widest rounded-none bg-primary hover:bg-primary/90 text-white glow-pink border border-primary/50"
          onClick={handleSubmit}
          disabled={!text.trim() || processInput.isPending}
          data-testid="button-submit"
        >
          Run Case Analysis <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex items-start gap-2 px-2 text-muted-foreground/60 border-t border-border/50 pt-4">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber/50" />
          <p className="text-[10px] leading-tight font-mono uppercase tracking-wide">
            LifeSnap is not medical, legal, financial, therapy, or emergency support. Always consult a qualified professional for serious matters.
          </p>
        </div>
      </div>
    </div>
  );
}
