import React from "react";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { ROUTES } from "../../constants";
import TodaySchedule from "../../components/TodaySchedule/TodaySchedule";
import { AppShell } from "../../components/Layout/AppShell";
import SectionCard from "../../components/UI/SectionCard";

const heroStats = [
  { label: "Tracked Teams", value: "30" },
  { label: "Lookback Window", value: "30D" },
  { label: "Core Angles", value: "NRFI/F5" },
];

export const StartPage: React.FC = () => {
  return (
    <AppShell containerMaxW="container.xl">
      <VStack spacing={8} align="stretch">
        <SectionCard p={0} minH={{ base: "420px", md: "460px" }}>
          <Grid templateColumns={{ base: "1fr", xl: "7fr 5fr" }} minH="inherit">
            <GridItem>
              <Flex h="100%" p={{ base: 6, md: 10 }} direction="column" justify="space-between" gap={8}>
                <VStack align="start" spacing={5} maxW="760px">
                  <Text
                    bg="accent.500"
                    color="white"
                    fontWeight="700"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="11px"
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                  >
                    MLB First Five Intelligence
                  </Text>
                  <Heading as="h1" fontSize={{ base: "3xl", md: "5xl", xl: "6xl" }} lineHeight="0.9" letterSpacing="0.04em" textTransform="uppercase">
                    Read The
                    <Text as="span" color="accent.500"> Board</Text>
                    <br /> Before The First Pitch
                  </Heading>
                  <Text color="textSecondary" fontSize={{ base: "md", md: "lg" }} maxW="700px">
                    Team trend signals, pitcher context, and matchup probability surfaces in a single betting command center.
                    No feature additions, just a sharper interface for faster decisions.
                  </Text>
                  <HStack spacing={3} wrap="wrap">
                    <Link to={ROUTES.STATISTICS}>
                      <Button variant="cta" size="lg" leftIcon={<Icon as={FaChartLine} />}>
                        Open Team Dashboard
                      </Button>
                    </Link>
                    <Link to={ROUTES.PLAYERS}>
                      <Button variant="ghostPanel" size="lg">
                        Explore Players
                      </Button>
                    </Link>
                  </HStack>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                  {heroStats.map((item) => (
                    <Stat
                      key={item.label}
                      p={4}
                      borderWidth="1px"
                      borderColor="borderSubtle"
                      borderRadius="lg"
                      bg="panelSubtle"
                    >
                      <StatLabel fontSize="11px" textTransform="uppercase" letterSpacing="0.12em" color="textMuted" mb={1}>
                        {item.label}
                      </StatLabel>
                      <StatNumber fontSize="2xl" lineHeight="1">
                        {item.value}
                      </StatNumber>
                    </Stat>
                  ))}
                </SimpleGrid>
              </Flex>
            </GridItem>

            <GridItem display={{ base: "none", xl: "block" }} borderLeftWidth="1px" borderColor="borderSubtle">
              <Flex h="100%" p={8} direction="column" justify="space-between" bg="panelSubtle">
                <VStack align="start" spacing={3}>
                  <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.12em" fontWeight={700} color="textMuted">
                    Focus Areas
                  </Text>
                  <Heading size="md" textTransform="uppercase" letterSpacing="0.05em" lineHeight="1.05">
                    Daily Matchup Grid
                  </Heading>
                  <Text color="textSecondary" fontSize="sm">
                    Start from live schedule cards, jump into team dashboard context, then drill down to player splits.
                  </Text>
                </VStack>
                <VStack align="start" spacing={4}>
                  {[
                    "First-five trend scoring",
                    "Pitcher click-through workflow",
                    "Game-level comparison panels",
                  ].map((bullet) => (
                    <HStack key={bullet} spacing={3} align="start">
                      <Flex mt={1} w="9px" h="9px" borderRadius="full" bg="brand.500" />
                      <Text color="textSecondary" fontSize="sm">
                        {bullet}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Flex>
            </GridItem>
          </Grid>
        </SectionCard>

        <SectionCard>
          <TodaySchedule />
        </SectionCard>
      </VStack>
    </AppShell>
  );
};

export default StartPage;
