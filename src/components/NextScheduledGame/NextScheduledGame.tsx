import React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axiosInstance";
import { FaBaseballBall, FaChartLine, FaClock, FaUser } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from "../../constants/teams";
import { useNavigate } from "react-router-dom";

interface Game {
  awayPitcher: string;
  awayPitcherERA: string | number;
  awayPitcherHand: string;
  awayPitcherID: number;
  awayPitcherLosses: string | number;
  awayPitcherWins: string | number;
  away_team_id: number;
  away_team_name: string;
  away_team_record: string;
  game_id: number;
  game_datetime: string;
  homePitcher: string;
  homePitcherERA: string | number;
  homePitcherHand: string;
  homePitcherID: number;
  homePitcherLosses: string | number;
  homePitcherWins: string | number;
  home_team_id: number;
  home_team_name: string;
  home_team_record: string;
  status: string;
  venue: string;
}

interface NextScheduledGameProps {
  teamId: number;
  fetchGame: boolean;
  onFetchComplete?: () => void;
  onPitcherSelect: (playerId: number) => void;
}

const NextScheduledGame: React.FC<NextScheduledGameProps> = ({ teamId, fetchGame, onFetchComplete, onPitcherSelect }) => {
  const navigate = useNavigate();

  const {
    data: gameData,
    isLoading,
    error,
  } = useQuery<Game[], Error>({
    queryKey: ["nextSchedule", teamId],
    queryFn: async () => {
      const response = await apiClient.get<Game[]>(`/next_schedule/${teamId}`);
      return response.data;
    },
    enabled: fetchGame && Boolean(teamId),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  React.useEffect(() => {
    if (gameData && onFetchComplete) {
      onFetchComplete();
    }
  }, [gameData, onFetchComplete]);

  const handleTeamClick = (id: number) => {
    navigate(`/stats`, { state: { selectedTeamId: id } });
  };

  const handleComparisonClick = (gameId: number) => {
    navigate(`/comparison/${gameId}`);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" p={5}>
        <Spinner size="md" color="accent.500" />
        <Text ml={3} color="textSecondary">
          Loading next game...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" p={5} bg="red.50" borderRadius="md">
        <Text color="red.500">{error.message}</Text>
      </Flex>
    );
  }

  if (!gameData || gameData.length === 0) {
    return fetchGame ? (
      <Flex justify="center" p={5} bg="panelSubtle" borderRadius="md">
        <Text color="textSecondary">No upcoming scheduled game found for this team.</Text>
      </Flex>
    ) : null;
  }

  const scheduledGame = gameData[0];
  const gameDate = new Date(scheduledGame.game_datetime);
  const formattedDate = gameDate.toLocaleString();

  return (
    <Box bg="panelSubtle" p={5} borderRadius="lg" borderWidth="1px" borderColor="borderSubtle" color="textPrimary">
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={4}>
          <HStack spacing={3} cursor="pointer" onClick={() => handleTeamClick(scheduledGame.away_team_id)} _hover={{ opacity: 0.8 }}>
            <TeamLogo teamId={scheduledGame.away_team_id} size="40px" />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                {getTeamAbbreviation(scheduledGame.away_team_name)}
              </Text>
              <Text fontSize="xs" color="textMuted">
                ({scheduledGame.away_team_record})
              </Text>
            </VStack>
          </HStack>

          <Text fontSize="xl" fontWeight="bold" color="textMuted">
            @
          </Text>

          <HStack spacing={3} cursor="pointer" onClick={() => handleTeamClick(scheduledGame.home_team_id)} _hover={{ opacity: 0.8 }}>
            <VStack align="end" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                {getTeamAbbreviation(scheduledGame.home_team_name)}
              </Text>
              <Text fontSize="xs" color="textMuted">
                ({scheduledGame.home_team_record})
              </Text>
            </VStack>
            <TeamLogo teamId={scheduledGame.home_team_id} size="40px" />
          </HStack>
        </Flex>

        <Flex justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <VStack align={{ base: "center", md: "start" }} spacing={1} flex={1}>
            <HStack cursor="pointer" _hover={{ color: "accent.500" }} onClick={() => onPitcherSelect(scheduledGame.awayPitcherID)}>
              <Icon as={FaUser} color="textMuted" />
              <Text fontSize="sm" fontWeight="medium">
                {scheduledGame.awayPitcher} ({scheduledGame.awayPitcherHand})
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaChartLine} color="textMuted" />
              <Text fontSize="xs">
                W-L: {String(scheduledGame.awayPitcherWins)}-{String(scheduledGame.awayPitcherLosses)}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaBaseballBall} color="textMuted" />
              <Text fontSize="xs">ERA: {String(scheduledGame.awayPitcherERA)}</Text>
            </HStack>
          </VStack>

          <Text fontSize="md" fontWeight="bold" color="textMuted" alignSelf="center" px={2}>
            VS
          </Text>

          <VStack align={{ base: "center", md: "end" }} spacing={1} flex={1}>
            <HStack cursor="pointer" _hover={{ color: "accent.500" }} onClick={() => onPitcherSelect(scheduledGame.homePitcherID)}>
              <Text fontSize="sm" fontWeight="medium">
                {scheduledGame.homePitcher} ({scheduledGame.homePitcherHand})
              </Text>
              <Icon as={FaUser} color="textMuted" />
            </HStack>
            <HStack>
              <Text fontSize="xs">
                W-L: {String(scheduledGame.homePitcherWins)}-{String(scheduledGame.homePitcherLosses)}
              </Text>
              <Icon as={FaChartLine} color="textMuted" />
            </HStack>
            <HStack>
              <Text fontSize="xs">ERA: {String(scheduledGame.homePitcherERA)}</Text>
              <Icon as={FaBaseballBall} color="textMuted" />
            </HStack>
          </VStack>
        </Flex>

        <Divider borderColor="borderSubtle" />

        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
          <HStack spacing={1.5} fontSize="sm" color="textSecondary">
            <Icon as={FaClock} />
            <Text>{formattedDate}</Text>
          </HStack>
          <Button size="sm" variant="outline" borderColor="brand.400" color="brand.500" leftIcon={<Icon as={MdCompareArrows} />} onClick={() => handleComparisonClick(scheduledGame.game_id)}>
            Game Comparison
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default NextScheduledGame;
