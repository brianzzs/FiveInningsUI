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
    Icon,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axiosInstance';
import { THEME } from '../../constants';
import { MdAccessTime, MdSportsBaseball, MdPerson, MdTrendingUp } from 'react-icons/md';
import { FaBaseballBatBall } from 'react-icons/fa6';
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

const GameLog = ({ games, playerType }: { games: Array<any>, playerType: "Hitter" | "Pitcher" }) => {
    const renderGameStats = (game: any) => {
        const isHitting = playerType === 'Hitter';
        return (
            <SimpleGrid columns={2} spacing={2} fontSize="sm">
                {isHitting ? (
                    <>
                        <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="gray.400" /><Text>H/AB: {game.hits}/{game.at_bats}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>Total Bases: {game.total_bases}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>HR: {game.home_runs}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdPerson} color="gray.400" /><Text>RBI: {game.rbis}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdPerson} color="gray.400" /><Text>R: {game.runs}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdPerson} color="gray.400" /><Text>K: {game.strikeouts}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>BB: {game.walks}</Text></Flex>
                    </>
                ) : (
                    <>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>IP: {game.innings_pitched}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdTrendingUp} color="gray.400" /><Text>ER: {game.runs}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={FaBaseballBatBall} color="gray.400" /><Text>Hits Allowed: {game.hits_allowed}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdPerson} color="gray.400" /><Text>Strikeouts: {game.strikeouts}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>BB: {game.walks_allowed}</Text></Flex>
                        <Flex align="center" gap={1.5}><Icon as={MdSportsBaseball} color="gray.400" /><Text>HR Allowed: {game.home_runs_allowed}</Text></Flex>
                    </>
                )}
            </SimpleGrid>
        );
    };

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {games.map((game, index) => (
                <Box
                    key={`${game.game_date}-${index}-${playerType}`}
                    p={4}
                    bg="gray.700"
                    borderRadius="md"
                    _hover={{ transform: 'scale(1.02)', bg: 'gray.600' }}
                    transition="all 0.2s"
                    color="white"
                >
                    <Flex align="center" justify="space-between" mb={3}>
                        <Flex align="center" gap={2}>
                            <TeamLogo teamId={getTeamIdFromName(game.opponent_team)} size="28px" />
                            <Text fontWeight="bold" fontSize="sm">
                                vs {getTeamAbbreviation(game.opponent_team)}
                            </Text>
                        </Flex>
                        <Flex align="center" gap={1}>
                            <Icon as={MdAccessTime} color="gray.400" />
                            <Text fontSize="xs" color="gray.300">
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

const calculateBettingStats = (games: Array<any>, playerType: string): Record<string, number> => {
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
    const { data, isLoading, error } = useQuery<BettingStats, Error>({
        queryKey: ['playerBettingStats', playerId, gamesCount],
        queryFn: async () => {
            const response = await apiClient.get(
                `/player/betting-stats/${playerId}/${gamesCount}`
            );
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        },
        enabled: !!playerId,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <Flex justify="center" p={8}><Spinner size="xl" color="white" /></Flex>
        );
    }

    if (error || !data) {
        const errorMessage = error instanceof Error ? error.message : "Error loading betting statistics.";
        const displayMessage = errorMessage.includes('list index out of range') 
            ? "Player doesn't have any recent games to analyze"
            : errorMessage;
        return (
            <Box p={6} bg="gray.800" borderRadius="xl" color="white">
                <Text fontSize="lg" textAlign="center" color="red.400">{displayMessage}</Text>
            </Box>
        );
    }

    const totalGames = data.games_found || 0;
    
    const availableGameCounts = totalGames > 0 ? Array.from({ length: Math.min(totalGames, 20) }, (_, i) => i + 1) : [];
    const validGamesCount = Math.max(1, Math.min(gamesCount, totalGames, 20));
    const recentStats = data.recent_stats || [];
    const statsToCalculate = recentStats.slice(0, validGamesCount);
    const bettingStatsCalculated = calculateBettingStats(statsToCalculate, data.player_type);

    const gameLogPlayerType = data.player_type === 'Pitcher' ? 'Pitcher' : 'Hitter';

    const renderBettingContent = () => {
        if (data.player_type === "TWP") {
            const hittingStats = calculateBettingStats(statsToCalculate, "Hitter");
            const pitchingStats = calculateBettingStats(statsToCalculate, "Pitcher");
            
            return (
                <Tabs variant="enclosed" colorScheme="blue" defaultIndex={0} onChange={(index) => setActiveTab(index)}>
                    <TabList>
                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Hitting Props</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blue.700' }}>Pitching Props</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p={0} pt={4}><HitterStats stats={hittingStats} /></TabPanel>
                        <TabPanel p={0} pt={4}><PitcherStats stats={pitchingStats} /></TabPanel>
                    </TabPanels>
                </Tabs>
            );
        } else if (data.player_type === "Pitcher") {
            return <PitcherStats stats={bettingStatsCalculated} />;
        } else {
            return <HitterStats stats={bettingStatsCalculated} />;
        }
    };

    return (
        <Box bg="gray.800" p={6} borderRadius="xl" color="white">
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={2}>
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
                        value={validGamesCount}
                        onChange={(e) => onGamesCountChange(Number(e.target.value))}
                        bg="gray.700"
                        color="white" 
                        borderColor="gray.600"
                        focusBorderColor={THEME.colors.accent}
                        maxW="180px"
                        size="sm"
                        borderRadius="md"
                        disabled={availableGameCounts.length === 0}
                    >
                        {availableGameCounts.length === 0 && <option>No Games</option>} 
                        {availableGameCounts.map(num => (
                            <option key={num} value={num} style={{ backgroundColor: '#2D3748', color: 'white' }}>Last {num} Games</option>
                        ))}
                    </Select>
                </Box>
            </Flex>

            {statsToCalculate.length > 0 ? (
                <>
                    <Text mb={4} color="gray.400" fontSize="sm">
                        Hit rates based on the last {validGamesCount} games played.
                    </Text>

                    <Button
                        onClick={() => setShowGameLog(!showGameLog)}
                        mb={4}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                    >
                        {showGameLog ? 'Hide Game Log' : 'Show Game Log'}
                    </Button>

                    {showGameLog && (
                        <Box mb={6}> 
                            <GameLog games={statsToCalculate} playerType={gameLogPlayerType} />
                            <Divider my={6} borderColor="gray.600" />
                        </Box>
                    )}

                    {renderBettingContent()}
                </>
            ) : (
                 <Text fontSize="lg" textAlign="center" color="gray.400" mt={4}>
                     No recent games found for analysis.
                 </Text>
            )}
        </Box>
    );
};

export default PlayerBettingStats; 