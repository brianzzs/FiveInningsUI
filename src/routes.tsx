import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage/StartPage";
import StatsPage from "./pages/StatsPage/StatsPage";
import PlayerPage from './pages/PlayerPage/PlayerPage';
import ComparisonPage from './pages/ComparisonPage/ComparisonPage';

import { useAnalytics } from './hooks/useAnalytics';

function AppRoutes() {
  useAnalytics();

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/players" element={<PlayerPage />} />
      <Route path="/comparison/:gameId" element={<ComparisonPage />} />
    </Routes>
  );
}

export default AppRoutes; 