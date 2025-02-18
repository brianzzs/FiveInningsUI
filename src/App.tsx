import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StartPage from "./pages/StartPage/StartPage";
import StatsPage from "./pages/StatsPage/StatsPage";
import PlayerPage from './pages/PlayerPage/PlayerPage';
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/players" element={<PlayerPage />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
