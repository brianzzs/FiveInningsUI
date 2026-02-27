import React, { useState } from "react";
import {
  Button,
  Divider,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import TeamDropdown from "../../components/TeamDropdown/TeamDropdown";
import SpanDropdown from "../../components/SpanDropdown/SpanDropdown";
import { StatisticsPanel } from "../../components/Statistics/StatisticsPanel";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import NextScheduledGame from "../../components/NextScheduledGame/NextScheduledGame";
import TeamLogo from "../../components/TeamLogo/TeamLogo";
import { useStatistics } from "../../hooks/useStatistics";
import { AppShell } from "../../components/Layout/AppShell";
import SectionCard from "../../components/UI/SectionCard";
import PageTitle from "../../components/UI/PageTitle";
import QueryState from "../../components/UI/QueryState";

export const StatsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTeam, setSelectedTeam] = useState<number>(() => {
    const state = location.state as { selectedTeamId?: number };
    return state?.selectedTeamId ?? 0;
  });
  const [selectedSpan, setSelectedSpan] = useState<number>(5);

  const { data, isLoading, error } = useStatistics(selectedTeam, selectedSpan);

  const handlePitcherSelect = (playerId: number) => {
    navigate(`/players`, { state: { selectedPlayerId: playerId } });
  };

  const shouldShowNextGame = Boolean(selectedTeam) && !isLoading && !error;

  return (
    <AppShell>
      <VStack spacing={6} align="stretch">
        <PageTitle
          eyebrow="Team Dashboard"
          title="Performance Radar"
          subtitle="Set your team and span, then scan first-five probabilities and game logs from a single command layout."
        />

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={5}>
          <SectionCard gridColumn={{ base: "auto", xl: "span 2" }}>
            <VStack spacing={5} align="stretch">
              <HStack justify="space-between" align="center" wrap="wrap">
                <Text textTransform="uppercase" letterSpacing="0.1em" fontSize="11px" color="textMuted" fontWeight={700}>
                  Model Filters
                </Text>
                {selectedTeam ? <TeamLogo teamId={selectedTeam} size="62px" /> : null}
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <TeamDropdown selectedTeam={selectedTeam} onTeamChange={setSelectedTeam} />
                <SpanDropdown selectedPeriod={selectedSpan} onPeriodChange={setSelectedSpan} />
                <VStack align="stretch" justify="end">
                  <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
                    Status
                  </Text>
                  <Button
                    variant="cta"
                    isLoading={isLoading}
                    loadingText="Analyzing"
                    isDisabled={!selectedTeam}
                    w="100%"
                    h="44px"
                  >
                    {isLoading ? "Analyzing" : "Statistics Ready"}
                  </Button>
                </VStack>
              </SimpleGrid>
            </VStack>
          </SectionCard>

          <SectionCard>
            <VStack align="start" spacing={3}>
              <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700}>
                Workflow
              </Text>
              <Text fontSize="sm" color="textSecondary">
                1. Pick team and lookback window.
              </Text>
              <Text fontSize="sm" color="textSecondary">
                2. Review NRFI/F5 probability cards.
              </Text>
              <Text fontSize="sm" color="textSecondary">
                3. Validate against recent first-five game log.
              </Text>
              <Divider borderColor="borderSubtle" my={1} />
              <Text fontSize="xs" color="textMuted">
                Clickable pitchers and teams stay unchanged.
              </Text>
            </VStack>
          </SectionCard>
        </SimpleGrid>

        <QueryState isLoading={false} errorMessage={error?.message ?? null} hasData={Boolean(data)} />

        {shouldShowNextGame ? (
          <SectionCard>
            <Text mb={4} fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" fontSize="11px" color="textMuted">
              Next Scheduled Matchup
            </Text>
            <NextScheduledGame teamId={selectedTeam} fetchGame={true} onPitcherSelect={handlePitcherSelect} />
          </SectionCard>
        ) : null}

        {!isLoading && !error && data ? (
          <SectionCard>
            <VStack align="stretch" spacing={6}>
              <StatisticsPanel data={data} />
              <Divider borderColor="borderSubtle" />
              <ResultsTable data={data.results} displayedTeamId={selectedTeam} selectedPeriod={selectedSpan} />
            </VStack>
          </SectionCard>
        ) : null}
      </VStack>
    </AppShell>
  );
};

export default StatsPage;
