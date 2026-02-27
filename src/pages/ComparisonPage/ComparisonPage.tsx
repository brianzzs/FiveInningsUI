import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axiosInstance";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  MdBarChart,
  MdCalendarToday,
  MdInfoOutline,
  MdOutlineErrorOutline,
  MdPeople,
  MdSportsBaseball,
  MdStadium,
  MdTrendingUp,
} from "react-icons/md";
import TeamLogo from "../../components/TeamLogo/TeamLogo";
import { getTeamAbbreviation } from "../../constants/teams";
import { StatisticsData } from "../../types/StatisticsData";
import { AppShell } from "../../components/Layout/AppShell";
import PageTitle from "../../components/UI/PageTitle";
import QueryState from "../../components/UI/QueryState";
import SectionCard from "../../components/UI/SectionCard";

interface H2HStats {
  PA: number;
  AB?: number;
  H?: number;
  AVG?: string;
  OBP?: string;
  SLG?: string;
  OPS?: string;
  HR?: number;
  RBI?: number;
  SO?: number;
  BB?: number;
}

interface Player {
  id: number;
  name: string;
  position: string;
  avg?: string;
  h2h_stats?: H2HStats;
}

interface Pitcher {
  hand: string;
  id: number;
  name: string;
  season_era: string | number;
}

interface TeamInfo {
  id: number;
  lineup: Player[] | null;
  name: string;
  lineup_status?: string;
}

interface GameInfo {
  away_pitcher: Pitcher;
  away_team: TeamInfo;
  game_datetime: string;
  game_id: number;
  home_pitcher: Pitcher;
  home_team: TeamInfo;
  status: string;
  venue: string;
}

interface TeamComparison {
  away: StatisticsData;
  home: StatisticsData;
  lookback_games: number;
}

interface ComparisonData {
  game_info: GameInfo;
  team_comparison: TeamComparison;
}

const StatDisplay: React.FC<{ label: string; value: number; icon?: React.ElementType }> = ({ label, value, icon }) => {
  return (
    <Flex
      justify="space-between"
      w="100%"
      align="center"
      borderWidth="1px"
      borderColor="borderSubtle"
      borderRadius="md"
      px={3}
      py={2.5}
      bg="panelSubtle"
    >
      <HStack spacing={2}>
        {icon ? <Icon as={icon} color="textMuted" boxSize={4} /> : null}
        <Text color="textSecondary" fontSize="sm" lineHeight="1">
          {label}
        </Text>
      </HStack>
      <Badge colorScheme={value >= 70 ? "green" : value >= 50 ? "yellow" : "red"} variant="solid" fontSize="xs" px={2} py={0.5} borderRadius="full">
        {value}%
      </Badge>
    </Flex>
  );
};

const getAvgColor = (avgString: string | undefined): string => {
  if (!avgString || avgString === "-") return "textPrimary";

  const avg = parseFloat(avgString);
  if (Number.isNaN(avg)) return "textPrimary";

  if (avg >= 0.299) return "statGood";
  if (avg < 0.25) return "statBad";
  return "statWarn";
};

const H2HTable: React.FC<{ players: Player[] | null; pitcherName: string; teamName: string }> = ({ players, pitcherName, teamName }) => {
  if (!players || players.length === 0) {
    return <Text fontSize="sm" color="textMuted">No opposing lineup data available for H2H.</Text>;
  }

  const playersWithH2H = players.filter((p) => p.h2h_stats && p.h2h_stats.PA > 0);

  if (playersWithH2H.length === 0) {
    return (
      <Text fontSize="sm" color="textMuted">
        No significant H2H history against {pitcherName}.
      </Text>
    );
  }

  return (
    <Box>
      <Heading size="xs" color="textPrimary" mb={2} textTransform="uppercase" letterSpacing="0.05em">
        {getTeamAbbreviation(teamName)} vs {pitcherName}
      </Heading>
      <TableContainer whiteSpace="normal" overflowX="auto" borderWidth="1px" borderColor="borderSubtle" borderRadius="md">
        <Table variant="simple" size="sm">
          <Thead bg="panelMuted">
            <Tr>
              <Th px={2} py={2} color="textSecondary" textTransform="none">Player</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">PA</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">AB</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">H</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">AVG</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">OBP</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">SLG</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">OPS</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">HR</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">RBI</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">SO</Th>
              <Th px={2} py={2} color="textSecondary" isNumeric textTransform="none">BB</Th>
            </Tr>
          </Thead>
          <Tbody>
            {playersWithH2H.map((player) => (
              <Tr key={player.id} _hover={{ bg: "panelSubtle" }} transition="background-color 0.2s">
                <Td px={2} py={1.5} fontSize="xs" color="textPrimary" borderBottomColor="borderSubtle">{player.name}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.PA ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.AB ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.H ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color={getAvgColor(player.h2h_stats?.AVG)} fontWeight="bold" borderBottomColor="borderSubtle">{player.h2h_stats?.AVG ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.OBP ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.SLG ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.OPS ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.HR ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.RBI ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.SO ?? "-"}</Td>
                <Td px={2} py={1.5} fontSize="xs" isNumeric color="textPrimary" borderBottomColor="borderSubtle">{player.h2h_stats?.BB ?? "-"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ComparisonPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<ComparisonData, Error>({
    queryKey: ["gameComparison", gameId],
    queryFn: async () => {
      if (!gameId) throw new Error("Game ID is required");
      const response = await apiClient.get<ComparisonData>(`/comparison/${gameId}`);
      return response.data;
    },
    enabled: Boolean(gameId),
    retry: 1,
  });

  const handlePlayerClick = (playerId: number) => {
    navigate(`/players`, { state: { selectedPlayerId: playerId } });
  };

  const handleTeamClick = (teamId: number) => {
    navigate(`/stats`, { state: { selectedTeamId: teamId } });
  };

  const renderLineup = (lineup: Player[] | null, lineupStatus: string | undefined) => (
    <VStack align="start" spacing={2} w="100%" p={2}>
      <Flex align="center" w="100%">
        <Heading size="xs" color="textPrimary" display="flex" alignItems="center" textTransform="uppercase" letterSpacing="0.05em">
          <Icon as={MdPeople} mr={2} boxSize={4.5} /> Lineup
        </Heading>
        {lineupStatus ? (
          <Badge ml={2} fontSize="0.7em" colorScheme={lineupStatus === "Confirmed" ? "green" : "yellow"} variant="subtle" borderRadius="full" px={2}>
            {lineupStatus}
          </Badge>
        ) : null}
      </Flex>
      {lineup && lineup.length > 0 ? (
        <VStack align="start" spacing={1} pl={2} w="100%">
          {lineup.map((player) => (
            <Text
              key={player.id}
              fontSize="sm"
              cursor="pointer"
              _hover={{ color: "accent.500", textDecoration: "underline" }}
              onClick={() => handlePlayerClick(player.id)}
              lineHeight="short"
              color="textPrimary"
            >
              {player.name}
              <Text as="span" color="textMuted" fontSize="0.7rem" ml={1.5}>
                ({player.avg ? `${player.avg} AVG / ` : ""}{player.position})
              </Text>
            </Text>
          ))}
        </VStack>
      ) : (
        <HStack color="yellow.500" fontSize="sm" pl={2}>
          <Icon as={MdOutlineErrorOutline} />
          <Text>No lineup released yet.</Text>
        </HStack>
      )}
    </VStack>
  );

  const renderPitcherInfo = (pitcher: Pitcher) => (
    <Box pl={2}>
      <Heading size="xs" color="textPrimary" mb={2} display="flex" alignItems="center" w="100%" textTransform="uppercase" letterSpacing="0.05em">
        <Icon as={MdSportsBaseball} mr={2} boxSize={4.5} /> Starting Pitcher
      </Heading>
      <Text
        fontSize="sm"
        fontWeight="medium"
        cursor="pointer"
        _hover={{ color: "accent.500", textDecoration: "underline" }}
        onClick={() => handlePlayerClick(pitcher.id)}
        lineHeight="short"
        color="textPrimary"
      >
        {pitcher.name} <Text as="span" color="textMuted" fontSize="xs">({pitcher.hand})</Text>
      </Text>
      <Text fontSize="xs" color="textSecondary">
        {pitcher.season_era !== "TBD" ? `${pitcher.season_era} ERA` : "Season ERA TBD"}
      </Text>
    </Box>
  );

  const renderComparisonStats = (stats: StatisticsData, lookback: number) => (
    <VStack align="stretch" spacing={2.5} w="100%" p={2}>
      <Heading size="xs" color="textPrimary" mb={1.5} display="flex" alignItems="center" textTransform="uppercase" letterSpacing="0.05em">
        <Icon as={MdBarChart} mr={2} boxSize={4.5} /> Stats (Last {lookback} Games)
      </Heading>
      <StatDisplay label="Team NRFI %" value={stats.nrfi} icon={MdInfoOutline} />
      <StatDisplay label="Game NRFI %" value={stats.game_nrfi_percentage} icon={MdInfoOutline} />
      <StatDisplay label="F5 Win %" value={stats.win_percentage_f5} icon={MdTrendingUp} />
      <StatDisplay label="F5 Over 1.5 Runs %" value={stats.over1_5F5} icon={MdTrendingUp} />
      <StatDisplay label="F5 Over 2.5 Runs %" value={stats.over2_5F5} icon={MdTrendingUp} />
    </VStack>
  );

  const gameDate = data?.game_info.game_datetime ? new Date(data.game_info.game_datetime) : null;
  const formattedDate = gameDate ? gameDate.toLocaleString() : "TBD";

  return (
    <AppShell>
      <VStack spacing={6} align="stretch">
        <PageTitle
          eyebrow="Game Board"
          title="Matchup Comparison"
          subtitle="Lineup availability, starter profile, F5 probability stack, and H2H history side by side."
        />

        <QueryState
          isLoading={isLoading}
          errorMessage={error ? `Error fetching game comparison data: ${error.message}` : null}
          hasData={Boolean(data)}
          loadingText="Loading game comparison..."
        />

        {data ? (
          <SectionCard p={{ base: 4, md: 6 }}>
            <Card bg="panelSubtle" borderColor="borderSubtle">
              <CardHeader py={4} px={{ base: 4, md: 6 }} bg="panelMuted" borderBottomWidth="1px" borderColor="borderSubtle">
                <Flex justify="space-between" align="center" wrap={{ base: "wrap", md: "nowrap" }} gap={4}>
                  <HStack spacing={3} flexShrink={0} cursor="pointer" onClick={() => handleTeamClick(data.game_info.away_team.id)} _hover={{ opacity: 0.8 }}>
                    <TeamLogo teamId={data.game_info.away_team.id} size="50px" />
                    <Heading size="md" color="textPrimary" noOfLines={1} textTransform="uppercase" letterSpacing="0.04em">
                      {getTeamAbbreviation(data.game_info.away_team.name)}
                    </Heading>
                  </HStack>
                  <VStack spacing={1} textAlign="center" px={2} flexGrow={1} minWidth="170px">
                    <Heading size="lg" color="accent.500" fontWeight="bold" letterSpacing="0.08em">VS</Heading>
                    <HStack spacing={1.5} fontSize={{ base: "xs", md: "sm" }} color="textSecondary"><Icon as={MdStadium} /><Text>{data.game_info.venue}</Text></HStack>
                    <HStack spacing={1.5} fontSize={{ base: "xs", md: "sm" }} color="textSecondary"><Icon as={MdCalendarToday} /><Text>{formattedDate}</Text></HStack>
                    <Badge colorScheme={data.game_info.status === "Live" ? "red" : "gray"} variant="solid" fontSize="xs" px={2}>{data.game_info.status}</Badge>
                  </VStack>
                  <HStack spacing={3} justify="flex-end" flexShrink={0} cursor="pointer" onClick={() => handleTeamClick(data.game_info.home_team.id)} _hover={{ opacity: 0.8 }}>
                    <Heading size="md" color="textPrimary" noOfLines={1} textTransform="uppercase" letterSpacing="0.04em">
                      {getTeamAbbreviation(data.game_info.home_team.name)}
                    </Heading>
                    <TeamLogo teamId={data.game_info.home_team.id} size="50px" />
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody pt={5} pb={6} px={{ base: 4, md: 6 }}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                  <Card bg="panelBg" borderColor="borderSubtle">
                    <CardBody p={5}>
                      <VStack spacing={4} align="stretch">
                        {renderLineup(data.game_info.away_team.lineup, data.game_info.away_team.lineup_status)}
                        <Divider borderColor="borderSubtle" />
                        {renderPitcherInfo(data.game_info.away_pitcher)}
                        <Divider borderColor="borderSubtle" />
                        {renderComparisonStats(data.team_comparison.away, data.team_comparison.lookback_games)}
                        <Divider borderColor="borderSubtle" />
                        <H2HTable
                          players={data.game_info.away_team.lineup}
                          pitcherName={data.game_info.home_pitcher.name}
                          teamName={data.game_info.away_team.name}
                        />
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card bg="panelBg" borderColor="borderSubtle">
                    <CardBody p={5}>
                      <VStack spacing={4} align="stretch">
                        {renderLineup(data.game_info.home_team.lineup, data.game_info.home_team.lineup_status)}
                        <Divider borderColor="borderSubtle" />
                        {renderPitcherInfo(data.game_info.home_pitcher)}
                        <Divider borderColor="borderSubtle" />
                        {renderComparisonStats(data.team_comparison.home, data.team_comparison.lookback_games)}
                        <Divider borderColor="borderSubtle" />
                        <H2HTable
                          players={data.game_info.home_team.lineup}
                          pitcherName={data.game_info.away_pitcher.name}
                          teamName={data.game_info.home_team.name}
                        />
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </CardBody>
            </Card>
          </SectionCard>
        ) : null}
      </VStack>
    </AppShell>
  );
};

export default ComparisonPage;
