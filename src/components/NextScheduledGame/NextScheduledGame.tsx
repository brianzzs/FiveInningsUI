import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  Spinner,
  HStack,
  Divider,
} from "@chakra-ui/react";
import apiClient from "../../api/axiosInstance";
import { FaUser, FaChartLine, FaBaseballBall, FaClock } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from '../../constants/teams';
import { useNavigate } from 'react-router-dom';
import { THEME } from "../../constants";


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

const NextScheduledGame: React.FC<NextScheduledGameProps> = ({ 
  teamId, 
  fetchGame, 
  onFetchComplete,
  onPitcherSelect 
}) => {
  const [gameData, setGameData] = useState<Game[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "gray.100");

  useEffect(() => {
    if (fetchGame && teamId) {
      fetchScheduledGame();
    }
  }, [fetchGame, teamId]);

  const fetchScheduledGame = async () => {
    setIsLoading(true);
    setError(null);
    setGameData(null);

    try {
      const response = await apiClient.get(`/next_schedule/${teamId}`);
      setGameData(response.data);
      if (onFetchComplete) {
        onFetchComplete();
      }
    } catch (err: unknown) {
      console.error("Error fetching scheduled game:", err);
      let errorMessage = "Failed to fetch the next scheduled game.";
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { status?: number; data?: { error?: string } } }).response;
        if (response?.status === 404) {
          errorMessage = `No scheduled game found for team ID ${teamId}.`;
        } else if (response?.data?.error) {
          errorMessage = response.data.error;
        } 
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamClick = (id: number) => {
    navigate(`/stats`, { state: { selectedTeamId: id } });
  };

  const handleComparisonClick = (gameId: number) => {
    navigate(`/comparison/${gameId}`);
  };

  if (isLoading) {
    return (
        <Flex justify="center" align="center" p={5}>
            <Spinner size="lg" color={THEME.colors.accent} />
            <Text ml={3} color="gray.300">Loading Next Game...</Text>
        </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" p={5} bg="red.900" borderRadius="md">
        <Text color="red.100">{error}</Text>
      </Flex>
    );
  }

  if (!gameData || gameData.length === 0) {
     return fetchGame ? (
      <Flex justify="center" p={5} bg="yellow.900" borderRadius="md">
        <Text color="yellow.100">No upcoming scheduled game found for this team.</Text>
      </Flex>
     ) : null;
  }

  const scheduledGame = gameData[0];
  const gameDate = new Date(scheduledGame.game_datetime);
  const formattedDate = gameDate.toLocaleString();

  return (
      <Box 
        bg={cardBg} 
        p={5} 
        borderRadius="lg" 
        boxShadow="lg" 
        color={textColor}
       > 
        <VStack spacing={4} align="stretch">
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", sm: "row" }}
            gap={4}
          >
            <HStack 
              spacing={3} 
              cursor="pointer" 
              onClick={() => handleTeamClick(scheduledGame.away_team_id)}
              _hover={{ opacity: 0.8 }}
            >
              <TeamLogo teamId={scheduledGame.away_team_id} size="40px" />
              <VStack align="start" spacing={0}>
                 <Text fontSize="lg" fontWeight="bold">
                     {getTeamAbbreviation(scheduledGame.away_team_name)}
                 </Text>
                  <Text fontSize="xs" color="gray.400">({scheduledGame.away_team_record})</Text>
              </VStack>
            </HStack>
            
            <Text fontSize="xl" fontWeight="bold" color="gray.400">@</Text>
            
            <HStack 
              spacing={3} 
              cursor="pointer" 
              onClick={() => handleTeamClick(scheduledGame.home_team_id)}
               _hover={{ opacity: 0.8 }}
            >
              <VStack align="end" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold">
                      {getTeamAbbreviation(scheduledGame.home_team_name)}
                  </Text>
                   <Text fontSize="xs" color="gray.400">({scheduledGame.home_team_record})</Text>
               </VStack>
              <TeamLogo teamId={scheduledGame.home_team_id} size="40px" />
            </HStack>
          </Flex>

          <Flex 
            justify="space-between" 
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }} 
            gap={4}
           >
             <VStack align={{ base: "center", md: "start" }} spacing={1} flex={1}>
              <HStack 
                  cursor="pointer"
                  _hover={{ color: THEME.colors.accent }}
                  onClick={() => onPitcherSelect(scheduledGame.awayPitcherID)}
              >
                  <Icon as={FaUser} color="gray.400" />
                  <Text fontSize="sm" fontWeight="medium">{scheduledGame.awayPitcher} ({scheduledGame.awayPitcherHand})</Text>
              </HStack>
              <HStack>
                  <Icon as={FaChartLine} color="gray.400" />
                  <Text fontSize="xs">W-L: {String(scheduledGame.awayPitcherWins)}-{String(scheduledGame.awayPitcherLosses)}</Text>
              </HStack>
              <HStack>
                   <Icon as={FaBaseballBall} color="gray.400" />
                   <Text fontSize="xs">ERA: {String(scheduledGame.awayPitcherERA)}</Text>
              </HStack>
            </VStack>

            <Text fontSize="md" fontWeight="bold" color="gray.500" alignSelf="center" px={2}>VS</Text>

             <VStack align={{ base: "center", md: "end" }} spacing={1} flex={1}>
              <HStack 
                  cursor="pointer"
                  _hover={{ color: THEME.colors.accent }}
                  onClick={() => onPitcherSelect(scheduledGame.homePitcherID)}
               >
                  <Text fontSize="sm" fontWeight="medium">{scheduledGame.homePitcher} ({scheduledGame.homePitcherHand})</Text>
                  <Icon as={FaUser} color="gray.400" />
              </HStack>
              <HStack>
                  <Text fontSize="xs">W-L: {String(scheduledGame.homePitcherWins)}-{String(scheduledGame.homePitcherLosses)}</Text>
                   <Icon as={FaChartLine} color="gray.400" />
              </HStack>
               <HStack>
                   <Text fontSize="xs">ERA: {String(scheduledGame.homePitcherERA)}</Text>
                    <Icon as={FaBaseballBall} color="gray.400" />
              </HStack>
            </VStack>
          </Flex>

          <Divider borderColor="gray.600" />

          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <HStack spacing={1.5} fontSize="sm" color="gray.300">
                 <Icon as={FaClock} />
                 <Text>{formattedDate}</Text>
              </HStack>
              <Button 
                size="sm"
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={MdCompareArrows} />}
                onClick={() => handleComparisonClick(scheduledGame.game_id)}
              >
                Game Comparison
              </Button>
          </Flex>
        </VStack>
      </Box>
  );
};

export default NextScheduledGame;
