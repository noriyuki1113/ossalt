import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollToTop } from "@/components/ScrollToTop";
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

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/alternatives/:slug" element={<AlternativesPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
