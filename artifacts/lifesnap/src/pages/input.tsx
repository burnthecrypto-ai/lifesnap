import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mic, StopCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/context";
import { useProcessInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function InputPage() {
  const [, setLocation] = useLocation();
  const { selectedMode, inputType, setCurrentResult } = useApp();
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
    } else if (inputType === "talk") {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser does not support speech recognition. Please type your situation.",
        variant: "destructive"
      });
    }
  }, [inputType, toast]);

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
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent animate-pulse blur-xl opacity-80" />
          <div className="relative w-full h-full rounded-full bg-card border border-primary/50 flex items-center justify-center shadow-2xl animate-spin-slow">
            <div className="w-16 h-16 rounded-full bg-primary/40 blur-md" />
          </div>
        </div>
        <h2 className="text-xl font-medium animate-pulse">Organising your situation…</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 relative h-full">
      <div className="flex justify-center mb-6">
        <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider">
          {selectedMode.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {inputType === "talk" ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-card rounded-2xl border border-border p-4 relative overflow-hidden shadow-inner">
              <Textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your transcript will appear here..."
                className="w-full h-full resize-none border-none bg-transparent focus-visible:ring-0 text-lg leading-relaxed shadow-none p-0"
                data-testid="input-textarea"
              />
              {isRecording && (
                <div className="absolute bottom-4 left-4 right-4 h-12 flex items-center justify-center gap-1 opacity-50">
                  <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse" />
                  <div className="w-1.5 h-10 bg-secondary rounded-full animate-pulse delay-75" />
                  <div className="w-1.5 h-4 bg-accent rounded-full animate-pulse delay-150" />
                  <div className="w-1.5 h-8 bg-primary rounded-full animate-pulse delay-200" />
                  <div className="w-1.5 h-5 bg-secondary rounded-full animate-pulse delay-300" />
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                size="icon" 
                variant={isRecording ? "destructive" : "default"}
                className={`w-20 h-20 rounded-full shadow-lg transition-all duration-300 ${isRecording ? "animate-pulse" : "bg-gradient-to-tr from-primary to-secondary"}`}
                onClick={toggleRecording}
                data-testid="button-record"
              >
                {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border p-4 shadow-inner">
            <Textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely. We'll organise it..."
              className="w-full flex-1 resize-none border-none bg-transparent focus-visible:ring-0 text-lg leading-relaxed shadow-none p-0"
              data-testid="input-textarea"
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4 pb-4">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 shadow-lg text-white"
          onClick={handleSubmit}
          disabled={!text.trim()}
          data-testid="button-submit"
        >
          Generate LifeSnap <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex items-start gap-2 px-2 text-muted-foreground/60">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-tight">
            LifeSnap is not medical, legal, financial, therapy, or emergency support. Always consult a qualified professional for serious matters.
          </p>
        </div>
      </div>
    </div>
  );
}
