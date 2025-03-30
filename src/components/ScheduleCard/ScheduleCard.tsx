import React from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    SimpleGrid,
    VStack,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Card,
    CardHeader,
    CardBody,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { MdPerson, MdAccessTime, MdOutlineReceiptLong, MdSportsBaseball, MdHandshake } from "react-icons/md";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from '../../constants/teams';

// Define the new Game interface matching the API response
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

interface TodayScheduleProps {
    GamesData: Game[];
    onPitcherSelect: (playerId: number) => void;
}

const ScheduleCard = ({ GamesData, onPitcherSelect }: TodayScheduleProps) => {
    const navigate = useNavigate();

    const handleTeamClick = (teamId: number) => {
        navigate(`/stats`, { state: { selectedTeamId: teamId } });
    };

    if (GamesData.length === 0) {
        return (
            <Flex direction="column" justify="center" align="center" height="50vh" bg="#2c323a">
                <Text fontSize="2xl" color="white" mb={4}>
                    No MLB games scheduled for today!
                </Text>
                <Link to="/stats">
                    <Button mt={4} bg="#00ce81" _hover={{ bg: "#009e5c" }} borderRadius="20px">
                        Check team stats
                    </Button>
                </Link>
            </Flex>
        );
    }

    return (
        <SimpleGrid columns={[1, 1, 3]} spacing={6} mt={4}>
            {GamesData.map((game, index) => (
                <Card key={index} bg="gray.800" color="white">
                    <CardHeader bg="gray.700" p={4}>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">Game {index + 1}</Text>
                            <HStack>
                                <MdAccessTime />
                                <Text>{new Date(game.game_datetime).toLocaleString()}</Text>
                            </HStack>
                        </Flex>
                    </CardHeader>
                    <CardBody p={4} overflowX={"auto"}>
                        <Flex justify="space-between" align="center" mb={6}>
                            <HStack spacing={3}>
                                <TeamLogo teamId={game.away_team_id} size="50px" />
                                <VStack align="start" spacing={0}>
                                    <Text
                                        fontWeight="bold"
                                        _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() => handleTeamClick(game.away_team_id)}
                                    >
                                        {getTeamAbbreviation(game.away_team_name)}
                                    </Text>
                                </VStack>
                            </HStack>
                            <Text fontSize="xl" fontWeight="bold">@</Text>
                            <HStack spacing={3}>
                                <VStack align="end" spacing={0}>
                                    <Text
                                        fontWeight="bold"
                                        _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() => handleTeamClick(game.home_team_id)}
                                    >
                                        {getTeamAbbreviation(game.home_team_name)}
                                    </Text>
                                </VStack>
                                <TeamLogo teamId={game.home_team_id} size="50px" />
                            </HStack>
                        </Flex>

                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th color="gray.400">Pitcher</Th>
                                    <Th color="gray.400" isNumeric>ERA</Th>
                                    <Th color="gray.400" isNumeric>Record</Th>
                                    <Th color="gray.400" isNumeric textAlign={"left"}>Hand</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        <HStack>
                                            <MdPerson />
                                            <Text
                                                _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                                                onClick={() => onPitcherSelect(game.awayPitcherID)}
                                            >
                                                {game.awayPitcher}
                                            </Text>
                                            <Text fontSize={"xs"} color={"gray.400"}>({getTeamAbbreviation(game.away_team_name)})</Text>
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
                                            <Text>{String(game.awayPitcherWins)}-{String(game.awayPitcherLosses)}</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack>
                                            <MdHandshake style={{ float: "left" }} />
                                            <Text>{game.awayPitcherHand}</Text>
                                        </HStack>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <HStack>
                                            <MdPerson />
                                            <Text
                                                _hover={{ color: "#00ce81", textDecoration: "underline", cursor: "pointer" }}
                                                onClick={() => onPitcherSelect(game.homePitcherID)}
                                            >
                                                {game.homePitcher}
                                            </Text>
                                            <Text fontSize={"xs"} color={"gray.400"}>({getTeamAbbreviation(game.home_team_name)})</Text>
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
                                            <Text>{String(game.homePitcherWins)}-{String(game.homePitcherLosses)}</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack>
                                            <MdHandshake style={{ float: "left" }} />
                                            <Text>{game.homePitcherHand}</Text>
                                        </HStack>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card>
            ))}
        </SimpleGrid>
    );
};

export default ScheduleCard;
