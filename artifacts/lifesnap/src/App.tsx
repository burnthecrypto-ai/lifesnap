import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import InputPage from "@/pages/input";
import ResultPage from "@/pages/result";
import SnapshotsPage from "@/pages/snapshots";
import SnapshotDetailPage from "@/pages/snapshot-detail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/input" component={InputPage} />
      <Route path="/result" component={ResultPage} />
      <Route path="/snapshots" component={SnapshotsPage} />
      <Route path="/snapshot/:id" component={SnapshotDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
