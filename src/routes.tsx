import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAnalytics } from "./hooks/useAnalytics";

const StartPage = lazy(() => import("./pages/StartPage/StartPage"));
const StatsPage = lazy(() => import("./pages/StatsPage/StatsPage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage/PlayerPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage/ComparisonPage"));

const RouteFallback: React.FC = () => (
  <Center minH="100vh" bg="pageBg">
    <VStack spacing={4}>
      <Spinner size="xl" color="accent.500" thickness="4px" />
      <Text color="textSecondary" fontWeight={600}>
        Loading dashboard...
      </Text>
    </VStack>
  </Center>
);

function AppRoutes() {
  useAnalytics();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/players" element={<PlayerPage />} />
        <Route path="/comparison/:gameId" element={<ComparisonPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
