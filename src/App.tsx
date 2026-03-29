import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import CategoryDetailPage from "./pages/CategoryDetailPage.tsx";
import AlternativesPage from "./pages/AlternativesPage.tsx";
import AlternativeDetailPage from "./pages/AlternativeDetailPage.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import ToolDetailPage from "./pages/ToolDetailPage.tsx";
import SubmitPage from "./pages/SubmitPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.tsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.tsx";
import AdminTagsPage from "./pages/admin/AdminTagsPage.tsx";
import AdminAlternativesPage from "./pages/admin/AdminAlternativesPage.tsx";
import AdminSubmissionsPage from "./pages/admin/AdminSubmissionsPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/alternatives" element={<AlternativesPage />} />
            <Route path="/alternatives/:slug" element={<AlternativeDetailPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:slug" element={<ToolDetailPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="tags" element={<AdminTagsPage />} />
              <Route path="alternatives" element={<AdminAlternativesPage />} />
              <Route path="submissions" element={<AdminSubmissionsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
