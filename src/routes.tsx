import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage/StartPage";
import StatsPage from "./pages/StatsPage/StatsPage";
import PlayerPage from './pages/PlayerPage/PlayerPage';
import { useAnalytics } from './hooks/useAnalytics';

function AppRoutes() {
  useAnalytics();

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/players" element={<PlayerPage />} />
    </Routes>
  );
}

export default AppRoutes; 