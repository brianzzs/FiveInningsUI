
import React from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    SimpleGrid,
    Spinner,
    VStack,
    HStack,
    Card,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdPerson, MdAccessTime, MdOutlineReceiptLong, MdSportsBaseball } from "react-icons/md";
import axios from "axios";
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
                <Text fontSize="xl" color="white">
                    Check ANY team stats here:
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
        <SimpleGrid columns={[1, 1, 3]} spacing={6} mt={4} p={4}>
            {GamesData.map((game, index) => {
                const gameDate = new Date(game.game_datetime);
                const formattedDate = gameDate.toLocaleString();
                return (
                    <Box
                        key={index}
                        p={4}
                        borderRadius="md"
                        shadow="md"
                        textAlign="center"
                        bg={"#113f67"}
                    >
                        <Flex direction={{ base: "column", md: "row" }} justify="space-between" mb={4}>
                            <Card flexDirection={"row"} overflow={"hidden"} alignItems={"center"} maxW={"x1"}
                                bg={"#113f67"} fontStyle={"normal"} color={"#f5f5f5"} p={4} borderRadius={"md"}
                                fontFamily={"Inter"} borderColor={"#f5f5f5"} borderWidth={0.5} boxShadow={"md"}>
                                <VStack spacing={4}>
                                    <TeamLogo teamId={game.away_team.id} />
                                </VStack>
                                <Text fontSize="lg" fontWeight={"bold"}>
                                    {game.away_team.name}{" "}
                                </Text>
                                <Text fontSize="lg" fontWeight={"bold"} alignSelf={"center"}>
                                    ({game.away_team.wins}-{game.away_team.losses})
                                </Text>
                                <HStack spacing={6} margin={2}>
                                    <Text fontSize="xl">@</Text>
                                </HStack>
                                <HStack spacing={2}>
                                    <Text fontSize="lg" fontWeight={"bold"} alignSelf={"center"}>
                                        ({game.home_team.wins}-{game.home_team.losses})
                                    </Text>

                                    <Text fontSize="lg" fontWeight={"bold"} alignSelf={"center"}>
                                        {game.home_team.name}{" "}
                                    </Text>
                                    <VStack spacing={4}>
                                        <TeamLogo teamId={game.home_team.id} />
                                    </VStack>
                                </HStack>
                            </Card>
                        </Flex>
                        <SimpleGrid columns={[0, 3]} fontFamily={"Inter"} color={"#f5f5f5"} p={4} borderRadius={"md"} >
                            <Box alignSelf="center">
                                <Text>
                                    <MdPerson size="24px" style={{ float: "left" }} />
                                    {game.away_team.probable_pitcher.name} ({game.away_team.probable_pitcher.hand})
                                </Text>
                                <Text>
                                    <MdOutlineReceiptLong size="24px" style={{ float: "left" }} />
                                    W-L: {game.away_team.probable_pitcher.wins}-
                                    {game.away_team.probable_pitcher.losses}
                                </Text>

                                <Text>
                                    <MdSportsBaseball size="24px" style={{ float: "left" }} />
                                    ERA: {game.away_team.probable_pitcher.era}
                                </Text>
                            </Box>
                            <Box alignSelf="center">
                                <Text fontSize="lg" fontWeight="bold" alignSelf="center">
                                    VS
                                </Text>
                            </Box>
                            <Box alignSelf="center" >
                                <Text>
                                    <MdPerson size="24px" style={{ float: "left" }} />
                                    {game.home_team.probable_pitcher.name} ({game.home_team.probable_pitcher.hand})
                                </Text>
                                <Text>
                                    <MdOutlineReceiptLong size="24px" style={{ float: "left" }} />
                                    W-L: {game.home_team.probable_pitcher.wins}-
                                    {game.home_team.probable_pitcher.losses}
                                </Text>
                                <Text>
                                    <MdSportsBaseball size="24px" style={{ float: "left" }} />
                                    ERA: {game.home_team.probable_pitcher.era}
                                </Text>
                            </Box>
                        </SimpleGrid>
                        <Box mt={4}>
                            <HStack justify="center" align="center" spacing={2} marginRight={12} mt={6}
                                fontFamily={"Inter"} color={"#f5f5f5"}>
                                <MdAccessTime size="20px" />
                                <Text>{formattedDate}</Text>
                            </HStack>
                        </Box>
                    </Box >
                );
            })}
        </SimpleGrid >
    );
};
export default ScheduleCard;
