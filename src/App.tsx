import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/pages/LandingPage";
import { AssessmentPage } from "@/pages/AssessmentPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { FloatingNav } from "@/components/FloatingNav";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </AppShell>
      <FloatingNav position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
