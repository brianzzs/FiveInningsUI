import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { FaUser, FaChartLine, FaBaseballBall, FaClock } from "react-icons/fa";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from '../../constants/teams';
import { useNavigate } from 'react-router-dom';

// Remove or comment out the old Team interface
/*
interface Team {
  id: number;
  name: string;
  wins: number;
  losses: number;
  probable_pitcher: {
    name: string;
    hand: string;
    wins: number;
    losses: number;
    era: number;
    id: number;
  };
}
*/

// Update the Game interface to match the new flat structure
interface Game {
    awayPitcher: string;
    awayPitcherERA: string | number;
    awayPitcherHand: string;
    awayPitcherID: number;
    awayPitcherLosses: string | number;
    awayPitcherWins: string | number;
    away_team_id: number;
    away_team_name: string;
    game_id: number;
    game_datetime: string; // Assuming this maps from game_time_utc or game_time_local
    homePitcher: string;
    homePitcherERA: string | number;
    homePitcherHand: string;
    homePitcherID: number;
    homePitcherLosses: string | number;
    homePitcherWins: string | number;
    home_team_id: number;
    home_team_name: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "gray.200");

  useEffect(() => {
    if (fetchGame && teamId) {
      fetchScheduledGame();
    }
  }, [fetchGame, teamId]);

  const fetchScheduledGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/next_schedule/${teamId}`);
      setGameData(response.data);
      if (onFetchComplete) {
        onFetchComplete();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch scheduled game.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamClick = (teamId: number) => {
    navigate(`/stats`, { state: { selectedTeamId: teamId } });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (gameData && gameData.length > 0) {
    const scheduledGame = gameData[0];
    const gameDate = new Date(scheduledGame.game_datetime);
    const formattedDate = `${gameDate.toLocaleDateString()} ${gameDate.toLocaleTimeString()}`;

    return (
      <Box maxW="800px" mx="auto">
        <Box
          bg={cardBg}
          p={4}
          borderRadius="md"
          boxShadow="lg"
          color={textColor}>
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", sm: "row" }}
            mb={3}>
            <Flex align="center">
              <TeamLogo teamId={scheduledGame.away_team_id} size="40px" />
              <VStack align="start" ml={3}>
                <Text 
                  fontSize="md" 
                  fontWeight="bold"
                  _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => handleTeamClick(scheduledGame.away_team_id)}
                >
                  {getTeamAbbreviation(scheduledGame.away_team_name)}
                </Text>
                {/* Remove Team Wins/Losses display if not available */}
                {/* 
                <Text fontSize="xs">
                  ({scheduledGame.away_team.wins}-{scheduledGame.away_team.losses})
                </Text>
                */}
              </VStack>
            </Flex>
            <Text fontSize="xl" mx={3}>
              @
            </Text>
            <Flex align="center">
              <VStack align="end" mr={3}>
                <Text 
                  fontSize="md" 
                  fontWeight="bold"
                  _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => handleTeamClick(scheduledGame.home_team_id)}
                >
                  {getTeamAbbreviation(scheduledGame.home_team_name)}
                </Text>
                {/* Remove Team Wins/Losses display if not available */}
                {/* 
                <Text fontSize="xs">
                  ({scheduledGame.home_team.wins}-{scheduledGame.home_team.losses})
                </Text>
                 */}
              </VStack>
              <TeamLogo teamId={scheduledGame.home_team_id} size="40px" />
            </Flex>
          </Flex>

          <Flex justify="space-between" wrap="wrap" mb={3}>
            <Flex flex="1" justify="space-between" align="center">
              {[
                {
                  icon: FaUser,
                  label: (
                    <Text 
                      fontSize="sm"
                      _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => onPitcherSelect(scheduledGame.awayPitcherID)}
                    >
                      {scheduledGame.awayPitcher} ({scheduledGame.awayPitcherHand})
                    </Text>
                  ),
                },
                {
                  icon: FaChartLine,
                  label: `W-L: ${String(scheduledGame.awayPitcherWins)}-${String(scheduledGame.awayPitcherLosses)}`,
                },
                {
                  icon: FaBaseballBall,
                  label: `ERA: ${String(scheduledGame.awayPitcherERA)}`,
                },
              ].map((item, index) => (
                <VStack key={index} align="center" w="30%">
                  <Icon as={item.icon} boxSize={5} />
                  {typeof item.label === 'string' ? <Text fontSize="xs">{item.label}</Text> : item.label}
                </VStack>
              ))}
            </Flex>

            <Text fontSize="md" mx={3} alignSelf="center" flexShrink={0}>
              VS
            </Text>

            <Flex flex="1" justify="space-between" align="center">
              {[
                {
                  icon: FaUser,
                  label: (
                    <Text 
                      fontSize="sm"
                      _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => onPitcherSelect(scheduledGame.homePitcherID)}
                    >
                      {scheduledGame.homePitcher} ({scheduledGame.homePitcherHand})
                    </Text>
                  ),
                },
                {
                  icon: FaChartLine,
                  label: `W-L: ${String(scheduledGame.homePitcherWins)}-${String(scheduledGame.homePitcherLosses)}`,
                },
                {
                  icon: FaBaseballBall,
                  label: `ERA: ${String(scheduledGame.homePitcherERA)}`,
                },
              ].map((item, index) => (
                <VStack key={index} align="center" w="30%">
                  <Icon as={item.icon} boxSize={5} />
                  {typeof item.label === 'string' ? <Text fontSize="xs">{item.label}</Text> : item.label}
                </VStack>
              ))}
            </Flex>
          </Flex>

          <Flex justify="center">
            <Text fontSize="xs">
              <Icon as={FaClock} mr={2} />
              {formattedDate}
            </Text>
          </Flex>
        </Box>
      </Box>
    );
  }

  return null;
};

export default NextScheduledGame;
