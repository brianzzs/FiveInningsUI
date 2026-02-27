import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { MdCompareArrows, MdKeyboardArrowRight, MdSportsBaseball, MdTimeline } from "react-icons/md";
import { ROUTES } from "../../constants";
import TodaySchedule from "../../components/TodaySchedule/TodaySchedule";
import { AppShell } from "../../components/Layout/AppShell";
import SectionCard from "../../components/UI/SectionCard";

const heroStats = [
  { label: "Tracked Teams", value: "30" },
  { label: "Lookback Window", value: "30D" },
  { label: "Core Angles", value: "NRFI/F5" },
];

const workflowSteps = [
  {
    title: "Scan today schedule",
    subtitle: "Start from live matchup cards and probable pitchers.",
    icon: MdSportsBaseball,
  },
  {
    title: "Score first-five trends",
    subtitle: "Review NRFI and F5 trend stacks before opening details.",
    icon: MdTimeline,
  },
  {
    title: "Compare full game panel",
    subtitle: "Jump into side-by-side lineup, starters, and H2H splits.",
    icon: MdCompareArrows,
  },
];

const focusAreas = [
  "Daily matchup grid",
  "Pitcher click-through workflow",
  "Game-level comparison panels",
];

export const StartPage: React.FC = () => {
  return (
    <AppShell containerMaxW="container.xl">
      <VStack spacing={8} align="stretch">
        <SectionCard p={0} minH={{ base: "380px", md: "420px", xl: "460px" }}>
          <Grid templateColumns={{ base: "1fr", xl: "7fr 5fr" }} minH="inherit">
            <GridItem>
              <Flex h="100%" p={{ base: 6, md: 10 }} direction="column" justify="flex-start" gap={8}>
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
                    <br /> Own The First Five
                  </Heading>
                  <Text color="textSecondary" fontSize={{ base: "md", md: "lg" }} maxW="700px">
                    Team trend signals, pitcher context, and matchup probability surfaces in a single betting command center.
                    No feature additions, just a sharper interface for faster decisions.
                  </Text>
                  <HStack spacing={2} wrap="wrap">
                    {focusAreas.map((area) => (
                      <Badge key={area} variant="subtle" colorScheme="red" px={2.5} py={1} borderRadius="full" fontSize="10px">
                        {area}
                      </Badge>
                    ))}
                  </HStack>
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

            <GridItem
              display="block"
              borderLeftWidth={{ base: "0", xl: "1px" }}
              borderTopWidth={{ base: "1px", xl: "0" }}
              borderColor="borderSubtle"
            >
              <Flex
                h="100%"
                p={8}
                direction="column"
                justify="flex-start"
                gap={5}
                bg="panelSubtle"
                bgGradient="linear(to-b, panelSubtle, panelMuted)"
              >
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between" align="center">
                    <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.12em" fontWeight={700} color="textMuted">
                      Matchup Command Board
                    </Text>
                    <Badge colorScheme="red" borderRadius="full" px={2.5} py={1} fontSize="10px">
                      Live Flow
                    </Badge>
                  </HStack>

                  <Box
                    bg="panelBg"
                    borderWidth="1px"
                    borderColor="borderSubtle"
                    borderRadius="xl"
                    p={4}
                    boxShadow="sm"
                  >
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
                          Typical Workflow
                        </Text>
                        <Text fontSize="xs" color="textMuted">
                          3 Steps
                        </Text>
                      </HStack>

                      {workflowSteps.map((step, idx) => (
                        <HStack
                          key={step.title}
                          spacing={3}
                          align="start"
                          p={3}
                          borderWidth="1px"
                          borderColor="borderSubtle"
                          borderRadius="lg"
                          bg="panelSubtle"
                        >
                          <Flex
                            w="26px"
                            h="26px"
                            borderRadius="full"
                            bg="baseball.navy"
                            color="white"
                            align="center"
                            justify="center"
                            fontSize="12px"
                            fontWeight={700}
                            flexShrink={0}
                          >
                            {idx + 1}
                          </Flex>
                          <Box>
                            <HStack spacing={1.5} mb={0.5}>
                              <Icon as={step.icon} color="accent.500" boxSize={4} />
                              <Text fontSize="sm" fontWeight={700} color="textPrimary" lineHeight="1.2">
                                {step.title}
                              </Text>
                            </HStack>
                            <Text color="textSecondary" fontSize="xs" lineHeight="1.3">
                              {step.subtitle}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Box
                    bg="panelBg"
                    borderWidth="1px"
                    borderColor="borderSubtle"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700} mb={2}>
                      Route Coverage
                    </Text>
                    <Text color="textSecondary" fontSize="sm" lineHeight="1.4">
                      Daily Matchups lead into Team Dashboard context, then Players splits, with game-level comparison kept one click away.
                    </Text>
                  </Box>
                </VStack>

                <HStack spacing={2} wrap="wrap">
                  <Link to={ROUTES.STATISTICS}>
                    <Button size="sm" variant="ghostPanel" rightIcon={<MdKeyboardArrowRight />}>
                      Teams
                    </Button>
                  </Link>
                  <Link to={ROUTES.PLAYERS}>
                    <Button size="sm" variant="ghostPanel" rightIcon={<MdKeyboardArrowRight />}>
                      Players
                    </Button>
                  </Link>
                  <IconButton aria-label="Comparison available from game cards" icon={<MdCompareArrows />} size="sm" variant="ghostPanel" isDisabled />
                </HStack>
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
