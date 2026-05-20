import { useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { 
  Copy, Printer, Trash2,
  FileText, ListChecks, Clock, Users, FileQuestion, AlertCircle, Play, Tag, Share2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSnapshot, useDeleteSnapshot, getListSnapshotsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SnapshotDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: snapshotData, isLoading } = useGetSnapshot(Number(id));
  const deleteSnapshot = useDeleteSnapshot();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!snapshotData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <FileQuestion className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Snapshot not found</h2>
        <Button onClick={() => setLocation("/snapshots")}>Back to Snapshots</Button>
      </div>
    );
  }

  const { diaryEntry, snapshot } = snapshotData;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    toast({ title: "Copied", description: "Snapshot copied to clipboard." });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this snapshot?")) {
      deleteSnapshot.mutate({ id: Number(id) }, {
        onSuccess: () => {
          toast({ title: "Deleted", description: "Snapshot has been removed." });
          queryClient.invalidateQueries({ queryKey: getListSnapshotsQueryKey() });
          setLocation("/snapshots");
        }
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full bg-background print:bg-white print:text-black">
      <div className="p-4 border-b border-border/40 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur z-10 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/snapshots")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold truncate max-w-[200px]">{snapshotData.title || "Saved Snapshot"}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32" ref={contentRef}>
        
        {/* Section A: Diary Entry */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/50 border-primary/20 shadow-lg">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Your Diary Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-foreground leading-relaxed italic font-serif text-lg">
                "{diaryEntry.content}"
              </p>
              <p className="text-xs text-muted-foreground mt-4 text-right">
                {new Date(diaryEntry.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section B: Snapshot */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-secondary to-accent rounded-full" />
            <h3 className="text-xl font-bold tracking-tight">Structured Snapshot</h3>
          </div>

          <div className="space-y-6 print:space-y-4">
            
            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary flex items-center gap-2 uppercase tracking-wider">
                <ListChecks className="w-4 h-4" /> Situation Summary
              </h4>
              <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50">
                {snapshot.situationSummary}
              </p>
            </div>

            {/* Next Actions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-secondary flex items-center gap-2 uppercase tracking-wider">
                <Play className="w-4 h-4" /> Next Actions
              </h4>
              <ul className="space-y-2">
                {snapshot.nextThreeActions.map((action, i) => (
                  <li key={i} className="flex gap-3 bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                    <span className="font-bold text-secondary">{i + 1}</span>
                    <span className="text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Facts */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Key Facts
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
                {snapshot.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
              </ul>
            </div>

            {/* Timeline */}
            {snapshot.timeline.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Timeline
                </h4>
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                  {snapshot.timeline.map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-card border-2 border-primary shrink-0 flex items-center justify-center z-10" />
                      <div className="pb-2">
                        <p className="text-xs font-semibold text-primary">{item.date}</p>
                        <p className="text-sm text-foreground">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid for People, Missing, Risks */}
            <div className="grid grid-cols-1 gap-4">
              {snapshot.peopleInvolved.length > 0 && (
                <div className="bg-card border border-border/50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" /> People
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {snapshot.peopleInvolved.map((p, i) => (
                      <Badge key={i} variant="secondary" className="bg-muted text-foreground font-normal">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {snapshot.risksAndDeadlines.length > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-destructive flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <AlertCircle className="w-3.5 h-3.5" /> Risks & Deadlines
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-foreground/90">
                    {snapshot.risksAndDeadlines.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {snapshot.missingInformation.length > 0 && (
                <div className="bg-accent/5 border border-accent/20 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-accent flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <FileQuestion className="w-3.5 h-3.5" /> Missing Info
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-foreground/90">
                    {snapshot.missingInformation.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Tag className="w-4 h-4 text-muted-foreground mr-1" />
              {snapshot.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="border-border text-muted-foreground text-[10px]">#{tag}</Badge>
              ))}
            </div>

            {/* Shareable Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20">
              <h4 className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
                <Share2 className="w-4 h-4" /> Shareable Summary
              </h4>
              <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                {snapshot.shareableSummary}
              </p>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-background/80 backdrop-blur-xl border-t border-border/40 print:hidden z-20">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-card hover:bg-muted" onClick={handleCopy} data-testid="button-copy">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" className="flex-1 bg-card hover:bg-muted" onClick={handlePrint} data-testid="button-print">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
}
