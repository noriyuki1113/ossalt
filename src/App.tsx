import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";

const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AlternativesPage = lazy(() => import("./pages/AlternativesPage"));
const RankingPage = lazy(() => import("./pages/Ranking"));
const QuizPage = lazy(() => import("./pages/Quiz"));
const NewsPage = lazy(() => import("./pages/News"));
const SavingsPage = lazy(() => import("./pages/Savings"));
const AdminPage = lazy(() => import("./pages/Admin"));
const AdvertisePage = lazy(() => import("./pages/Advertise"));
const SubmitPage = lazy(() => import("./pages/Submit"));
const SponsorPage = lazy(() => import("./pages/Sponsor"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const NotionAlternativesGuide = lazy(() => import("./pages/NotionAlternativesGuide"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const CompareIndexPage = lazy(() => import("./pages/CompareIndexPage"));
const SelfHostVpsPage = lazy(() => import("./pages/SelfHostVps"));
const N8nSelfhostVpsGuide = lazy(() => import("./pages/N8nSelfhostVpsGuide"));
const AppFlowySelfhostVpsGuide = lazy(() => import("./pages/AppFlowySelfhostVpsGuide"));
const BaserowSelfhostVpsGuide = lazy(() => import("./pages/BaserowSelfhostVpsGuide"));
const PlausibleSelfhostVpsGuide = lazy(() => import("./pages/PlausibleSelfhostVpsGuide"));
const MetabaseSelfhostVpsGuide = lazy(() => import("./pages/MetabaseSelfhostVpsGuide"));
const NocodbSelfhostVpsGuide = lazy(() => import("./pages/NocodbSelfhostVpsGuide"));
const UmamiSelfhostVpsGuide = lazy(() => import("./pages/UmamiSelfhostVpsGuide"));
const YearlyGuide = lazy(() => import("./pages/YearlyGuide"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes — prevents redundant refetches on navigation
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Don't retry on 4xx errors
      retry: (failureCount, error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:slug" element={<Index />} />
            <Route path="/tools/:id" element={<ToolDetail />} />
            <Route path="/guides/notion-alternatives" element={<NotionAlternativesGuide />} />
            <Route path="/guides/n8n-selfhost-vps" element={<N8nSelfhostVpsGuide />} />
            <Route path="/guides/appflowy-selfhost-vps" element={<AppFlowySelfhostVpsGuide />} />
            <Route path="/guides/baserow-selfhost-vps" element={<BaserowSelfhostVpsGuide />} />
            <Route path="/guides/plausible-selfhost-vps" element={<PlausibleSelfhostVpsGuide />} />
            <Route path="/guides/metabase-selfhost-vps" element={<MetabaseSelfhostVpsGuide />} />
            <Route path="/guides/nocodb-selfhost-vps" element={<NocodbSelfhostVpsGuide />} />
            <Route path="/guides/umami-selfhost-vps" element={<UmamiSelfhostVpsGuide />} />
            <Route path="/guides/yearly/:slug" element={<YearlyGuide />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/alternatives/:slug" element={<AlternativesPage />} />
            <Route path="/compare" element={<CompareIndexPage />} />
            <Route path="/compare/:slug" element={<ComparePage />} />
            <Route path="/selfhost-vps" element={<SelfHostVpsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/workspace/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
