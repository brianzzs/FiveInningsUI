import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import PlayerSearch from "../../components/PlayerSearch/PlayerSearch";
import PlayerStats from "../../components/PlayerStats/PlayerStats";
import PlayerBettingStats from "../../components/PlayerBettingStats/PlayerBettingStats";
import NextScheduledGame from "../../components/NextScheduledGame/NextScheduledGame";
import { logEvent } from "../../utils/analytics";
import { AppShell } from "../../components/Layout/AppShell";
import SectionCard from "../../components/UI/SectionCard";
import PageTitle from "../../components/UI/PageTitle";

const popularPlayers = [
  { id: 592450, name: "Aaron Judge", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current" },
  { id: 660271, name: "Shohei Ohtani", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current" },
  { id: 608331, name: "Max Fried", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608331/headshot/67/current" },
  { id: 669373, name: "Tarik Skubal", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/669373/headshot/67/current" },
  { id: 547180, name: "Bryce Harper", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/547180/headshot/67/current" },
  { id: 660670, name: "Ronald Acuña Jr.", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660670/headshot/67/current" },
  { id: 608369, name: "Corey Seager", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608369/headshot/67/current" },
  { id: 694973, name: "Paul Skenes", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/694973/headshot/67/current" },
  { id: 677951, name: "Bobby Witt Jr.", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/677951/headshot/67/current" },
  { id: 554430, name: "Zack Wheeler", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/554430/headshot/67/current" },
  { id: 665742, name: "Juan Soto", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/665742/headshot/67/current" },
  { id: 543037, name: "Gerrit Cole", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current" },
  { id: 605141, name: "Mookie Betts", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current" },
  { id: 518692, name: "Freddie Freeman", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current" },
  { id: 596019, name: "Francisco Lindor", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/596019/headshot/67/current" },
  { id: 670541, name: "Yordan Alvarez", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/670541/headshot/67/current" },
  { id: 608070, name: "José Ramírez", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608070/headshot/67/current" },
  { id: 683002, name: "Gunnar Henderson", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/683002/headshot/67/current" },
];

const PlayerPage: React.FC = () => {
  const location = useLocation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [bettingGamesCount, setBettingGamesCount] = useState(5);
  const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
  const [fetchGame, setFetchGame] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();
  const currentSeason = currentYear.toString();

  useEffect(() => {
    const state = location.state as { selectedPlayerId?: number } | null;
    if (state?.selectedPlayerId) {
      setSelectedPlayerId(state.selectedPlayerId);
      setSelectedSeason(currentSeason);
      setFetchGame(true);
    }
  }, [location, currentSeason]);

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setSelectedSeason(currentSeason);
    setBettingGamesCount(5);
    setPlayerTeamId(null);
    setFetchGame(true);

    logEvent("player_selected", {
      player_id: playerId,
      season: currentSeason,
    });
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);

    logEvent("season_changed", {
      player_id: selectedPlayerId,
      season,
    });
  };

  const handleStatsError = () => {
    if (selectedSeason === currentSeason) {
      const fallbackSeason = (currentYear - 1).toString();
      setSelectedSeason(fallbackSeason);
      logEvent("season_fallback", {
        player_id: selectedPlayerId,
        from_season: currentSeason,
        to_season: fallbackSeason,
      });
    }
  };

  return (
    <AppShell>
      <VStack spacing={6} align="stretch">
        <PageTitle
          eyebrow="Player Dashboard"
          title="Player Intelligence"
          subtitle="Search players, validate recent form, and inspect betting hit rates in a tighter scouting workflow."
        />

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={5}>
          <SectionCard gridColumn={{ base: "auto", xl: "span 2" }}>
            <PlayerSearch onPlayerSelect={handlePlayerSelect} />
          </SectionCard>
          <SectionCard>
            <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" color="textMuted" fontWeight={700} mb={2}>
              Search Tip
            </Text>
            <Text color="textSecondary" fontSize="sm">
              Start typing at least 3 characters. Selecting a pitcher from any page keeps this route and loads their full split profile.
            </Text>
          </SectionCard>
        </SimpleGrid>

        {!selectedPlayerId ? (
          <SectionCard>
            <Text mb={5} fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" color="textMuted" fontSize="11px">
              Popular Players
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} spacing={4}>
              {popularPlayers.map((player) => (
                <Flex
                  key={player.id}
                  direction="column"
                  align="center"
                  bg="panelSubtle"
                  borderWidth="1px"
                  borderColor="borderSubtle"
                  p={4}
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={() => handlePlayerSelect(player.id)}
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-4px)", borderColor: "brand.300", boxShadow: "panel" }}
                >
                  <Avatar src={player.image} size="xl" mb={3} />
                  <Text color="textPrimary" fontSize="sm" textAlign="center" fontWeight={700} lineHeight="1.2">
                    {player.name}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </SectionCard>
        ) : (
          <>
            <SectionCard>
              <Tabs variant="line" colorScheme="accent" isLazy lazyBehavior="keepMounted">
                <TabList>
                  <Tab>Player Stats</Tab>
                  <Tab>Betting Analysis</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <PlayerStats
                      playerId={selectedPlayerId}
                      season={selectedSeason}
                      onTeamIdSet={setPlayerTeamId}
                      onError={handleStatsError}
                      onSeasonChange={handleSeasonChange}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <PlayerBettingStats
                      playerId={selectedPlayerId}
                      gamesCount={bettingGamesCount}
                      onGamesCountChange={setBettingGamesCount}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </SectionCard>

            {playerTeamId ? (
              <SectionCard>
                <Text mb={4} fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" color="textMuted" fontSize="11px">
                  Next Scheduled Game
                </Text>
                <NextScheduledGame teamId={playerTeamId} fetchGame={fetchGame} onPitcherSelect={handlePlayerSelect} />
              </SectionCard>
            ) : null}
          </>
        )}
      </VStack>
    </AppShell>
  );
};

export default PlayerPage;
