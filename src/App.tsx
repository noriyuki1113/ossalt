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
import AdminProductEditPage from "./pages/admin/AdminProductEditPage.tsx";
import AdminAlternativeEditPage from "./pages/admin/AdminAlternativeEditPage.tsx";
import AdminCategoryEditPage from "./pages/admin/AdminCategoryEditPage.tsx";
import AdminImportsPage from "./pages/admin/AdminImportsPage.tsx";
import AdminScrapeRunsPage from "./pages/admin/AdminScrapeRunsPage.tsx";
import PopularPage from "./pages/PopularPage.tsx";
import OssToolsPage from "./pages/OssToolsPage.tsx";
import SelfHostedToolsPage from "./pages/SelfHostedToolsPage.tsx";
import JapaneseSupportedToolsPage from "./pages/JapaneseSupportedToolsPage.tsx";
import ArticlesPage from "./pages/ArticlesPage.tsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.tsx";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage.tsx";
import AdminArticleEditPage from "./pages/admin/AdminArticleEditPage.tsx";
import AdminArticleGeneratePage from "./pages/admin/AdminArticleGeneratePage.tsx";

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
            <Route path="/products" element={<ToolsPage />} />
            <Route path="/products/:slug" element={<ToolDetailPage />} />
            {/* Legacy /tools redirects */}
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:slug" element={<ToolDetailPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/popular" element={<PopularPage />} />
            <Route path="/open-source-tools" element={<OssToolsPage />} />
            <Route path="/self-hosted-tools" element={<SelfHostedToolsPage />} />
            <Route path="/japanese-supported-tools" element={<JapaneseSupportedToolsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductEditPage />} />
              <Route path="products/:id" element={<AdminProductEditPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="categories/new" element={<AdminCategoryEditPage />} />
              <Route path="categories/:id" element={<AdminCategoryEditPage />} />
              <Route path="tags" element={<AdminTagsPage />} />
              <Route path="alternatives" element={<AdminAlternativesPage />} />
              <Route path="alternatives/new" element={<AdminAlternativeEditPage />} />
              <Route path="alternatives/:id" element={<AdminAlternativeEditPage />} />
              <Route path="submissions" element={<AdminSubmissionsPage />} />
              <Route path="imports" element={<AdminImportsPage />} />
              <Route path="scrape-runs" element={<AdminScrapeRunsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
