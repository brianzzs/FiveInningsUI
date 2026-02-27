import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as ChakraLink,
  Text,
  Tooltip,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { FaBaseballBall, FaMoon, FaSun } from "react-icons/fa";

const navItems = [
  { label: "Teams", to: ROUTES.STATISTICS },
  { label: "Players", to: ROUTES.PLAYERS },
];

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="navBg"
      borderBottomWidth="1px"
      borderColor="borderSubtle"
      boxShadow="0 16px 30px rgba(6, 18, 39, 0.26)"
      backdropFilter="blur(14px)"
    >
      <Flex
        mx="auto"
        maxW="container.xl"
        px={{ base: 4, md: 6 }}
        py={{ base: 2.5, md: 3 }}
        align="center"
        justify="space-between"
        gap={3}
      >
        <ChakraLink
          as={Link}
          to={ROUTES.HOME}
          _hover={{ textDecoration: "none" }}
          _focusVisible={{ boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)", borderRadius: "md" }}
        >
          <HStack spacing={3} align="center">
            <Flex
              w="34px"
              h="34px"
              borderRadius="10px"
              align="center"
              justify="center"
              bgGradient="linear(to-br, baseball.red, baseball.clay)"
              color="white"
            >
              <FaBaseballBall />
            </Flex>
            <VStack spacing={0} align="start" lineHeight={1}>
              <Heading as="p" size="sm" letterSpacing="0.12em" textTransform="uppercase">
                Five Innings
              </Heading>
              <Text fontSize="10px" color="textMuted" letterSpacing="0.16em" textTransform="uppercase">
                Betting Command Center
              </Text>
            </VStack>
          </HStack>
        </ChakraLink>

        <HStack spacing={2}>
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <ChakraLink
                key={item.to}
                as={Link}
                to={item.to}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="full"
                fontWeight={700}
                fontSize="sm"
                letterSpacing="0.03em"
                textTransform="uppercase"
                color={active ? "white" : "textSecondary"}
                bg={active ? "accent.500" : "panelMuted"}
                borderWidth="1px"
                borderColor={active ? "accent.400" : "borderSubtle"}
                _hover={{ textDecoration: "none", bg: active ? "accent.500" : "panelSubtle", color: "textPrimary" }}
                _focusVisible={{ boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)" }}
              >
                {item.label}
              </ChakraLink>
            );
          })}

          <Tooltip label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"} hasArrow>
            <IconButton
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              variant="ghostPanel"
              size="sm"
              borderWidth="1px"
              borderColor="borderSubtle"
            />
          </Tooltip>
        </HStack>
      </Flex>

      <Box borderTopWidth="1px" borderColor="borderSubtle" bg="panelSubtle">
        <Flex
          mx="auto"
          maxW="container.xl"
          px={{ base: 4, md: 6 }}
          py={1.5}
          justify="space-between"
          align="center"
          gap={4}
          wrap="wrap"
        >
          <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
            Live Models
          </Text>
          <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
            First 5 Splits
          </Text>
          <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
            Pitcher Matchups
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
