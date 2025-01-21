import React from "react";
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
  };
}

interface Game {
  game_datetime: string;
  away_team: Team;
  home_team: Team;
}

interface NextScheduledGameProps {
  teamId: number;
  fetchGame: boolean;
  onFetchComplete?: () => void;
}

interface NextScheduledGameState {
  gameData: Game[] | null;
  isLoading: boolean;
  error: string | null;
}

class NextScheduledGame extends React.Component<
  NextScheduledGameProps,
  NextScheduledGameState
> {
  constructor(props: NextScheduledGameProps) {
    super(props);
    this.state = {
      gameData: null,
      isLoading: true,
      error: null,
    };
  }

  componentDidUpdate(prevProps: NextScheduledGameProps) {
    if (!prevProps.fetchGame && this.props.fetchGame) {
      this.fetchScheduledGame();
    }
  }

  fetchScheduledGame() {
    const { teamId, onFetchComplete } = this.props;

    this.setState({ isLoading: true, error: null });

    axios
      .get(`http://127.0.0.1:5000/schedule/${teamId}`)
      .then((response) => {
        const gameData = response.data;
        this.setState({ gameData, isLoading: false });

        if (onFetchComplete) {
          onFetchComplete();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({
          gameData: null,
          isLoading: false,
          error: "Failed to fetch scheduled game.",
        });
      });
  }

  render() {
    const { gameData, isLoading, error } = this.state;

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

      const cardBg = useColorModeValue("gray.700", "gray.800");
      const textColor = useColorModeValue("white", "gray.200");

      return (
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={12}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" color={textColor}>
              Next Game
            </Text>
          </GridItem>

          <GridItem colSpan={12}>
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
                mb={4}>
                <Flex align="center">
                  <TeamLogo teamId={scheduledGame.away_team.id} />
                  <VStack align="start" ml={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      {scheduledGame.away_team.name}
                    </Text>
                    <Text fontSize="sm">
                      ({scheduledGame.away_team.wins}-{scheduledGame.away_team.losses})
                    </Text>
                  </VStack>
                </Flex>
                <Text fontSize="2xl" mx={4}>
                  @
                </Text>
                <Flex align="center">
                  <VStack align="end" mr={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      {scheduledGame.home_team.name}
                    </Text>
                    <Text fontSize="sm">
                      ({scheduledGame.home_team.wins}-{scheduledGame.home_team.losses})
                    </Text>
                  </VStack>
                  <TeamLogo teamId={scheduledGame.home_team.id} />
                </Flex>
              </Flex>

              <Flex justify="space-between" wrap="wrap" mb={4}>
                {[
                  {
                    icon: FaUser,
                    label: `${scheduledGame.away_team.probable_pitcher.name} (${scheduledGame.away_team.probable_pitcher.hand})`,
                  },
                  {
                    icon: FaChartLine,
                    label: `W-L: ${scheduledGame.away_team.probable_pitcher.wins}-${scheduledGame.away_team.probable_pitcher.losses}`,
                  },
                  {
                    icon: FaBaseballBall,
                    label: `ERA: ${scheduledGame.away_team.probable_pitcher.era}`,
                  },
                ].map((item, index) => (
                  <VStack key={index} align="center" w="30%">
                    <Icon as={item.icon} boxSize={6} />
                    <Text fontSize="sm">{item.label}</Text>
                  </VStack>
                ))}

                <Text fontSize="lg" mx={4} alignSelf="center">
                  VS
                </Text>

                {[
                  {
                    icon: FaUser,
                    label: `${scheduledGame.home_team.probable_pitcher.name} (${scheduledGame.home_team.probable_pitcher.hand})`,
                  },
                  {
                    icon: FaChartLine,
                    label: `W-L: ${scheduledGame.home_team.probable_pitcher.wins}-${scheduledGame.home_team.probable_pitcher.losses}`,
                  },
                  {
                    icon: FaBaseballBall,
                    label: `ERA: ${scheduledGame.home_team.probable_pitcher.era}`,
                  },
                ].map((item, index) => (
                  <VStack key={index} align="center" w="30%">
                    <Icon as={item.icon} boxSize={6} />
                    <Text fontSize="sm">{item.label}</Text>
                  </VStack>
                ))}
              </Flex>

              <Flex justify="center">
                <Text fontSize="sm">
                  <Icon as={FaClock} mr={2} />
                  {formattedDate}
                </Text>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      );
    }

    return null;
  }
}

export default NextScheduledGame;
