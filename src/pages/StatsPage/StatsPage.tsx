import React, { useEffect } from 'react';
import { Box, Button, Flex, VStack, HStack, Divider, Alert, AlertIcon } from '@chakra-ui/react';
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
    const [selectedTeam, setSelectedTeam] = React.useState<number>(0);
    const [selectedSpan, setSelectedSpan] = React.useState<number>(5);
    const [fetchGame, setFetchGame] = React.useState<boolean>(false);
    const [showNextGame, setShowNextGame] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchStats, data, isLoading, error } = useStatistics();

    useEffect(() => {
        const state = location.state as { selectedTeamId?: number };
        if (state?.selectedTeamId) {
            setSelectedTeam(state.selectedTeamId);
            fetchStats(state.selectedTeamId, selectedSpan);
            setFetchGame(true);
            setShowNextGame(true);
        }
    }, [location.state]);

    const handleTeamChange = (teamId: number) => {
        setSelectedTeam(teamId);
        setShowNextGame(false);
        setFetchGame(false);
    };

    const handleCalculate = () => {
        if (selectedTeam) {
            fetchStats(selectedTeam, selectedSpan);
            setFetchGame(true);
            setShowNextGame(true);
        }
    }

    const handlePitcherSelect = (playerId: number) => {
        navigate(`/players`, { state: { selectedPlayerId: playerId } });
    };

    return (
        <Flex direction="column" minHeight="100vh"  bg={THEME.colors.background}>
            <NavBar />
            <Flex direction="column" align="center" mt="6rem" px={4} mb="2rem">
                <VStack
                    spacing={6}
                    align="center"
                    bg="gray.800"
                    p={8}
                    borderRadius="xl"
                    shadow="xl"
                    width={["95%", "80%", "60%"]}
                >
                    {selectedTeam && <TeamLogo teamId={selectedTeam} size="80px" />}

                    <HStack spacing={4} width="100%">
                        <TeamDropdown selectedTeam={selectedTeam} onTeamChange={handleTeamChange} />
                        <SpanDropdown selectedPeriod={selectedSpan} onPeriodChange={setSelectedSpan} />
                    </HStack>
                    <Button isLoading={isLoading}
                        loadingText="Analyzing"
                        bg={THEME.colors.primary}
                        color="white"
                        _hover={{ bg: THEME.colors.primaryHover }}
                        onClick={handleCalculate}
                        isDisabled={!selectedTeam}
                        width="200px">
                        Analyze Statistics
                    </Button>
                </VStack>

                {error && (
                    <Alert status="error" mt={6}>
                        <AlertIcon />
                        {error.message}
                    </Alert>
                )}

                {showNextGame && selectedTeam && (
                    <Box width="100%" mt={8}>
                        <NextScheduledGame 
                            teamId={selectedTeam} 
                            fetchGame={fetchGame}
                            onPitcherSelect={handlePitcherSelect}
                        />
                    </Box>
                )}

                {data && (
                    <Box width="100%" mt={8}>
                        <StatisticsPanel data={data} />
                        <Divider my={8} />
                        <Box
                            bg="gray.800"
                            p={6}
                            borderRadius="xl"
                            shadow="xl"
                            mx={[4, 8, 16]}
                        >
                            <ResultsTable
                                data={data.results}
                                displayedTeamId={selectedTeam}
                                selectedPeriod={selectedSpan}
                            />
                        </Box>
                    </Box>
                )}
            </Flex>
            <FooterComponent />
        </Flex>
    )
}
export default StatsPage;