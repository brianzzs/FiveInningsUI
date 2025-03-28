import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Image,
    Text,
    VStack,
    HStack,
    Stat,
    StatLabel,
    StatNumber,
    SimpleGrid,
    Divider,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Select,
    Flex,
    Spinner,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PlayerStats } from './interface';
import { THEME } from '../../constants';
import { MdSportsBaseball, MdPerson } from 'react-icons/md';
import { FaBaseballBatBall, FaPersonRunning } from 'react-icons/fa6';
import TeamLogo from '../TeamLogo/TeamLogo';
import { getTeamAbbreviation, getTeamIdFromName } from '../../constants/teams';

interface PlayerStatsProps {
    playerId: number;
    season: string;
    onTeamIdSet?: (teamId: number) => void;
}

interface RecentHittingGame {
    at_bats: number;
    avg: number;
    game_date: string;
    hits: number;
    home_runs: number;
    opponent_pitcher: string;
    opponent_team: string;
    rbis: number;
    runs: number;
    strikeouts: number;
    walks: number;
}

interface RecentPitchingGame {
    game_date: string;
    hits_allowed: number;
    home_runs_allowed: number;
    innings_pitched: string;
    opponent_team: string;
    strikeouts: number;
    walks_allowed: number;
}

interface RecentStats {
    games_found: number;
    player_id: number;
    player_name: string;
    recent_stats: RecentHittingGame[] | RecentPitchingGame[];
}

const StatBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <Stat bg="gray.700" p={4} borderRadius="md" textAlign="center">
        <StatLabel color="gray.300">{label}</StatLabel>
        <StatNumber color="white" fontSize="xl">{value}</StatNumber>
    </Stat>
);

const HittingStats: React.FC<{ stats: NonNullable<PlayerStats['hitting_stats']>, season: string }> = ({ stats, season }) => (
    <>
        <Box>
            <Heading size="md" mb={4}>Season Stats ({season})</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <StatBox label="AVG" value={stats.season.avg} />
                <StatBox label="HR" value={stats.season.home_runs} />
                <StatBox label="RBI" value={stats.season.rbi} />
                <StatBox label="OPS" value={stats.season.ops} />
                <StatBox label="Games" value={stats.season.games} />
                <StatBox label="Hits" value={stats.season.hits} />
                <StatBox label="Runs" value={stats.season.runs} />
                <StatBox label="SB" value={stats.season.stolen_bases} />
            </SimpleGrid>
        </Box>

        <Divider mt={2} />

        <Box>
            <Heading size="md" mt={2} mb={4}>Career Hitting Stats</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <StatBox label="AVG" value={stats.career.avg} />
                <StatBox label="HR" value={stats.career.home_runs} />
                <StatBox label="RBI" value={stats.career.rbi} />
                <StatBox label="OPS" value={stats.career.ops} />
                <StatBox label="Games" value={stats.career.games} />
                <StatBox label="Hits" value={stats.career.hits} />
                <StatBox label="Runs" value={stats.career.runs} />
                <StatBox label="SB" value={stats.career.stolen_bases} />
            </SimpleGrid>
        </Box>
    </>
);

const PitchingStats: React.FC<{
    stats: PlayerStats,
    seasonYear: string
}> = ({ stats, seasonYear }) => {
    const career = stats.pitching_stats?.career || stats.career_stats;
    const season = stats.pitching_stats?.season || stats.season_stats;

    return (
        <>
            <Box>
                <Heading size="md" mb={4}>Season Pitching Stats ({seasonYear})</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <StatBox label="ERA" value={season?.era ?? '-'} />
                    <StatBox label="W-L" value={`${season?.wins ?? 0}-${season?.losses ?? 0}`} />
                    <StatBox label="IP" value={season?.innings_pitched ?? '-'} />
                    <StatBox label="WHIP" value={season?.whip ?? '-'} />
                    <StatBox label="K" value={season?.strikeouts ?? '-'} />
                    <StatBox label="BB" value={season?.walks ?? '-'} />
                    <StatBox label="Games" value={season?.games ?? '-'} />
                    <StatBox label="Games Started" value={season?.games_started ?? '-'} />
                </SimpleGrid>
            </Box>

            <Divider mb={2} mt={2} />

            <Box>
                <Heading size="md" mb={4}>Career Pitching Stats</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <StatBox label="ERA" value={career?.era ?? '-'} />
                    <StatBox label="W-L" value={`${career?.wins ?? 0}-${career?.losses ?? 0}`} />
                    <StatBox label="IP" value={career?.innings_pitched ?? '-'} />
                    <StatBox label="WHIP" value={career?.whip ?? '-'} />
                    <StatBox label="K" value={career?.strikeouts ?? '-'} />
                    <StatBox label="BB" value={career?.walks ?? '-'} />
                    <StatBox label="G" value={career?.games ?? '-'} />
                    <StatBox label="GS" value={career?.games_started ?? '-'} />
                </SimpleGrid>
            </Box>
        </>
    );
};

const PlayerStats: React.FC<PlayerStatsProps> = ({ playerId, season, onTeamIdSet }) => {
    const [gamesCount, setGamesCount] = useState<number>(2);
    // const currentYear = new Date().getFullYear().toString();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['playerStats', playerId, season],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/player/stats/${playerId}/${season}`);
            return response.data as PlayerStats;
        },
    });

    const { data: recentStats, isLoading: isLoadingRecent } = useQuery({
        queryKey: ['recentStats', playerId, gamesCount],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/player/recent-stats/${playerId}/${gamesCount}`);
            return response.data as RecentStats;
        },
        enabled: season === "2024",
    });

    useEffect(() => {
        if (stats?.player_info?.current_team && onTeamIdSet) {
            const teamId = getTeamIdFromName(stats.player_info.current_team);
            onTeamIdSet(teamId);
        }
    }, [stats, onTeamIdSet]);

    if (isLoading || !stats) return <Spinner />;

    const isPitcher = stats.player_info.position === 'P';
    const isTwoWayPlayer = stats.player_info.position === 'TWP';

    const hasHittingStats = (stats: PlayerStats) => {
        return stats.career_stats?.avg !== undefined || stats.hitting_stats !== undefined;
    };

    const hasPitchingStats = (stats: PlayerStats) => {
        return stats.career_stats?.era !== undefined;
    };

    const createHittingStatsObject = (stats: PlayerStats) => {
        if (stats.hitting_stats) return stats.hitting_stats;

        return {
            career: {
                games: stats.career_stats!.games,
                at_bats: stats.career_stats!.at_bats!,
                hits: stats.career_stats!.hits!,
                avg: stats.career_stats!.avg!,
                home_runs: stats.career_stats!.home_runs!,
                rbi: stats.career_stats!.rbi!,
                runs: stats.career_stats!.runs!,
                stolen_bases: stats.career_stats!.stolen_bases!,
                obp: stats.career_stats!.obp!,
                slg: stats.career_stats!.slg!,
                ops: stats.career_stats!.ops!,
            },
            season: {
                games: stats.season_stats!.games,
                at_bats: stats.season_stats!.at_bats!,
                hits: stats.season_stats!.hits!,
                avg: stats.season_stats!.avg!,
                home_runs: stats.season_stats!.home_runs!,
                rbi: stats.season_stats!.rbi!,
                runs: stats.season_stats!.runs!,
                stolen_bases: stats.season_stats!.stolen_bases!,
                obp: stats.season_stats!.obp!,
                slg: stats.season_stats!.slg!,
                ops: stats.season_stats!.ops!,
            }
        };
    };

    const showHittingStats = hasHittingStats(stats);
    const showPitchingStats = hasPitchingStats(stats);

    return (
        <Box bg="gray.800" p={6} borderRadius="xl" color="white">
            <VStack spacing={6} align="stretch">

                <Grid
                    templateColumns={{ base: "1fr", md: "auto 1fr" }}
                    gap={6}
                    bgImage={stats.player_info.images.action || 'none'}
                    bgSize="cover"
                    bgPosition="center 10%"
                    bgRepeat="no-repeat"
                    position="relative"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1,
                    }}
                >
                    <Box position="relative" zIndex={2} pl={1}>
                        <Image
                            src={stats.player_info.images.headshot}
                            alt={stats.player_info.full_name}
                            borderRadius="md"
                            maxW="200px"
                        />
                        <VStack align="start" spacing={4}>
                            <Heading size="lg" fontWeight="bold" lineHeight="1.2">
                                {stats.player_info.full_name}
                            </Heading>
                            <Text fontSize="sm" fontWeight="medium" color="gray.300">
                                Position: {stats.player_info.position}
                            </Text>
                            <HStack spacing={4} flexWrap="wrap">
                                <Text fontWeight="bold">Age: {stats.player_info.age}</Text>
                                <Text fontWeight="bold">Bats: {stats.player_info.bat_side}</Text>
                                <Text fontWeight="bold">Throws: {stats.player_info.throw_hand}</Text>
                                <Text fontWeight="bold" > Team: {stats.player_info.current_team}</Text>
                                <TeamLogo teamId={getTeamIdFromName(stats.player_info.current_team)} size="35px" marginTop="auto" floatLeft={true} /> 
                            </HStack>
                        </VStack>
                    </Box>
                </Grid>

                {season === "2024" && (
                    <Box>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">Last Games Stats</Heading>
                            <Select
                                value={gamesCount}
                                onChange={(e) => setGamesCount(Number(e.target.value))}
                                bg="gray.700"
                                color="red.500"
                                maxW="200px"
                                alignSelf="center"
                                fontFamily={THEME.fonts.body}
                            >
                                {[2, 5, 10, 15, 20].map(num => (
                                    <option key={num} value={num}>Last {num} Games</option>
                                ))}
                            </Select>
                        </Flex>

                        {recentStats && (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                                {recentStats.recent_stats.map((game, index) => (
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
                                            <Text fontSize="sm" color="gray.400">
                                                {new Date(game.game_date).toLocaleDateString()}
                                            </Text>
                                        </Flex>
                                        {'at_bats' in game ? (
                                            <SimpleGrid columns={2} spacing={2}>
                                                <Flex align="center" gap={2}>
                                                    <FaBaseballBatBall />
                                                    <Text fontWeight="bold">H/AB: {game.hits}/{game.at_bats}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <MdSportsBaseball />
                                                    <Text fontWeight="bold">HR: {game.home_runs}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <FaPersonRunning />
                                                    <Text fontWeight="bold">RBI: {game.rbis}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <FaPersonRunning />
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
                                        ) : (
                                            <SimpleGrid columns={2} spacing={2}>
                                                <Flex align="center" gap={2}>
                                                    <MdSportsBaseball />
                                                    <Text fontWeight="bold">IP: {game.innings_pitched}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <FaBaseballBatBall />
                                                    <Text fontWeight="bold">H: {game.hits_allowed}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <MdPerson />
                                                    <Text fontWeight="bold">K: {game.strikeouts}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <Text fontWeight="bold">BB: {game.walks_allowed}</Text>
                                                </Flex>
                                                <Flex align="center" gap={2}>
                                                    <MdSportsBaseball />
                                                    <Text fontWeight="bold">HR: {game.home_runs_allowed}</Text>
                                                </Flex>
                                            </SimpleGrid>
                                        )}
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                )}

                <Divider />

                {isTwoWayPlayer ? (
                    <Tabs variant="enclosed" >
                        <TabList pb={4}>
                            <Tab>Hitting</Tab>
                            <Tab>Pitching</Tab>
                        </TabList>
                        <TabPanels >
                            <TabPanel  >
                                <HittingStats
                                    stats={createHittingStatsObject(stats)}
                                    season={season}
                                />
                            </TabPanel>
                            <TabPanel >
                                <PitchingStats
                                    stats={stats}
                                    seasonYear={season}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                ) : isPitcher && showPitchingStats ? (
                    <PitchingStats
                        stats={stats}
                        seasonYear={season}
                    />
                ) : showHittingStats ? (
                    <HittingStats
                        stats={createHittingStatsObject(stats)}
                        season={season}
                    />
                ) : (
                    <Text color="gray.400" textAlign="center" fontSize="lg">
                        No statistics available for this player
                    </Text>
                )}
            </VStack>
        </Box >
    );
};

export default PlayerStats; 