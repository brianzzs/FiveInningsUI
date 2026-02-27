import React from "react";
import { Game } from "../../types/Game";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
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
import { getTeamAbbreviation } from "../../constants/teams";

interface ResultsTableProps {
  data: Game[];
  displayedTeamId: number;
  selectedPeriod: number;
}

const getTextColor = (isWinning: boolean): string => (isWinning ? "statGood" : "statBad");

const ResultsTable: React.FC<ResultsTableProps> = ({ data, displayedTeamId, selectedPeriod }) => {
  const isDataAvailable = data.length > 0;

  return (
    <Box>
      {isDataAvailable ? (
        <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={6} textTransform="uppercase" letterSpacing="0.04em">
          Last {selectedPeriod} Days First 5 Innings Game Log
        </Text>
      ) : (
        <Text fontSize="md" fontWeight="bold" textAlign="center" color="textSecondary">
          No data available for the selected period.
        </Text>
      )}

      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
        {data.map((game, index) => (
          <Card key={`${game.game_date}-${index}`} bg="panelSubtle" borderColor="borderSubtle" boxShadow="none">
            <CardHeader fontSize="lg" fontWeight="bold" textAlign="center" bg="panelMuted" borderTopRadius="md" p={3} borderBottomWidth="1px" borderColor="borderSubtle">
              <VStack spacing={1}>
                <Text>Game {index + 1}</Text>
                <Text fontSize="sm" color="textMuted">
                  {new Date(game.game_date).toLocaleDateString()}
                </Text>
              </VStack>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="unstyled" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="textSecondary" textAlign="left">
                        Teams
                      </Th>
                      {[...Array(5)].map((_, inning) => (
                        <Th key={inning} color="textSecondary" textAlign="center">
                          {inning + 1}
                        </Th>
                      ))}
                      <Th color="textSecondary" textAlign="center">
                        Total
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td fontWeight="bold" color={displayedTeamId === game.away_team.id ? "accent.500" : "textPrimary"}>
                        {getTeamAbbreviation(game.away_team.name)}
                        <Text as="span" fontSize="sm" ml={1} color="textMuted">
                          ({game.away_team.probable_pitcher.name})
                        </Text>
                      </Td>
                      {game.away_team.runs.map((runs, inning) => (
                        <Td key={inning} textAlign="center" color="textPrimary">
                          {runs}
                        </Td>
                      ))}
                      <Td textAlign="center" fontWeight="bold" color={getTextColor(game.away_team.total_runs > game.home_team.total_runs)}>
                        {game.away_team.total_runs}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold" color={displayedTeamId === game.home_team.id ? "accent.500" : "textPrimary"}>
                        {getTeamAbbreviation(game.home_team.name)}
                        <Text as="span" fontSize="sm" ml={1} color="textMuted">
                          ({game.home_team.probable_pitcher.name})
                        </Text>
                      </Td>
                      {game.home_team.runs.map((runs, inning) => (
                        <Td key={inning} textAlign="center" color="textPrimary">
                          {runs}
                        </Td>
                      ))}
                      <Td textAlign="center" fontWeight="bold" color={getTextColor(game.home_team.total_runs > game.away_team.total_runs)}>
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
