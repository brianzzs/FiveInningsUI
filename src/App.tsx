import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./components/StartPage/StartPage";
import StatsPage from "./components/StatsPage/StatsPage";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
