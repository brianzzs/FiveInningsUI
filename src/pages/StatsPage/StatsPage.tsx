import React, { useState } from 'react';
import { Box, Button, Flex, VStack, HStack, Divider, Alert, AlertIcon, Container } from '@chakra-ui/react';
import TeamDropdown from '../../components/TeamDropdown/TeamDropdown';
import SpanDropdown from '../../components/SpanDropdown/SpanDropdown'
import { StatisticsPanel } from '../../components/Statistics/StatisticsPanel';
import ResultsTable from "../../components/ResultsTable/ResultsTable"
import { NavBar } from '../../components/Layout/NavBar';
import FooterComponent from "../../components/Layout/Footer/Footer"
import { useStatistics } from '../../hooks/useStatistics';
import { THEME } from "../../constants"
import TeamLogo from '../../components/TeamLogo/TeamLogo';
import NextScheduledGame from '../../components/NextScheduledGame/NextScheduledGame';
import { useNavigate, useLocation } from 'react-router-dom';

export const StatsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedTeam, setSelectedTeam] = useState<number>(() => {
        const state = location.state as { selectedTeamId?: number };
        return state?.selectedTeamId ?? 0;
    });
    const [selectedSpan, setSelectedSpan] = useState<number>(5);

    const { data, isLoading, error } = useStatistics(selectedTeam, selectedSpan);

    const handleTeamChange = (teamId: number) => {
        setSelectedTeam(teamId);
    };

    const handlePitcherSelect = (playerId: number) => {
        navigate(`/players`, { state: { selectedPlayerId: playerId } });
    };

    const shouldShowNextGame = !!selectedTeam && !isLoading && !error;

    return (
        <Flex 
            direction="column" 
            minHeight="100vh"  
            bg={THEME.colors.background}
        >
            <NavBar />
            <Container maxW="container.xl" pt="6rem" pb="4rem" flexGrow={1} px={{ base: 4, md: 6 }}>
                <VStack spacing={8} align="stretch">
                    <VStack
                        spacing={6}
                        align="center"
                        bg="gray.800"
                        p={8}
                        borderRadius="xl"
                        shadow="xl"
                        width="100%"
                    >
                        {selectedTeam && <TeamLogo teamId={selectedTeam} size="80px" />}

                        <HStack spacing={4} width="100%">
                            <TeamDropdown selectedTeam={selectedTeam} onTeamChange={handleTeamChange} />
                            <SpanDropdown selectedPeriod={selectedSpan} onPeriodChange={setSelectedSpan} />
                        </HStack>
                        {/* Button no longer triggers fetch, just shows loading state */}
                        <Button isLoading={isLoading}
                            loadingText="Analyzing"
                            bg={THEME.colors.primary}
                            color="white"
                            _hover={{ bg: THEME.colors.primaryHover }}
                            isDisabled={!selectedTeam} 
                            width="200px"
                            cursor={isLoading ? 'progress' : 'default'} 
                        >
                            {isLoading ? 'Analyzing...' : 'Statistics Ready'}
                        </Button>
                    </VStack>

                    {/* Show error if the query failed */}
                    {error && (
                        <Alert status="error" mt={6} borderRadius="md">
                            <AlertIcon />
                            {error.message}
                        </Alert>
                    )}

                    {shouldShowNextGame && (
                        <Box
                            width="100%"
                            mt={2}
                        >
                            <NextScheduledGame
                                teamId={selectedTeam}
                                fetchGame={true} // Keep true to fetch game when component mounts/teamId is valid
                                onPitcherSelect={handlePitcherSelect}
                            />
                        </Box>
                    )}

                    {!isLoading && !error && data && (
                        <Box width="100%"
                            mt={2}
                        >
                            <StatisticsPanel data={data} />
                            <Divider my={8} />
                            <Box
                                bg="gray.800"
                                p={6}
                                borderRadius="xl"
                                shadow="xl"
                            >
                                <ResultsTable
                                    data={data.results}
                                    displayedTeamId={selectedTeam}
                                    selectedPeriod={selectedSpan}
                                />
                            </Box>
                        </Box>
                    )}
                </VStack>
            </Container>
            <FooterComponent />
        </Flex>
    )
}
export default StatsPage;