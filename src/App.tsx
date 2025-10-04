import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import TestPage from "./pages/TestPage";
import TestResults from "./pages/TestResults";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import QuestionsAdmin from "./pages/admin/QuestionsAdmin";
import AnswersAdmin from "./pages/admin/AnswersAdmin";
import BulkOperations from "./pages/admin/BulkOperations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/test/:categoryId" element={<TestPage />} />
          <Route path="/test-results" element={<TestResults />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="questions" element={<QuestionsAdmin />} />
            <Route path="answers" element={<AnswersAdmin />} />
            <Route path="import" element={<BulkOperations />} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Management - Coming Soon</h1></div>} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
