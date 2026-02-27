import React from "react";
import { Box, Container, type ContainerProps } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import FooterComponent from "./Footer/Footer";

interface AppShellProps {
  children: React.ReactNode;
  containerMaxW?: ContainerProps["maxW"];
  containerPx?: ContainerProps["px"];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  containerMaxW = "container.xl",
  containerPx = { base: 4, md: 6 },
}) => {
  return (
    <Box
      minH="100vh"
      bg="pageBg"
      color="textPrimary"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgImage:
          "radial-gradient(circle at 14% 14%, rgba(12,35,64,0.2) 0%, transparent 30%), radial-gradient(circle at 84% 10%, rgba(186,12,47,0.17) 0%, transparent 31%), radial-gradient(circle at 52% 85%, rgba(47,107,63,0.13) 0%, transparent 34%), linear-gradient(to bottom, var(--chakra-colors-pageGradientStart), var(--chakra-colors-pageGradientEnd))",
        pointerEvents: "none",
        zIndex: 0,
      }}
      _after={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgImage:
          "linear-gradient(rgba(144,116,82,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(144,116,82,0.11) 1px, transparent 1px)",
        bgSize: "36px 36px",
        maskImage: "radial-gradient(circle at center, black 35%, transparent 100%)",
        opacity: 0.14,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <NavBar />
      <Box as="main" flex="1" pt={{ base: "6.75rem", md: "7.25rem" }} pb={12} position="relative" zIndex={1}>
        <Container maxW={containerMaxW} px={containerPx}>
          {children}
        </Container>
      </Box>
      <FooterComponent />
    </Box>
  );
};
