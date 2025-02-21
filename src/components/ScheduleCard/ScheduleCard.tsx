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
import { Link } from "react-router-dom";
import { MdPerson, MdAccessTime, MdOutlineReceiptLong, MdSportsBaseball, MdHandshake } from "react-icons/md";
import TeamLogo from "../TeamLogo/TeamLogo";
import { getTeamAbbreviation } from '../../constants/teams';

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

interface TodayScheduleProps {
    GamesData: Game[];
}

const ScheduleCard = ({ GamesData }: TodayScheduleProps) => {
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
                                <TeamLogo teamId={game.away_team.id} size="50px" />
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold">{getTeamAbbreviation(game.away_team.name)}</Text>
                                    <Text fontSize="sm">({game.away_team.wins}-{game.away_team.losses})</Text>
                                </VStack>
                            </HStack>
                            <Text fontSize="xl" fontWeight="bold">@</Text>
                            <HStack spacing={3}>
                                <VStack align="end" spacing={0}>
                                    <Text fontWeight="bold">{getTeamAbbreviation(game.home_team.name)}</Text>
                                    <Text fontSize="sm">({game.home_team.wins}-{game.home_team.losses})</Text>
                                </VStack>
                                <TeamLogo teamId={game.home_team.id} size="50px" />
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
                                            <Text>{game.away_team.probable_pitcher.name}</Text>
                                            <Text fontSize={"xs"} color={"gray.400"}>({getTeamAbbreviation(game.away_team.name)})</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack justify="flex-end">
                                            <MdSportsBaseball />
                                            <Text>{game.away_team.probable_pitcher.era}</Text>
                                        </HStack>
                                    </Td>

                                    <Td isNumeric>
                                        <HStack justify="flex-end">
                                            <MdOutlineReceiptLong />
                                            <Text>{game.away_team.probable_pitcher.wins}-{game.away_team.probable_pitcher.losses}</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack>
                                            <MdHandshake style={{ float: "left" }} />
                                            <Text>{game.away_team.probable_pitcher.hand}</Text>
                                        </HStack>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <HStack>
                                            <MdPerson />
                                            <Text>{game.home_team.probable_pitcher.name}</Text>
                                            <Text fontSize={"xs"} color={"gray.400"}>({getTeamAbbreviation(game.home_team.name)})</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack justify="flex-end">
                                            <MdSportsBaseball />
                                            <Text>{game.home_team.probable_pitcher.era}</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack justify="flex-end">
                                            <MdOutlineReceiptLong />
                                            <Text>{game.home_team.probable_pitcher.wins}-{game.home_team.probable_pitcher.losses}</Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric>
                                        <HStack>
                                            <MdHandshake style={{ float: "left" }} />
                                            <Text>{game.home_team.probable_pitcher.hand}</Text>

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
