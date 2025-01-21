import React from "react";
import {
    Box,
    Grid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Card,
    CardBody,
    CardHeader,
} from "@chakra-ui/react";

interface Team {
    id: number;
    name: string;
    probable_pitcher: {
        name: string;
    };
    runs: number[];
    total_runs: number;
}

interface Game {
    away_team: Team;
    home_team: Team;
}

interface ResultsTableProps {
    data: Game[];
    displayedTeamId: number;
    selectedPeriod: number;
}

const getTextColor = (isWinning: boolean): string =>
    isWinning ? "#02ff4d" : "#ff2102";

const ResultsTable: React.FC<ResultsTableProps> = ({
    data,
    displayedTeamId,
    selectedPeriod,
}) => {
    const reversedData = [...data].reverse();
    const isDataAvailable = data && data.length > 0;

    return (
        <Box p={6} bg="gray.900" borderRadius="md" boxShadow="lg">
            {isDataAvailable ? (
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    mb={6}
                    color="white"
                >
                    Last {selectedPeriod} Days First 5 Innings Game Log
                </Text>
            ) : (
                <Text fontSize="lg" fontWeight="bold" textAlign="center" color="gray.300">
                    No data available for the selected period.
                </Text>
            )}

            <Grid
                templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(2, 1fr)",
                }}
                gap={6}
            >
                {reversedData.map((game, index) => (
                    <Card key={index} bg="gray.800" color="white" borderRadius="md" boxShadow="md">
                        <CardHeader
                            fontSize="lg"
                            fontWeight="bold"
                            textAlign="center"
                            bg="gray.700"
                            borderTopRadius="md"
                            p={3}
                            borderBottom="1px solid white"
                        >
                            Game {index + 1}
                        </CardHeader>
                        <CardBody>
                            <TableContainer>
                                <Table variant="unstyled" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th color="gray.300" textAlign="left">
                                                Teams
                                            </Th>
                                            {[...Array(5)].map((_, inning) => (
                                                <Th key={inning} color="gray.300" textAlign="center">
                                                    {inning + 1}
                                                </Th>
                                            ))}
                                            <Th color="gray.300" textAlign="center">
                                                Total
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td
                                                fontWeight="bold"
                                                color={displayedTeamId === game.away_team.id ? "#ffa000" : "white"}
                                            >
                                                {game.away_team.name}
                                                <Text as="span" fontSize="sm" color="gray.400">
                                                    ({game.away_team.probable_pitcher.name})
                                                </Text>
                                            </Td>
                                            {game.away_team.runs.map((runs, inning) => (
                                                <Td key={inning} textAlign="center" color="gray.200">
                                                    {runs}
                                                </Td>
                                            ))}
                                            <Td
                                                textAlign="center"
                                                fontWeight="bold"
                                                color={getTextColor(
                                                    game.away_team.total_runs > game.home_team.total_runs
                                                )}
                                            >
                                                {game.away_team.total_runs}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td
                                                fontWeight="bold"
                                                color={displayedTeamId === game.home_team.id ? "#ffa000" : "white"}
                                            >
                                                {game.home_team.name}
                                                <Text as="span" fontSize="sm" color="gray.400">
                                                    ({game.home_team.probable_pitcher.name})
                                                </Text>
                                            </Td>
                                            {game.home_team.runs.map((runs, inning) => (
                                                <Td key={inning} textAlign="center" color="gray.200">
                                                    {runs}
                                                </Td>
                                            ))}
                                            <Td
                                                textAlign="center"
                                                fontWeight="bold"
                                                color={getTextColor(
                                                    game.home_team.total_runs > game.away_team.total_runs
                                                )}
                                            >
                                                {game.home_team.total_runs}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                ))}
            </Grid>
        </Box>
    );
};

export default ResultsTable;
