import React from 'react';
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

export const StatsPage: React.FC = () => {
    const [selectedTeam, setSelectedTeam] = React.useState<number>(0);
    const [selectedSpan, setSelectedSpan] = React.useState<number>(10);
    const { fetchStats, data, isLoading, error } = useStatistics();


    const handleCalculate = () => {
        if (selectedTeam) {
            fetchStats(selectedTeam, selectedSpan);
        };
    }

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
                        <TeamDropdown selectedTeam={selectedTeam} onTeamChange={setSelectedTeam} />
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


                {error &&
                    (

                        <Alert status="error" mt={6}>
                            <AlertIcon />
                            {error.message}
                        </Alert>
                    )}

                {data &&
                    (
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
            <FooterComponent isLoading={isLoading} />

        </Flex>
    )
}
export default StatsPage;