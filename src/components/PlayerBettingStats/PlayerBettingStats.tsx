import React from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    Flex,
    Spinner,
    Divider,
    Select,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { THEME } from '../../constants';

interface BettingStatsProps {
    playerId: number;
    gamesCount: number;
    onGamesCountChange: (count: number) => void;
}

interface BettingStats {
    betting_stats: {
        [key: string]: number | {
            [key: string]: number;
        };
    };
    games_found: number;
    player_id: number;
    player_name: string;
    player_type: "Hitter" | "Pitcher" | "TWP";
    recent_stats: Array<any>;
}

const getColorForPercentage = (percentage: number) => {
    if (percentage >= 70) return 'green.500';
    if (percentage >= 50) return 'yellow.500';
    return 'red.500';
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <Box 
        p={4} 
        bg="gray.700" 
        borderRadius="md" 
        boxShadow="md"
        _hover={{ transform: 'scale(1.05)', bg: 'gray.600' }}
        transition="all 0.2s"
    >
        <Text fontSize="sm" color="gray.300" mb={1}>{title}</Text>
        <Flex align="center" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">{value}%</Text>
            <Badge 
                colorScheme={value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red'}
                fontSize="sm"
                borderRadius="full"
                px={2}
            >
                {value >= 70 ? 'High' : value >= 50 ? 'Medium' : 'Low'}
            </Badge>
        </Flex>
    </Box>
);

const HitterStats = ({ stats }: { stats: Record<string, number> }) => {
    // Group stats by category
    const hitsStats = {
        'Over 0.5 Hits': stats.over_0_5_hits,
        'Over 1.5 Hits': stats.over_1_5_hits,
        'Over 2.5 Hits': stats.over_2_5_hits,
    };

    const rbiStats = {
        'Over 0.5 RBIs': stats.over_0_5_rbis,
        'Over 1.5 RBIs': stats.over_1_5_rbis,
        'Over 2.5 RBIs': stats.over_2_5_rbis,
    };

    const totalBasesStats = {
        'Over 1.5 Total Bases': stats.over_1_5_total_bases,
        'Over 2.5 Total Bases': stats.over_2_5_total_bases,
        'Over 3.5 Total Bases': stats.over_3_5_total_bases,
    };

    const hitsRunsRbisStats = {
        'Over 1.5 H+R+RBI': stats.over_1_5_hits_runs_rbis,
        'Over 2.5 H+R+RBI': stats.over_2_5_hits_runs_rbis,
        'Over 3.5 H+R+RBI': stats.over_3_5_hits_runs_rbis,
        'Over 4.5 H+R+RBI': stats.over_4_5_hits_runs_rbis,
    };

    const homeRunStats = {
        'Over 0.5 Home Runs': stats.over_0_5_home_runs,
    };

    return (
        <>
            <Heading size="sm" mb={3} color="blue.300">Home Runs</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(homeRunStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Hits</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(hitsStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">RBIs</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(rbiStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Total Bases</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(totalBasesStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Combined (Hits + Runs + RBIs)</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
                {Object.entries(hitsRunsRbisStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value} />
                ))}
            </SimpleGrid>
        </>
    );
};

const PitcherStats = ({ stats }: { stats: Record<string, number> }) => {
    // Group pitcher stats by category
    const strikeoutStats = {
        'Over 3.5 Strikeouts': stats.over_3_5_strikeouts,
        'Over 4.5 Strikeouts': stats.over_4_5_strikeouts,
        'Over 5.5 Strikeouts': stats.over_5_5_strikeouts,
        'Over 6.5 Strikeouts': stats.over_6_5_strikeouts,
        'Over 7.5 Strikeouts': stats.over_7_5_strikeouts,
        'Over 8.5 Strikeouts': stats.over_8_5_strikeouts,
    };

    const inningsStats = {
        'Over 4.5 Innings': stats.over_4_5_innings_pitched,
        'Over 5.5 Innings': stats.over_5_5_innings_pitched,
        'Over 6.5 Innings': stats.over_6_5_innings_pitched,
    };

    const hitsAllowedStats = {
        'Over 3.5 Hits Allowed': stats.over_3_5_hits_allowed,
        'Over 4.5 Hits Allowed': stats.over_4_5_hits_allowed,
        'Over 5.5 Hits Allowed': stats.over_5_5_hits_allowed,
        'Over 6.5 Hits Allowed': stats.over_6_5_hits_allowed,
        'Over 7.5 Hits Allowed': stats.over_7_5_hits_allowed,
        'Over 8.5 Hits Allowed': stats.over_8_5_hits_allowed,
        'Over 9.5 Hits Allowed': stats.over_9_5_hits_allowed,
    };

    const runsAllowedStats = {
        'Over 1.5 Runs Allowed': stats.over_1_5_runs_allowed,
        'Over 2.5 Runs Allowed': stats.over_2_5_runs_allowed,
        'Over 3.5 Runs Allowed': stats.over_3_5_runs_allowed,
        'Over 4.5 Runs Allowed': stats.over_4_5_runs_allowed,
        'Over 5.5 Runs Allowed': stats.over_5_5_runs_allowed,
    };

    return (
        <>
            <Heading size="sm" mb={3} color="blue.300">Strikeouts</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(strikeoutStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value || 0} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Innings Pitched</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(inningsStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value || 0} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Hits Allowed</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mb={6}>
                {Object.entries(hitsAllowedStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value || 0} />
                ))}
            </SimpleGrid>

            <Divider my={4} />

            <Heading size="sm" mb={3} color="blue.300">Runs Allowed</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
                {Object.entries(runsAllowedStats).map(([title, value]) => (
                    <StatCard key={title} title={title} value={value || 0} />
                ))}
            </SimpleGrid>
        </>
    );
};

const PlayerBettingStats: React.FC<BettingStatsProps> = ({ 
    playerId, 
    gamesCount,
    onGamesCountChange
}) => {
    const { data, isLoading, error } = useQuery<BettingStats>({
        queryKey: ['playerBettingStats', playerId, gamesCount],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/player/betting-stats/${playerId}/${gamesCount}`
            );
            return response.data;
        },
        enabled: !!playerId,
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={8}>
                <Spinner size="xl" color="red.500" />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box p={4} bg="red.900" color="white" borderRadius="md">
                <Text>Error loading betting statistics</Text>
            </Box>
        );
    }

    const renderContent = () => {
        if (data.player_type === "TWP") {
            // Two-way player
            const hittingStats = data.betting_stats.hitting as Record<string, number>;
            const pitchingStats = data.betting_stats.pitching as Record<string, number>;
            
            return (
                <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Hitting</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Pitching</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p={0} pt={4}>
                            <HitterStats stats={hittingStats} />
                        </TabPanel>
                        <TabPanel p={0} pt={4}>
                            <PitcherStats stats={pitchingStats} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            );
        } else if (data.player_type === "Pitcher") {
            // Pitcher stats
            return <PitcherStats stats={data.betting_stats as Record<string, number>} />;
        } else {
            // Default hitter stats
            return <HitterStats stats={data.betting_stats as Record<string, number>} />;
        }
    };

    return (
        <Box bg="gray.800" p={6} borderRadius="xl" color="white">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md">
                    Betting Performance Stats
                    {data.player_type && (
                        <Badge ml={2} colorScheme={data.player_type === "TWP" ? "purple" : data.player_type === "Pitcher" ? "blue" : "green"}>
                            {data.player_type}
                        </Badge>
                    )}
                </Heading>
                <Box>
                    <Select
                        value={gamesCount}
                        onChange={(e) => onGamesCountChange(Number(e.target.value))}
                        bg="gray.700"
                        color="red.500"
                        maxW="200px"
                        fontFamily={THEME.fonts.body}
                    >
                        {[5, 10, 15, 20, 30].map(num => (
                            <option key={num} value={num}>Last {num} Games</option>
                        ))}
                    </Select>
                </Box>
            </Flex>

            <Text mb={4} color="gray.400">
                Based on {data.games_found} most recent games. Percentages show how often the player hits the betting prop.
            </Text>

            {renderContent()}
        </Box>
    );
};

export default PlayerBettingStats; 