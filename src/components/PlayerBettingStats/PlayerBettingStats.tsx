import React, { useState } from 'react';
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
    Button,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axiosInstance';
import { THEME } from '../../constants';
import { MdAccessTime, MdSportsBaseball, MdPerson } from 'react-icons/md';
import { FaBaseballBall, FaRunning } from 'react-icons/fa';
import TeamLogo from '../TeamLogo/TeamLogo';
import { getTeamAbbreviation, getTeamIdFromName } from '../../constants/teams';

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

const GameLog = ({ games, playerType }: { games: Array<any>, playerType: string }) => {
    const renderGameStats = (game: any) => {
        if (playerType === "Pitcher") {
            return (
                <SimpleGrid columns={2} spacing={2}>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">IP: {game.innings_pitched}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">Earned Runs: {game.runs}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">H: {game.hits_allowed}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">K: {game.strikeouts}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">BB: {game.walks_allowed}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Text fontWeight="bold">HR: {game.home_runs_allowed}</Text>
                    </Flex>
                </SimpleGrid>
            );
        } else {
            return (
                <SimpleGrid columns={2} spacing={2}>
                    <Flex align="center" gap={2}>
                        <FaBaseballBall />
                        <Text fontWeight="bold">H/AB: {game.hits}/{game.at_bats}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <MdSportsBaseball />
                        <Text fontWeight="bold">HR: {game.home_runs}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <FaRunning />
                        <Text fontWeight="bold">RBI: {game.rbis}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <FaRunning />
                        <Text fontWeight="bold">R: {game.runs}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <MdPerson />
                        <Text fontWeight="bold">K: {game.strikeouts}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <MdSportsBaseball />
                        <Text fontWeight="bold">BB: {game.walks}</Text>
                    </Flex>
                </SimpleGrid>
            );
        }
    };

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {games.map((game, index) => (
                <Box
                    key={index}
                    p={4}
                    bg="gray.700"
                    borderRadius="md"
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                >
                    <Flex align="center" justify="space-between" mb={2}>
                        <Flex align="center" gap={2}>
                            <Text fontWeight="bold">
                                vs {getTeamAbbreviation(game.opponent_team)}
                            </Text>
                            <TeamLogo teamId={getTeamIdFromName(game.opponent_team)} size="35px" marginTop="auto" />
                        </Flex>
                        <Flex align="center" gap={1}>
                            <MdAccessTime />
                            <Text fontSize="sm" color="gray.400">
                                {new Date(game.game_date).toLocaleDateString()}
                            </Text>
                        </Flex>
                    </Flex>
                    {renderGameStats(game)}
                </Box>
            ))}
        </SimpleGrid>
    );
};

const calculateBettingStats = (games: Array<any>, playerType: string) => {
    const stats: Record<string, number> = {};
    
    if (playerType === "Pitcher") {
        // Calculate pitcher stats
        const totalGames = games.length;
        stats.over_3_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 3.5).length / totalGames) * 100);
        stats.over_4_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 4.5).length / totalGames) * 100);
        stats.over_5_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 5.5).length / totalGames) * 100);
        stats.over_6_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 6.5).length / totalGames) * 100);
        stats.over_7_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 7.5).length / totalGames) * 100);
        stats.over_8_5_strikeouts = Math.round((games.filter(g => g.strikeouts > 8.5).length / totalGames) * 100);

        stats.over_4_5_innings_pitched = Math.round((games.filter(g => parseFloat(g.innings_pitched) > 4.5).length / totalGames) * 100);
        stats.over_5_5_innings_pitched = Math.round((games.filter(g => parseFloat(g.innings_pitched) > 5.5).length / totalGames) * 100);
        stats.over_6_5_innings_pitched = Math.round((games.filter(g => parseFloat(g.innings_pitched) > 6.5).length / totalGames) * 100);

        stats.over_3_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 3.5).length / totalGames) * 100);
        stats.over_4_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 4.5).length / totalGames) * 100);
        stats.over_5_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 5.5).length / totalGames) * 100);
        stats.over_6_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 6.5).length / totalGames) * 100);
        stats.over_7_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 7.5).length / totalGames) * 100);
        stats.over_8_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 8.5).length / totalGames) * 100);
        stats.over_9_5_hits_allowed = Math.round((games.filter(g => g.hits_allowed > 9.5).length / totalGames) * 100);

        stats.over_1_5_runs_allowed = Math.round((games.filter(g => g.runs > 1.5).length / totalGames) * 100);
        stats.over_2_5_runs_allowed = Math.round((games.filter(g => g.runs > 2.5).length / totalGames) * 100);
        stats.over_3_5_runs_allowed = Math.round((games.filter(g => g.runs > 3.5).length / totalGames) * 100);
        stats.over_4_5_runs_allowed = Math.round((games.filter(g => g.runs > 4.5).length / totalGames) * 100);
        stats.over_5_5_runs_allowed = Math.round((games.filter(g => g.runs > 5.5).length / totalGames) * 100);
    } else {
        // Calculate hitter stats
        const totalGames = games.length;
        stats.over_0_5_hits = Math.round((games.filter(g => g.hits > 0.5).length / totalGames) * 100);
        stats.over_1_5_hits = Math.round((games.filter(g => g.hits > 1.5).length / totalGames) * 100);
        stats.over_2_5_hits = Math.round((games.filter(g => g.hits > 2.5).length / totalGames) * 100);

        stats.over_0_5_rbis = Math.round((games.filter(g => g.rbis > 0.5).length / totalGames) * 100);
        stats.over_1_5_rbis = Math.round((games.filter(g => g.rbis > 1.5).length / totalGames) * 100);
        stats.over_2_5_rbis = Math.round((games.filter(g => g.rbis > 2.5).length / totalGames) * 100);

        stats.over_1_5_total_bases = Math.round((games.filter(g => g.total_bases > 1.5).length / totalGames) * 100);
        stats.over_2_5_total_bases = Math.round((games.filter(g => g.total_bases > 2.5).length / totalGames) * 100);
        stats.over_3_5_total_bases = Math.round((games.filter(g => g.total_bases > 3.5).length / totalGames) * 100);

        stats.over_1_5_hits_runs_rbis = Math.round((games.filter(g => g.hits + g.runs + g.rbis > 1.5).length / totalGames) * 100);
        stats.over_2_5_hits_runs_rbis = Math.round((games.filter(g => g.hits + g.runs + g.rbis > 2.5).length / totalGames) * 100);
        stats.over_3_5_hits_runs_rbis = Math.round((games.filter(g => g.hits + g.runs + g.rbis > 3.5).length / totalGames) * 100);
        stats.over_4_5_hits_runs_rbis = Math.round((games.filter(g => g.hits + g.runs + g.rbis > 4.5).length / totalGames) * 100);

        stats.over_0_5_home_runs = Math.round((games.filter(g => g.home_runs > 0.5).length / totalGames) * 100);
    }

    return stats;
};

const PlayerBettingStats: React.FC<BettingStatsProps> = ({ 
    playerId, 
    gamesCount,
    onGamesCountChange
}) => {
    const [showGameLog, setShowGameLog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const { data, isLoading, error } = useQuery<BettingStats>({
        queryKey: ['playerBettingStats', playerId],
        queryFn: async () => {
            const response = await apiClient.get(
                `/player/betting-stats/${playerId}/20`
            );
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        },
        enabled: !!playerId,
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={8}>
                <Spinner size="xl" color="white" />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box p={6} bg="gray.800" borderRadius="xl" color="white">
                <Text fontSize="lg" textAlign="center" color="red.400">
                    {error?.message === 'Error fetching recent player stats: list index out of range'
                        ? "Player doesn't have any recent games to analyze"
                        : "Error loading betting statistics. Please try again later."}
                </Text>
            </Box>
        );
    }

    const totalGames = data.games_found || 0;
    
    // Generate options dynamically from 1 up to totalGames
    const availableGameCounts = totalGames > 0 ? Array.from({ length: totalGames }, (_, i) => i + 1) : [];

    // Ensure gamesCount from props is within bounds [1, totalGames]
    const clampedGamesCount = Math.max(1, gamesCount);
    const validGamesCount = totalGames > 0 ? Math.min(clampedGamesCount, totalGames) : 0;

    const recentStats = data.recent_stats || [];
    // Slice recent stats based on the valid count
    const filteredRecentStats = recentStats.slice(0, validGamesCount);
    // Calculate stats based on the sliced games
    const filteredBettingStats = calculateBettingStats(filteredRecentStats, data.player_type);

    const renderContent = () => {
        if (data.player_type === "TWP") {
            const hittingStats = calculateBettingStats(filteredRecentStats, "Hitter");
            const pitchingStats = calculateBettingStats(filteredRecentStats, "Pitcher");
            
            return (
                <Tabs variant="enclosed" colorScheme="blue" onChange={setActiveTab}>
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
            return <PitcherStats stats={filteredBettingStats} />;
        } else {
            return <HitterStats stats={filteredBettingStats} />;
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
                {availableGameCounts.length > 0 && (
                    <Box>
                        <Select
                            value={validGamesCount}
                            onChange={(e) => onGamesCountChange(Number(e.target.value))}
                            bg="gray.700"
                            color="red.500"
                            maxW="200px"
                            fontFamily={THEME.fonts.body}
                            disabled={totalGames === 0}
                        >
                            {availableGameCounts.map(num => (
                                <option key={num} value={num}>Last {num} Games</option>
                            ))}
                        </Select>
                    </Box>
                )}
            </Flex>

            {totalGames > 0 ? (
                <>
                    <Text mb={4} color="gray.400">
                        Based on {validGamesCount} most recent games. Percentages show how often the player hits the betting prop.
                    </Text>

                    <Button
                        onClick={() => setShowGameLog(!showGameLog)}
                        mb={4}
                        colorScheme="blue"
                        variant="outline"
                    >
                        {showGameLog ? 'Hide Game Log' : 'Show Game Log'}
                    </Button>

                    {showGameLog && recentStats.length > 0 && (
                        <>
                            {data.player_type === "TWP" ? (
                                <Tabs variant="enclosed" colorScheme="blue" onChange={setActiveTab}>
                                    <TabList>
                                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Hitting Games</Tab>
                                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Pitching Games</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel p={0} pt={4}>
                                            <GameLog games={filteredRecentStats} playerType="Hitter" />
                                        </TabPanel>
                                        <TabPanel p={0} pt={4}>
                                            <GameLog games={filteredRecentStats} playerType="Pitcher" />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            ) : (
                                <GameLog games={filteredRecentStats} playerType={data.player_type} />
                            )}
                            <Divider my={6} />
                        </>
                    )}

                    {renderContent()}
                </>
            ) : (
                <Text fontSize="lg" textAlign="center" color="gray.400">
                    No recent games available for betting analysis
                </Text>
            )}
        </Box>
    );
};

export default PlayerBettingStats; 