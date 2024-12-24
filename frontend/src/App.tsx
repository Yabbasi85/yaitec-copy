import ContentCreationPage from "./pages/contentCreation";
import HomePage from "./pages/home";
import LayoutUi from "./@global/components/layout/LayoutUi";
import CompetitorsPage from "./pages/competitors";
import VoicePage from "./pages/voiceAi/VoicePage";
import MarketingCampaignPage from "./pages/marketingCampaign";
import DashboardAnalyticsPage from "./pages/dashboardAnalytics";
import DesignAiPage from "./pages/designAi";
import LeadManagementPage from "./pages/leadManagement";
import EbookCreationPage from "./pages/ebookCreation";
import AdminPanelPage from "./pages/adminPanel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth/AuthProvider";  
import PrivateRoute from "./auth/PrivateRoute"; 
import LoginPage from "./pages/login";
import { Route, Routes } from "react-router-dom";
import BusinessAnalyticsPage from "./pages/business";
import DashboardPage from "./pages/Dashboard/home"
import CRMPage from "./pages/Dashboard/crm"
import FilesPage from "./pages/Dashboard/files"
import TasksPage from "./pages/Dashboard/task"


function App() {
  const [enabledDashboards, setEnabledDashboards] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios
        .get(`${apiUrl}/dashboards/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const dashboards = response.data.filter((dashboard: any) => dashboard.enabled);
          setEnabledDashboards(dashboards.map((d: any) => d.category)); 
        })
        .catch((error) => {
          console.error("Error fetching dashboards", error);
        });
    }
  }, [apiUrl, token]);

  return (
      <Routes>
        {/* Rota de login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Rota do Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/crm" element={<CRMPage />} />
        <Route path="/dashboard/files" element={<FilesPage />} />
        <Route path="/dashboard/task" element={<TasksPage />} />
        {/* Rotas protegidas */}
        <Route element={<LayoutUi />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/competitors"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Competitors") ? <CompetitorsPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
            <Route
            path="/business-analytics"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Business Analytics") ? <BusinessAnalyticsPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/content-creation"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Content Creation") ? <ContentCreationPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/vapi-voice"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Voice IA") ? <VoicePage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/marketing-campaign"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Marketing Campaign") ? <MarketingCampaignPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-analytics"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Dashboard Analytics") ? <DashboardAnalyticsPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/design-ai"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Design AI") ? <DesignAiPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/lead-management"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Lead Management") ? <LeadManagementPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/ebook-creation"
            element={
              <PrivateRoute>
                {enabledDashboards.includes("Ebook Creation") ? <EbookCreationPage /> : <HomePage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <PrivateRoute>
                <AdminPanelPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
  );
}

export default App;
