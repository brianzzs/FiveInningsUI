import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    VStack,
    HStack,
    SimpleGrid,
    Divider,
    Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import TeamDropdown from "../TeamDropdown/TeamDropdown";
import PeriodDropdown from "../SpanDropdown/SpanDropdown";
import StatisticCard from "../StatisticsCard/StatisticsCard";
import TeamLogo from "../TeamLogo/TeamLogo";
import ResultsTable from "../ResultsTable/ResultsTable";
import FooterComponent from "../Footer/Footer";

const StatsPage: React.FC = () => {
    const [selectedTeam, setSelectedTeam] = useState<number>(0);
    const [selectedPeriod, setSelectedPeriod] = useState<number>(10);
    const [results, setResults] = useState<any[]>([]);
    const [winPercentage, setWinPercentage] = useState<number | null>(null);
    const [nrfi, setNrfi] = useState<number | null>(null);
    const [over1_5F5, setOver1_5F5] = useState<number | null>(null);
    const [over2_5F5, setOver2_5F5] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/stats/${selectedTeam}/${selectedPeriod}`
            );

            const { results, win_percentage, nrfi, over1_5F5, over2_5F5 } =
                response.data;
            setResults(results);
            setWinPercentage(win_percentage);
            setNrfi(nrfi);
            setOver1_5F5(over1_5F5);
            setOver2_5F5(over2_5F5);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const isDataAvailable =
        winPercentage !== null &&
        over1_5F5 !== null &&
        over2_5F5 !== null &&
        nrfi !== null;

    return (
        <Flex
            direction="column"
            minHeight="100vh"
            width="100vw" 
            bg="#1a202c"
        >
            <Flex
                as="header"
                justify="space-between"
                align="center"
                w="100%" 
                px={8}
                py={4}
                bg="teal.600"
                color="white"
                shadow="md"
                position="fixed"
                zIndex={100}
            >
                <Link to="/">
                    <Heading as="h1" size="lg" fontWeight="bold">
                        Five Innings Friend
                    </Heading>
                </Link>
            </Flex>
            <Flex
                direction="column"
                align="center"
                mt="6rem"
                px={4}
                w="100%"
            >
                <VStack
                    spacing={4}
                    align="center"
                    bg="gray.100"
                    p={6}
                    borderRadius="lg"
                    shadow="lg"
                    width={["95%", "80%", "60%"]}
                >
                    {selectedTeam && <TeamLogo teamId={selectedTeam} />}
                    <HStack spacing={4}>
                        <TeamDropdown
                            selectedTeam={selectedTeam}
                            onTeamChange={setSelectedTeam}
                        />
                        <PeriodDropdown
                            selectedPeriod={selectedPeriod}
                            onPeriodChange={setSelectedPeriod}
                        />
                    </HStack>
                    <Button
                        isLoading={loading}
                        loadingText="Calculating"
                        bg="teal.500"
                        color="white"
                        _hover={{ bg: "teal.600" }}
                        borderRadius="full"
                        onClick={handleCalculate}
                        isDisabled={!selectedTeam}
                        px={6}
                        fontWeight="bold"
                    >
                        Get Stats
                    </Button>
                </VStack>

                {loading && (
                    <Flex justify="center" align="center" height="50vh" width="100%">
                        <Spinner size="xl" color="teal.500" />
                    </Flex>
                )}

                {isDataAvailable && (
                    <>
                        {/* Statistics Cards */}
                        <SimpleGrid
                            columns={[1, 2, 4]}
                            spacing={6}
                            mt={6}
                            width="100%" /* Full width */
                            px={[4, 8, 16]} /* Responsive padding */
                        >
                            <StatisticCard id="win-percentage-card" label="ML F5" data={winPercentage} />
                            <StatisticCard id="nrfi-card" label="NRFI" data={nrfi} />
                            <StatisticCard id="over1-5f5-card" label="Over 1.5 F5 TT" data={over1_5F5} />
                            <StatisticCard id="over2-5f5-card" label="Over 2.5 F5 TT" data={over2_5F5} />
                        </SimpleGrid>

                        <Divider my={6} />

                        {/* Results Table */}
                        <Box
                            bg="gray.800"
                            p={6}
                            borderRadius="lg"
                            shadow="lg"
                            width={["95%", "90%", "80%"]} /* Responsive table width */
                        >
                            <ResultsTable
                                data={results}
                                displayedTeamId={selectedTeam}
                                selectedPeriod={selectedPeriod}
                            />
                        </Box>
                    </>
                )}
            </Flex>

            {/* Footer */}
            {isDataAvailable && <FooterComponent isLoading={loading} />}
        </Flex>
    );
};

export default StatsPage;
