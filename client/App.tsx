import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Join from "./pages/Join";
import TeamManagement from "./pages/TeamManagement";
import NotFound from "./pages/NotFound";
import { measurePageLoad, preloadCriticalResources } from "./lib/performance";
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundaryWrapper from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Initialize performance monitoring
measurePageLoad();
preloadCriticalResources();

const AppRoutes = () => {
  try {
    const { isAuthenticated } = useAuth();

    return (
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        ) : (
          <Route path="/*" element={<Login />} />
        )}
      </Routes>
    );
  } catch (error) {
    console.error('AppRoutes error:', error);
    return <Login />;
  }
};

const App = () => (
  <ErrorBoundaryWrapper>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <DataProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </div>
              </DataProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundaryWrapper>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
