import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axiosInstance";
import { MdAccessTime, MdPerson, MdSportsBaseball, MdTrendingUp } from "react-icons/md";
import { FaBaseballBatBall } from "react-icons/fa6";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation, getTeamIdFromName } from "../../constants/teams";

interface BettingStatsProps {
  playerId: number;
  gamesCount: number;
  onGamesCountChange: (count: number) => void;
}

interface RecentHittingGame {
  game_date: string;
  opponent_team: string;
  at_bats: number;
  hits: number;
  total_bases: number;
  home_runs: number;
  rbis: number;
  runs: number;
  strikeouts: number;
  walks: number;
}

interface RecentPitchingGame {
  game_date: string;
  opponent_team: string;
  innings_pitched: string;
  runs: number;
  hits_allowed: number;
  strikeouts: number;
  walks_allowed: number;
  home_runs_allowed: number;
}

type RecentGame = RecentHittingGame | RecentPitchingGame;

type PlayerType = "Hitter" | "Pitcher" | "TWP";

interface BettingStats {
  betting_stats: {
    [key: string]: number | { [key: string]: number };
  };
  games_found: number;
  player_id: number;
  player_name: string;
  player_type: PlayerType;
  recent_stats: RecentGame[];
}

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <Box
    p={4}
    bg="panelSubtle"
    borderRadius="md"
    borderWidth="1px"
    borderColor="borderSubtle"
    _hover={{ transform: "scale(1.02)", borderColor: "borderStrong" }}
    transition="all 0.2s"
  >
    <Text fontSize="sm" color="textMuted" mb={1}>
      {title}
    </Text>
    <Flex align="center" justify="space-between">
      <Text fontSize="xl" fontWeight="bold" color="textPrimary">
        {value}%
      </Text>
      <Badge colorScheme={value >= 70 ? "green" : value >= 50 ? "yellow" : "red"} fontSize="sm" borderRadius="full" px={2}>
        {value >= 70 ? "High" : value >= 50 ? "Medium" : "Low"}
      </Badge>
    </Flex>
  </Box>
);

const HitterStats = ({ stats }: { stats: Record<string, number> }) => {
  const sections: Array<{ title: string; entries: Record<string, number | undefined> }> = [
    {
      title: "Home Runs",
      entries: {
        "Over 0.5 Home Runs": stats.over_0_5_home_runs,
      },
    },
    {
      title: "Hits",
      entries: {
        "Over 0.5 Hits": stats.over_0_5_hits,
        "Over 1.5 Hits": stats.over_1_5_hits,
        "Over 2.5 Hits": stats.over_2_5_hits,
      },
    },
    {
      title: "RBIs",
      entries: {
        "Over 0.5 RBIs": stats.over_0_5_rbis,
        "Over 1.5 RBIs": stats.over_1_5_rbis,
        "Over 2.5 RBIs": stats.over_2_5_rbis,
      },
    },
    {
      title: "Total Bases",
      entries: {
        "Over 1.5 Total Bases": stats.over_1_5_total_bases,
        "Over 2.5 Total Bases": stats.over_2_5_total_bases,
        "Over 3.5 Total Bases": stats.over_3_5_total_bases,
      },
    },
    {
      title: "Combined (Hits + Runs + RBIs)",
      entries: {
        "Over 1.5 H+R+RBI": stats.over_1_5_hits_runs_rbis,
        "Over 2.5 H+R+RBI": stats.over_2_5_hits_runs_rbis,
        "Over 3.5 H+R+RBI": stats.over_3_5_hits_runs_rbis,
        "Over 4.5 H+R+RBI": stats.over_4_5_hits_runs_rbis,
      },
    },
  ];

  return (
    <>
      {sections.map((section, idx) => (
        <Box key={section.title}>
          <Heading size="sm" mb={3} color="brand.400">
            {section.title}
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
            {Object.entries(section.entries).map(([title, value]) => (
              <StatCard key={title} title={title} value={value ?? 0} />
            ))}
          </SimpleGrid>
          {idx < sections.length - 1 ? <Divider my={4} borderColor="borderSubtle" /> : null}
        </Box>
      ))}
    </>
  );
};

const PitcherStats = ({ stats }: { stats: Record<string, number> }) => {
  const sections: Array<{ title: string; entries: Record<string, number | undefined> }> = [
    {
      title: "Strikeouts",
      entries: {
        "Over 3.5 Strikeouts": stats.over_3_5_strikeouts,
        "Over 4.5 Strikeouts": stats.over_4_5_strikeouts,
        "Over 5.5 Strikeouts": stats.over_5_5_strikeouts,
        "Over 6.5 Strikeouts": stats.over_6_5_strikeouts,
        "Over 7.5 Strikeouts": stats.over_7_5_strikeouts,
        "Over 8.5 Strikeouts": stats.over_8_5_strikeouts,
      },
    },
    {
      title: "Innings Pitched",
      entries: {
        "Over 4.5 Innings": stats.over_4_5_innings_pitched,
        "Over 5.5 Innings": stats.over_5_5_innings_pitched,
        "Over 6.5 Innings": stats.over_6_5_innings_pitched,
      },
    },
    {
      title: "Hits Allowed",
      entries: {
        "Over 3.5 Hits Allowed": stats.over_3_5_hits_allowed,
        "Over 4.5 Hits Allowed": stats.over_4_5_hits_allowed,
        "Over 5.5 Hits Allowed": stats.over_5_5_hits_allowed,
        "Over 6.5 Hits Allowed": stats.over_6_5_hits_allowed,
        "Over 7.5 Hits Allowed": stats.over_7_5_hits_allowed,
        "Over 8.5 Hits Allowed": stats.over_8_5_hits_allowed,
        "Over 9.5 Hits Allowed": stats.over_9_5_hits_allowed,
      },
    },
    {
      title: "Runs Allowed",
      entries: {
        "Over 1.5 Runs Allowed": stats.over_1_5_runs_allowed,
        "Over 2.5 Runs Allowed": stats.over_2_5_runs_allowed,
        "Over 3.5 Runs Allowed": stats.over_3_5_runs_allowed,
        "Over 4.5 Runs Allowed": stats.over_4_5_runs_allowed,
        "Over 5.5 Runs Allowed": stats.over_5_5_runs_allowed,
      },
    },
  ];

  return (
    <>
      {sections.map((section, idx) => (
        <Box key={section.title}>
          <Heading size="sm" mb={3} color="brand.400">
            {section.title}
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
            {Object.entries(section.entries).map(([title, value]) => (
              <StatCard key={title} title={title} value={value ?? 0} />
            ))}
          </SimpleGrid>
          {idx < sections.length - 1 ? <Divider my={4} borderColor="borderSubtle" /> : null}
        </Box>
      ))}
    </>
  );
};

const GameLog = ({ games, playerType }: { games: RecentGame[]; playerType: "Hitter" | "Pitcher" }) => {
  const renderGameStats = (game: RecentGame) => {
    const isHitting = playerType === "Hitter";
    const hittingGame = game as RecentHittingGame;
    const pitchingGame = game as RecentPitchingGame;

    return (
      <SimpleGrid columns={2} spacing={2} fontSize="sm">
        {isHitting ? (
          <>
            <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="textMuted" /><Text>H/AB: {hittingGame.hits}/{hittingGame.at_bats}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>Total Bases: {hittingGame.total_bases}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>HR: {hittingGame.home_runs}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>RBI: {hittingGame.rbis}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>R: {hittingGame.runs}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>K: {hittingGame.strikeouts}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>BB: {hittingGame.walks}</Text></Flex>
          </>
        ) : (
          <>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>IP: {pitchingGame.innings_pitched}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdTrendingUp} color="textMuted" /><Text>ER: {pitchingGame.runs}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="textMuted" /><Text>Hits Allowed: {pitchingGame.hits_allowed}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdPerson} color="textMuted" /><Text>Strikeouts: {pitchingGame.strikeouts}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>BB: {pitchingGame.walks_allowed}</Text></Flex>
            <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="textMuted" /><Text>HR Allowed: {pitchingGame.home_runs_allowed}</Text></Flex>
          </>
        )}
      </SimpleGrid>
    );
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {games.map((game, index) => (
        <Box
          key={`${game.game_date}-${index}-${playerType}`}
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
          {renderGameStats(game)}
        </Box>
      ))}
    </SimpleGrid>
  );
};

const calculateBettingStats = (games: RecentGame[], playerType: "Hitter" | "Pitcher"): Record<string, number> => {
  const stats: Record<string, number> = {};
  const totalGames = games.length;

  if (totalGames === 0) {
    return stats;
  }

  if (playerType === "Pitcher") {
    const pitcherGames = games as RecentPitchingGame[];

    stats.over_3_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 3.5).length / totalGames) * 100);
    stats.over_4_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 4.5).length / totalGames) * 100);
    stats.over_5_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 5.5).length / totalGames) * 100);
    stats.over_6_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 6.5).length / totalGames) * 100);
    stats.over_7_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 7.5).length / totalGames) * 100);
    stats.over_8_5_strikeouts = Math.round((pitcherGames.filter((g) => g.strikeouts > 8.5).length / totalGames) * 100);

    stats.over_4_5_innings_pitched = Math.round((pitcherGames.filter((g) => parseFloat(g.innings_pitched) > 4.5).length / totalGames) * 100);
    stats.over_5_5_innings_pitched = Math.round((pitcherGames.filter((g) => parseFloat(g.innings_pitched) > 5.5).length / totalGames) * 100);
    stats.over_6_5_innings_pitched = Math.round((pitcherGames.filter((g) => parseFloat(g.innings_pitched) > 6.5).length / totalGames) * 100);

    stats.over_3_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 3.5).length / totalGames) * 100);
    stats.over_4_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 4.5).length / totalGames) * 100);
    stats.over_5_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 5.5).length / totalGames) * 100);
    stats.over_6_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 6.5).length / totalGames) * 100);
    stats.over_7_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 7.5).length / totalGames) * 100);
    stats.over_8_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 8.5).length / totalGames) * 100);
    stats.over_9_5_hits_allowed = Math.round((pitcherGames.filter((g) => g.hits_allowed > 9.5).length / totalGames) * 100);

    stats.over_1_5_runs_allowed = Math.round((pitcherGames.filter((g) => g.runs > 1.5).length / totalGames) * 100);
    stats.over_2_5_runs_allowed = Math.round((pitcherGames.filter((g) => g.runs > 2.5).length / totalGames) * 100);
    stats.over_3_5_runs_allowed = Math.round((pitcherGames.filter((g) => g.runs > 3.5).length / totalGames) * 100);
    stats.over_4_5_runs_allowed = Math.round((pitcherGames.filter((g) => g.runs > 4.5).length / totalGames) * 100);
    stats.over_5_5_runs_allowed = Math.round((pitcherGames.filter((g) => g.runs > 5.5).length / totalGames) * 100);

    return stats;
  }

  const hitterGames = games as RecentHittingGame[];
  stats.over_0_5_hits = Math.round((hitterGames.filter((g) => g.hits > 0.5).length / totalGames) * 100);
  stats.over_1_5_hits = Math.round((hitterGames.filter((g) => g.hits > 1.5).length / totalGames) * 100);
  stats.over_2_5_hits = Math.round((hitterGames.filter((g) => g.hits > 2.5).length / totalGames) * 100);

  stats.over_0_5_rbis = Math.round((hitterGames.filter((g) => g.rbis > 0.5).length / totalGames) * 100);
  stats.over_1_5_rbis = Math.round((hitterGames.filter((g) => g.rbis > 1.5).length / totalGames) * 100);
  stats.over_2_5_rbis = Math.round((hitterGames.filter((g) => g.rbis > 2.5).length / totalGames) * 100);

  stats.over_1_5_total_bases = Math.round((hitterGames.filter((g) => g.total_bases > 1.5).length / totalGames) * 100);
  stats.over_2_5_total_bases = Math.round((hitterGames.filter((g) => g.total_bases > 2.5).length / totalGames) * 100);
  stats.over_3_5_total_bases = Math.round((hitterGames.filter((g) => g.total_bases > 3.5).length / totalGames) * 100);

  stats.over_1_5_hits_runs_rbis = Math.round((hitterGames.filter((g) => g.hits + g.runs + g.rbis > 1.5).length / totalGames) * 100);
  stats.over_2_5_hits_runs_rbis = Math.round((hitterGames.filter((g) => g.hits + g.runs + g.rbis > 2.5).length / totalGames) * 100);
  stats.over_3_5_hits_runs_rbis = Math.round((hitterGames.filter((g) => g.hits + g.runs + g.rbis > 3.5).length / totalGames) * 100);
  stats.over_4_5_hits_runs_rbis = Math.round((hitterGames.filter((g) => g.hits + g.runs + g.rbis > 4.5).length / totalGames) * 100);

  stats.over_0_5_home_runs = Math.round((hitterGames.filter((g) => g.home_runs > 0.5).length / totalGames) * 100);
  return stats;
};

const PlayerBettingStats: React.FC<BettingStatsProps> = ({ playerId, gamesCount, onGamesCountChange }) => {
  const [showGameLog, setShowGameLog] = useState(false);

  const { data, isLoading, error } = useQuery<BettingStats, Error>({
    queryKey: ["playerBettingStats", playerId, gamesCount],
    queryFn: async () => {
      const response = await apiClient.get<BettingStats>(`/player/betting-stats/${playerId}/${gamesCount}`);
      const responseData = response.data as BettingStats & { error?: string };
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      return response.data;
    },
    enabled: Boolean(playerId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Flex justify="center" p={8}>
        <Spinner size="xl" color="accent.500" />
      </Flex>
    );
  }

  if (error || !data) {
    const errorMessage = error instanceof Error ? error.message : "Error loading betting statistics.";
    const displayMessage = errorMessage.includes("list index out of range") ? "Player doesn't have any recent games to analyze" : errorMessage;

    return (
      <Box p={6} bg="panelSubtle" borderRadius="xl" borderWidth="1px" borderColor="borderSubtle">
        <Text fontSize="lg" textAlign="center" color="red.500">
          {displayMessage}
        </Text>
      </Box>
    );
  }

  const totalGames = data.games_found || 0;
  const availableGameCounts = totalGames > 0 ? Array.from({ length: Math.min(totalGames, 20) }, (_, i) => i + 1) : [];
  const validGamesCount = Math.max(1, Math.min(gamesCount, totalGames, 20));
  const recentStats = data.recent_stats || [];
  const statsToCalculate = recentStats.slice(0, validGamesCount);
  const basePlayerType: "Hitter" | "Pitcher" = data.player_type === "Pitcher" ? "Pitcher" : "Hitter";
  const bettingStatsCalculated = calculateBettingStats(statsToCalculate, basePlayerType);
  const gameLogPlayerType: "Hitter" | "Pitcher" = basePlayerType;

  const renderBettingContent = () => {
    if (data.player_type === "TWP") {
      const hittingStats = calculateBettingStats(statsToCalculate, "Hitter");
      const pitchingStats = calculateBettingStats(statsToCalculate, "Pitcher");

      return (
        <Tabs variant="line" colorScheme="accent" defaultIndex={0}>
          <TabList>
            <Tab>Hitting Props</Tab>
            <Tab>Pitching Props</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <HitterStats stats={hittingStats} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <PitcherStats stats={pitchingStats} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      );
    }

    if (data.player_type === "Pitcher") {
      return <PitcherStats stats={bettingStatsCalculated} />;
    }

    return <HitterStats stats={bettingStatsCalculated} />;
  };

  return (
    <Box bg="panelSubtle" p={6} borderRadius="xl" borderWidth="1px" borderColor="borderSubtle">
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={2}>
        <Heading size="md" color="textPrimary">
          Betting Performance Stats
          {data.player_type ? (
            <Badge ml={2} colorScheme={data.player_type === "TWP" ? "purple" : data.player_type === "Pitcher" ? "blue" : "green"}>
              {data.player_type}
            </Badge>
          ) : null}
        </Heading>
        <Box>
          <Select
            value={validGamesCount}
            onChange={(e) => onGamesCountChange(Number(e.target.value))}
            bg="panelBg"
            color="textPrimary"
            borderColor="borderSubtle"
            focusBorderColor="accent.500"
            maxW="180px"
            size="sm"
            borderRadius="md"
            disabled={availableGameCounts.length === 0}
          >
            {availableGameCounts.length === 0 ? <option>No Games</option> : null}
            {availableGameCounts.map((num) => (
              <option key={num} value={num}>
                Last {num} Games
              </option>
            ))}
          </Select>
        </Box>
      </Flex>

      {statsToCalculate.length > 0 ? (
        <>
          <Text mb={4} color="textMuted" fontSize="sm">
            Hit rates based on the last {validGamesCount} games played.
          </Text>

          <Button onClick={() => setShowGameLog(!showGameLog)} mb={4} variant="outline" borderColor="brand.400" color="brand.500" size="sm">
            {showGameLog ? "Hide Game Log" : "Show Game Log"}
          </Button>

          {showGameLog ? (
            <Box mb={6}>
              <GameLog games={statsToCalculate} playerType={gameLogPlayerType} />
              <Divider my={6} borderColor="borderSubtle" />
            </Box>
          ) : null}

          {renderBettingContent()}
        </>
      ) : (
        <Text fontSize="lg" textAlign="center" color="textMuted" mt={4}>
          No recent games found for analysis.
        </Text>
      )}
    </Box>
  );
};

export default PlayerBettingStats;
