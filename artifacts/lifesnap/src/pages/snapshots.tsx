import { useLocation } from "wouter";
import { format } from "date-fns";
import { Trash2, ChevronRight, FileText, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListSnapshots, useDeleteSnapshot, getListSnapshotsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SnapshotsPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: snapshots, isLoading } = useListSnapshots();
  const deleteSnapshot = useDeleteSnapshot();

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this snapshot?")) {
      deleteSnapshot.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSnapshotsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Saved Snapshots</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal archive of clarity.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/50 flex flex-col gap-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))
        ) : !snapshots || snapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileQuestion className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No snapshots yet</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Offload your first situation to get it organised and saved here.
            </p>
            <Button className="mt-4" onClick={() => setLocation("/")}>
              Create LifeSnap
            </Button>
          </div>
        ) : (
          snapshots.map((snap) => (
            <div 
              key={snap.id}
              className="p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors cursor-pointer group flex flex-col gap-3 relative overflow-hidden"
              onClick={() => setLocation(`/snapshot/${snap.id}`)}
              data-testid={`snapshot-item-${snap.id}`}
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-medium text-foreground leading-tight line-clamp-2 pr-8">
                  {snap.title || snap.snapshot.situationSummary || "Untitled Snapshot"}
                </h3>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-background/50 uppercase tracking-wider text-muted-foreground border-border/50">
                    {snap.mode.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {format(new Date(snap.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => handleDelete(snap.id, e)}
                  data-testid={`delete-snapshot-${snap.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
