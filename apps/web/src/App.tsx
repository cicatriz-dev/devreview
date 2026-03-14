import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { RulesPage } from "@/pages/RulesPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { AdrsPage } from "@/pages/AdrsPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/regras" element={<RulesPage />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/adrs" element={<AdrsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
