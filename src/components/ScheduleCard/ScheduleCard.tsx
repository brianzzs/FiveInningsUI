import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAccessTime,
  MdCompareArrows,
  MdHandshake,
  MdOutlineReceiptLong,
  MdPerson,
  MdSportsBaseball,
} from "react-icons/md";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from "../../constants/teams";

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

interface TodayScheduleProps {
  GamesData: Game[];
  onPitcherSelect: (playerId: number) => void;
}

const ScheduleCard = ({ GamesData, onPitcherSelect }: TodayScheduleProps) => {
  const navigate = useNavigate();

  const handleTeamClick = (teamId: number) => {
    navigate(`/stats`, { state: { selectedTeamId: teamId } });
  };

  const handleComparisonClick = (gameId: number) => {
    navigate(`/comparison/${gameId}`);
  };

  if (GamesData.length === 0) {
    return (
      <Flex direction="column" justify="center" align="center" py={10} borderWidth="1px" borderColor="borderSubtle" borderRadius="xl" bg="panelSubtle">
        <Text fontSize="xl" color="textPrimary" mb={4}>
          No MLB games scheduled for today.
        </Text>
        <Link to="/stats">
          <Button variant="cta">Check team stats</Button>
        </Link>
      </Flex>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5} mt={4}>
      {GamesData.map((game, index) => (
        <Card key={game.game_id ?? index}>
          <CardHeader bg="panelMuted" p={4} borderBottomWidth="1px" borderColor="borderSubtle">
            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <Text fontSize="lg" fontWeight="bold">
                Game {index + 1}
              </Text>
              <HStack color="textSecondary">
                <MdAccessTime />
                <Text fontSize="sm">{new Date(game.game_datetime).toLocaleString()}</Text>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody p={4} overflowX="auto">
            <Flex justify="space-between" align="center" mb={6}>
              <HStack spacing={3}>
                <TeamLogo teamId={game.away_team_id} size="50px" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" _hover={{ color: "accent.500", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleTeamClick(game.away_team_id)}>
                    {getTeamAbbreviation(game.away_team_name)}
                  </Text>
                  <Text fontSize="xs" color="textMuted">
                    ({game.away_team_record})
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="xl" fontWeight="bold" color="textMuted">
                @
              </Text>
              <HStack spacing={3}>
                <VStack align="end" spacing={0}>
                  <Text fontWeight="bold" _hover={{ color: "accent.500", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleTeamClick(game.home_team_id)}>
                    {getTeamAbbreviation(game.home_team_name)}
                  </Text>
                  <Text fontSize="xs" color="textMuted">
                    ({game.home_team_record})
                  </Text>
                </VStack>
                <TeamLogo teamId={game.home_team_id} size="50px" />
              </HStack>
            </Flex>

            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th color="textMuted">Pitcher</Th>
                  <Th color="textMuted" isNumeric>
                    ERA
                  </Th>
                  <Th color="textMuted" isNumeric>
                    Record
                  </Th>
                  <Th color="textMuted" isNumeric textAlign="left">
                    Hand
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <HStack>
                      <MdPerson />
                      <Text _hover={{ color: "accent.500", textDecoration: "underline", cursor: "pointer" }} onClick={() => onPitcherSelect(game.awayPitcherID)}>
                        {game.awayPitcher}
                      </Text>
                      <Text fontSize="xs" color="textMuted">
                        ({getTeamAbbreviation(game.away_team_name)})
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <MdSportsBaseball />
                      <Text>{String(game.awayPitcherERA)}</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <MdOutlineReceiptLong />
                      <Text>
                        {String(game.awayPitcherWins)}-{String(game.awayPitcherLosses)}
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack>
                      <MdHandshake />
                      <Text>{game.awayPitcherHand}</Text>
                    </HStack>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <HStack>
                      <MdPerson />
                      <Text _hover={{ color: "accent.500", textDecoration: "underline", cursor: "pointer" }} onClick={() => onPitcherSelect(game.homePitcherID)}>
                        {game.homePitcher}
                      </Text>
                      <Text fontSize="xs" color="textMuted">
                        ({getTeamAbbreviation(game.home_team_name)})
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <MdSportsBaseball />
                      <Text>{String(game.homePitcherERA)}</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <MdOutlineReceiptLong />
                      <Text>
                        {String(game.homePitcherWins)}-{String(game.homePitcherLosses)}
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <HStack>
                      <MdHandshake />
                      <Text>{game.homePitcherHand}</Text>
                    </HStack>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Flex justify="center" mt={4}>
              <Button size="sm" variant="outline" borderColor="brand.400" color="brand.400" leftIcon={<Icon as={MdCompareArrows} />} onClick={() => handleComparisonClick(game.game_id)}>
                Game Comparison
              </Button>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default ScheduleCard;
