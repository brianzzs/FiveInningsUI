import React from 'react';
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
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PlayerStats } from './interface';

interface PlayerStatsProps {
    playerId: number;
    season: string;
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

const PlayerStats: React.FC<PlayerStatsProps> = ({ playerId, season }) => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['playerStats', playerId, season],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/player/stats/${playerId}/${season}`);
            return response.data as PlayerStats;
        },
    });

    if (isLoading || !stats) {
        return null;
    }

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
                <Grid templateColumns={{ base: "1fr", md: "auto 1fr" }} gap={6}>
                    <Image
                        src={stats.player_info.images.headshot}
                        alt={stats.player_info.full_name}
                        borderRadius="md"
                        maxW="200px"
                    />
                    <VStack align="start" spacing={4}>
                        <Heading size="lg">{stats.player_info.full_name}</Heading>
                        <HStack spacing={4} flexWrap="wrap">
                            <Text>Position: {stats.player_info.position}</Text>
                            <Text>Age: {stats.player_info.age}</Text>
                            <Text>Bats: {stats.player_info.bat_side}</Text>
                            <Text>Throws: {stats.player_info.throw_hand}</Text>
                            <Text>Team: {stats.player_info.current_team}</Text>
                        </HStack> 
                    </VStack>
                </Grid>

                <Divider  />

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
        </Box>
    );
};

export default PlayerStats; 