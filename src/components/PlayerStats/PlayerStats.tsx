import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { MdAccessTime, MdPerson, MdSportsBaseball, MdTrendingUp } from "react-icons/md";
import { FaBaseballBatBall } from "react-icons/fa6";
import apiClient from "../../api/axiosInstance";
import TeamLogo from "../TeamLogo/TeamLogo";
import type { PlayerStats as PlayerSeasonStats } from "./interface";
import { getTeamAbbreviation, getTeamIdFromName } from "../../constants/teams";

interface RecentHittingGame {
  at_bats: number;
  avg?: number;
  game_date: string;
  hits: number;
  home_runs: number;
  opponent_pitcher?: string;
  opponent_team: string;
  rbis: number;
  runs: number;
  strikeouts: number;
  walks: number;
  total_bases: number;
}

interface RecentPitchingGame {
  game_date: string;
  game_id?: number;
  hits_allowed: number;
  home_runs_allowed: number;
  innings_pitched: string;
  opponent_team: string;
  runs: number;
  strikeouts: number;
  walks_allowed: number;
}

type RecentGame = RecentHittingGame | RecentPitchingGame;

interface RecentStatsResponse {
  games_found: number;
  player_id: number;
  player_name: string;
  recent_stats: RecentGame[];
}

interface PlayerStatsProps {
  playerId: number;
  season: string;
  onTeamIdSet?: (teamId: number) => void;
  onError?: () => void;
  onSeasonChange: (season: string) => void;
}

interface HittingStatsProps {
  stats: NonNullable<PlayerSeasonStats["hitting_stats"]>;
  season: string;
  onSeasonChange: (season: string) => void;
  seasons: string[];
}

interface PitchingStatsProps {
  stats: PlayerSeasonStats;
  seasonYear: string;
  onSeasonChange: (season: string) => void;
  seasons: string[];
}

const normalizeRecentStatsError = (message: string): string => {
  const lower = message.toLowerCase();

  if (
    lower.includes("different loop") ||
    lower.includes("task <task") ||
    lower.includes("future pending") ||
    lower.includes("error fetching recent player stats")
  ) {
    return "Recent game feed is temporarily unavailable from the backend. Please try again in a minute.";
  }

  if (lower.includes("list index out of range")) {
    return "No recent game data is available for this player yet.";
  }

  return message;
};

const StatBox: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
  <Stat bg="panelSubtle" p={4} borderRadius="md" textAlign="center" borderWidth="1px" borderColor="borderSubtle">
    <StatLabel color="textMuted" fontSize="11px" textTransform="uppercase" letterSpacing="0.08em">
      {label}
    </StatLabel>
    <StatNumber color="textPrimary" fontSize="xl">
      {value ?? "-"}
    </StatNumber>
  </Stat>
);

const SectionHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <Flex justify="space-between" align="center" mb={4} gap={3} wrap="wrap">
    <Text fontSize="11px" textTransform="uppercase" letterSpacing="0.1em" fontWeight={700} color="textMuted">
      {title}
    </Text>
    {right}
  </Flex>
);

const HittingStats: React.FC<HittingStatsProps> = ({ stats, season, onSeasonChange, seasons }) => (
  <VStack align="stretch" spacing={5}>
    <Box>
      <SectionHeader
        title={`Season Hitting (${season})`}
        right={
          <Select value={season} onChange={(e) => onSeasonChange(e.target.value)} maxW="180px" size="sm" bg="panelBg">
            {seasons.map((year) => (
              <option key={year} value={year}>
                {year} Season
              </option>
            ))}
          </Select>
        }
      />
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
        <StatBox label="AVG" value={stats.season.avg} />
        <StatBox label="HR" value={stats.season.home_runs} />
        <StatBox label="RBI" value={stats.season.rbi} />
        <StatBox label="OPS" value={stats.season.ops} />
        <StatBox label="Games" value={stats.season.games} />
        <StatBox label="Hits" value={stats.season.hits} />
        <StatBox label="Runs" value={stats.season.runs} />
        <StatBox label="SB" value={stats.season.stolen_bases} />
      </SimpleGrid>
    </Box>

    <Divider borderColor="borderSubtle" />

    <Box>
      <SectionHeader title="Career Hitting" />
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
        <StatBox label="AVG" value={stats.career.avg} />
        <StatBox label="HR" value={stats.career.home_runs} />
        <StatBox label="RBI" value={stats.career.rbi} />
        <StatBox label="OPS" value={stats.career.ops} />
        <StatBox label="Games" value={stats.career.games} />
        <StatBox label="Hits" value={stats.career.hits} />
        <StatBox label="Runs" value={stats.career.runs} />
        <StatBox label="SB" value={stats.career.stolen_bases} />
      </SimpleGrid>
    </Box>
  </VStack>
);

const PitchingStats: React.FC<PitchingStatsProps> = ({ stats, seasonYear, onSeasonChange, seasons }) => {
  const career = stats.pitching_stats?.career ?? stats.career_stats;
  const season = stats.pitching_stats?.season ?? stats.season_stats;

  return (
    <VStack align="stretch" spacing={5}>
      <Box>
        <SectionHeader
          title={`Season Pitching (${seasonYear})`}
          right={
            <Select value={seasonYear} onChange={(e) => onSeasonChange(e.target.value)} maxW="180px" size="sm" bg="panelBg">
              {seasons.map((year) => (
                <option key={year} value={year}>
                  {year} Season
                </option>
              ))}
            </Select>
          }
        />
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
          <StatBox label="ERA" value={season?.era} />
          <StatBox label="W-L" value={`${season?.wins ?? 0}-${season?.losses ?? 0}`} />
          <StatBox label="IP" value={season?.innings_pitched} />
          <StatBox label="WHIP" value={season?.whip} />
          <StatBox label="K" value={season?.strikeouts} />
          <StatBox label="BB" value={season?.walks} />
          <StatBox label="Games" value={season?.games} />
          <StatBox label="GS" value={season?.games_started} />
        </SimpleGrid>
      </Box>

      <Divider borderColor="borderSubtle" />

      <Box>
        <SectionHeader title="Career Pitching" />
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
          <StatBox label="ERA" value={career?.era} />
          <StatBox label="W-L" value={`${career?.wins ?? 0}-${career?.losses ?? 0}`} />
          <StatBox label="IP" value={career?.innings_pitched} />
          <StatBox label="WHIP" value={career?.whip} />
          <StatBox label="K" value={career?.strikeouts} />
          <StatBox label="BB" value={career?.walks} />
          <StatBox label="G" value={career?.games} />
          <StatBox label="GS" value={career?.games_started} />
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

const PlayerStats: React.FC<PlayerStatsProps> = ({ playerId, season, onTeamIdSet, onError, onSeasonChange }) => {
  const [gamesCount, setGamesCount] = useState<number>(5);
  const currentYear = new Date().getFullYear();
  const seasons = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const { data: stats, isLoading: isLoadingInfo, error: seasonStatsError } = useQuery<PlayerSeasonStats, Error>({
    queryKey: ["playerStats", playerId, season],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/player/stats/${playerId}/${season}`);
        const payload = response.data as PlayerSeasonStats & { error?: string };

        if (payload.error || !payload || Object.keys(payload).length === 0) {
          throw new Error("No data available for this season");
        }

        return payload;
      } catch (error) {
        console.error("Error fetching player stats:", error);
        if (season === new Date().getFullYear().toString() && onError) {
          onError();
        }
        throw error;
      }
    },
    retry: false,
    enabled: Boolean(playerId),
  });

  const isRookieOrNoData = seasonStatsError?.message.includes("No data available");

  const {
    data: recentStats,
    isLoading: isLoadingRecent,
    error: recentStatsError,
  } = useQuery<RecentStatsResponse, Error>({
    queryKey: ["recentStats", playerId, gamesCount],
    queryFn: async () => {
      const response = await apiClient.get(`/player/recent-stats/${playerId}/${gamesCount}`);
      const payload = response.data as RecentStatsResponse & { error?: string };

      if (payload.error || !payload || !payload.recent_stats) {
        throw new Error(payload.error || "Could not fetch recent stats");
      }

      return payload;
    },
    enabled: Boolean(playerId),
    staleTime: 1000 * 60 * 2,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const playerInfo = stats?.player_info;

  useEffect(() => {
    if (stats?.player_info?.current_team && onTeamIdSet) {
      const teamId = getTeamIdFromName(stats.player_info.current_team);
      if (teamId) {
        onTeamIdSet(teamId);
      }
    }
  }, [stats, onTeamIdSet]);

  const playerType = playerInfo?.position === "P" ? "Pitcher" : playerInfo?.position === "TWP" ? "TWP" : "Hitter";

  const createHittingStatsObject = (statsToUse: PlayerSeasonStats) => {
    if (statsToUse.hitting_stats) return statsToUse.hitting_stats;

    return {
      career: statsToUse.career_stats
        ? {
            games: String(statsToUse.career_stats.games ?? "0"),
            at_bats: String(statsToUse.career_stats.at_bats ?? "0"),
            hits: String(statsToUse.career_stats.hits ?? "0"),
            avg: String(statsToUse.career_stats.avg ?? ".000"),
            home_runs: String(statsToUse.career_stats.home_runs ?? "0"),
            rbi: String(statsToUse.career_stats.rbi ?? "0"),
            runs: String(statsToUse.career_stats.runs ?? "0"),
            stolen_bases: String(statsToUse.career_stats.stolen_bases ?? "0"),
            obp: String(statsToUse.career_stats.obp ?? ".000"),
            slg: String(statsToUse.career_stats.slg ?? ".000"),
            ops: String(statsToUse.career_stats.ops ?? ".000"),
          }
        : {
            games: "0",
            at_bats: "0",
            hits: "0",
            avg: ".000",
            home_runs: "0",
            rbi: "0",
            runs: "0",
            stolen_bases: "0",
            obp: ".000",
            slg: ".000",
            ops: ".000",
          },
      season: statsToUse.season_stats
        ? {
            games: String(statsToUse.season_stats.games ?? "0"),
            at_bats: String(statsToUse.season_stats.at_bats ?? "0"),
            hits: String(statsToUse.season_stats.hits ?? "0"),
            avg: String(statsToUse.season_stats.avg ?? ".000"),
            home_runs: String(statsToUse.season_stats.home_runs ?? "0"),
            rbi: String(statsToUse.season_stats.rbi ?? "0"),
            runs: String(statsToUse.season_stats.runs ?? "0"),
            stolen_bases: String(statsToUse.season_stats.stolen_bases ?? "0"),
            obp: String(statsToUse.season_stats.obp ?? ".000"),
            slg: String(statsToUse.season_stats.slg ?? ".000"),
            ops: String(statsToUse.season_stats.ops ?? ".000"),
          }
        : {
            games: "0",
            at_bats: "0",
            hits: "0",
            avg: ".000",
            home_runs: "0",
            rbi: "0",
            runs: "0",
            stolen_bases: "0",
            obp: ".000",
            slg: ".000",
            ops: ".000",
          },
    };
  };

  const renderPlayerTypeStats = () => {
    if (isLoadingInfo) {
      return (
        <Flex justify="center" p={8}>
          <Spinner size="xl" color="accent.500" />
        </Flex>
      );
    }

    if (seasonStatsError && !isRookieOrNoData) {
      return (
        <Box p={4} bg="panelSubtle" borderRadius="md" textAlign="center" borderWidth="1px" borderColor="borderSubtle">
          <Text fontSize="lg" color="red.500">
            Error loading season stats: {seasonStatsError.message}
          </Text>
        </Box>
      );
    }

    if (isRookieOrNoData) {
      return (
        <Box p={4} bg="panelSubtle" borderRadius="md" textAlign="center" borderWidth="1px" borderColor="borderSubtle">
          <Text fontSize="lg" color="yellow.500">
            No {season} season stats available (rookie or no games played).
          </Text>
        </Box>
      );
    }

    if (!stats) {
      return (
        <Text color="textMuted" textAlign="center">
          Waiting for player stats...
        </Text>
      );
    }

    const isTwoWayPlayer = playerType === "TWP";
    const hasHittingStats = Boolean(stats.hitting_stats || stats.career_stats?.avg !== undefined || stats.season_stats?.avg !== undefined);
    const hasPitchingStats = Boolean(stats.pitching_stats || stats.career_stats?.era !== undefined || stats.season_stats?.era !== undefined);

    if (isTwoWayPlayer) {
      return (
        <Tabs variant="line" colorScheme="accent" defaultIndex={0}>
          <TabList mb="1em">
            {hasHittingStats ? <Tab>Hitting</Tab> : null}
            {hasPitchingStats ? <Tab>Pitching</Tab> : null}
          </TabList>
          <TabPanels>
            {hasHittingStats ? (
              <TabPanel p={0}>
                <HittingStats stats={createHittingStatsObject(stats)} season={season} onSeasonChange={onSeasonChange} seasons={seasons} />
              </TabPanel>
            ) : null}
            {hasPitchingStats ? (
              <TabPanel p={0}>
                <PitchingStats stats={stats} seasonYear={season} onSeasonChange={onSeasonChange} seasons={seasons} />
              </TabPanel>
            ) : null}
          </TabPanels>
        </Tabs>
      );
    }

    if (playerType === "Pitcher" && hasPitchingStats) {
      return <PitchingStats stats={stats} seasonYear={season} onSeasonChange={onSeasonChange} seasons={seasons} />;
    }

    if (playerType === "Hitter" && hasHittingStats) {
      return <HittingStats stats={createHittingStatsObject(stats)} season={season} onSeasonChange={onSeasonChange} seasons={seasons} />;
    }

    return (
      <Text color="textMuted" textAlign="center" fontSize="lg" p={4}>
        No {season} season statistics available for this player.
      </Text>
    );
  };

  return (
    <Box bg="panelBg" p={{ base: 4, md: 6 }} borderRadius="xl" borderWidth="1px" borderColor="borderSubtle" color="textPrimary">
      <VStack spacing={6} align="stretch">
        {isLoadingInfo || stats?.player_info ? (
          <Grid
            templateColumns={{ base: "1fr", md: "auto 1fr" }}
            gap={{ base: 4, md: 6 }}
            alignItems="center"
            p={4}
            borderRadius="lg"
            position="relative"
            overflow="hidden"
            bgImage={stats?.player_info?.images?.action}
            bgSize="cover"
            bgPosition="center 10%"
            bgRepeat="no-repeat"
            borderWidth="1px"
            borderColor="borderSubtle"
            _before={{
              content: '""',
              position: "absolute",
              inset: 0,
              bgGradient: "linear(to-r, rgba(12,35,64,0.88), rgba(12,35,64,0.62))",
              zIndex: 1,
            }}
          >
            <Box position="relative" zIndex={2} w="full">
              {isLoadingInfo && !playerInfo ? (
                <Flex align="center" justify="center" minH="120px" gridColumn="1 / -1">
                  <Spinner size="lg" color="white" mr={3} />
                  <Text color="white">Loading Player Info...</Text>
                </Flex>
              ) : playerInfo ? (
                <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 4, md: 6 }}>
                  <Image
                    src={playerInfo.images?.headshot || "https://via.placeholder.com/150"}
                    alt={playerInfo.full_name}
                    borderRadius="full"
                    boxSize={{ base: "100px", md: "120px" }}
                    objectFit="cover"
                    border="3px solid"
                    borderColor="accent.500"
                  />
                  <VStack align={{ base: "center", md: "start" }} spacing={1} w="full">
                    <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color="white" textAlign={{ base: "center", md: "left" }}>
                      {playerInfo.full_name}
                    </Heading>
                    <HStack divider={<Text mx={2} color="whiteAlpha.600">•</Text>} fontSize="sm" color="whiteAlpha.900" wrap="wrap" justify={{ base: "center", md: "start" }}>
                      <Text>Age: {playerInfo.age}</Text>
                      <Text>Pos: {playerInfo.position}</Text>
                      <Text>Bats: {playerInfo.bat_side}</Text>
                      <Text>Throws: {playerInfo.throw_hand}</Text>
                    </HStack>
                    <HStack mt={1} justify={{ base: "center", md: "start" }}>
                      <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.800">
                        Team:
                      </Text>
                      <Text fontWeight="bold" color="white">
                        {playerInfo.current_team || "N/A"}
                      </Text>
                      {playerInfo.current_team ? <TeamLogo teamId={getTeamIdFromName(playerInfo.current_team)} size="24px" /> : null}
                    </HStack>
                  </VStack>
                </Flex>
              ) : null}
            </Box>
          </Grid>
        ) : null}

        {!isLoadingInfo && !isRookieOrNoData ? (
          <Box>
            <SectionHeader
              title={`Last ${gamesCount} Games`}
              right={
                <Select
                  value={gamesCount}
                  onChange={(e) => setGamesCount(Number(e.target.value))}
                  maxW="180px"
                  size="sm"
                  bg="panelBg"
                  isDisabled={isLoadingRecent}
                >
                  {[2, 5, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      Last {num} Games
                    </option>
                  ))}
                </Select>
              }
            />

            {isLoadingRecent ? (
              <Flex justify="center" p={5}>
                <Spinner size="md" color="accent.500" />
                <Text ml={3} color="textSecondary">
                  Loading recent games...
                </Text>
              </Flex>
            ) : recentStatsError ? (
              <Text color="yellow.600" textAlign="center">
                Could not load recent games: {normalizeRecentStatsError(recentStatsError.message)}
              </Text>
            ) : !recentStats?.recent_stats || recentStats.recent_stats.length === 0 ? (
              <Text color="textMuted" textAlign="center">
                No recent game data available for the selected period.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {recentStats.recent_stats.map((game, index) => {
                  const isHitting = "at_bats" in game;
                  const key = `${game.game_date}-${index}-${playerId}`;

                  return (
                    <Box
                      key={key}
                      p={4}
                      bg="panelSubtle"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="borderSubtle"
                      _hover={{ transform: "translateY(-2px)", borderColor: "borderStrong" }}
                      transition="all 0.2s"
                    >
                      <Flex align="center" justify="space-between" mb={3}>
                        <Flex align="center" gap={2}>
                          <TeamLogo teamId={getTeamIdFromName(game.opponent_team)} size="28px" />
                          <Text fontWeight="bold" fontSize="sm">
                            vs {getTeamAbbreviation(game.opponent_team)}
                          </Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                          <Icon as={MdAccessTime} color="textMuted" />
                          <Text fontSize="xs" color="textMuted">
                            {new Date(game.game_date).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </Flex>

                      {isHitting ? (
                        <SimpleGrid columns={2} spacing={2} fontSize="sm">
                          <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="textMuted" /><Text>H/AB: {(game as RecentHittingGame).hits}/{(game as RecentHittingGame).at_bats}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>Total Bases: {(game as RecentHittingGame).total_bases}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>HR: {(game as RecentHittingGame).home_runs}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>RBI: {(game as RecentHittingGame).rbis}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>R: {(game as RecentHittingGame).runs}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>K: {(game as RecentHittingGame).strikeouts}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>BB: {(game as RecentHittingGame).walks}</Text></Flex>
                        </SimpleGrid>
                      ) : (
                        <SimpleGrid columns={2} spacing={2} fontSize="sm">
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>IP: {(game as RecentPitchingGame).innings_pitched}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdTrendingUp} color="textMuted" /><Text>ER: {(game as RecentPitchingGame).runs}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="textMuted" /><Text>Hits Allowed: {(game as RecentPitchingGame).hits_allowed}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>Strikeouts: {(game as RecentPitchingGame).strikeouts}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>BB: {(game as RecentPitchingGame).walks_allowed}</Text></Flex>
                          <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>HR Allowed: {(game as RecentPitchingGame).home_runs_allowed}</Text></Flex>
                        </SimpleGrid>
                      )}
                    </Box>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        ) : null}

        <Divider borderColor="borderSubtle" />

        {renderPlayerTypeStats()}
      </VStack>
    </Box>
  );
};

export default PlayerStats;
