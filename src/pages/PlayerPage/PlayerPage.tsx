import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    Avatar,
    SimpleGrid,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../../components/Layout/NavBar';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import PlayerStats from '../../components/PlayerStats/PlayerStats';
import PlayerBettingStats from '../../components/PlayerBettingStats/PlayerBettingStats';
import FooterComponent from '../../components/Layout/Footer/Footer';
import { THEME } from '../../constants';
import { logEvent } from '../../utils/analytics';
import NextScheduledGame from '../../components/NextScheduledGame/NextScheduledGame';

const popularPlayers = [
    { id: 592450, name: "Aaron Judge", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current" },
    { id: 660271, name: "Shohei Ohtani", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current" },
    { id: 608331, name: "Max Fried", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608331/headshot/67/current" },
    { id: 669373, name: "Tarik Skubal", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/669373/headshot/67/current" },
    { id: 547180, name: "Bryce Harper", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/547180/headshot/67/current" },
    { id: 660670, name: "Ronald Acuña Jr.", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660670/headshot/67/current" },
    { id: 608369, name: "Corey Seager", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608369/headshot/67/current" },
    { id: 694973, name: "Paul Skenes", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/694973/headshot/67/current" },
    { id: 677951, name: "Bobby Witt Jr.", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/677951/headshot/67/current" },
    { id: 554430, name: "Zack Wheeler", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/554430/headshot/67/current" },
    { id: 665742, name: "Juan Soto", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/665742/headshot/67/current" },
    { id: 543037, name: "Gerrit Cole", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current" },
    { id: 605141, name: "Mookie Betts", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current" },
    { id: 518692, name: "Freddie Freeman", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current" },
    { id: 596019, name: "Francisco Lindor", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/596019/headshot/67/current" },
    { id: 670541, name: "Yordan Alvarez", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/670541/headshot/67/current" },
    { id: 608070, name: "José Ramírez", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608070/headshot/67/current" },
    { id: 683002, name: "Gunnar Henderson", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/683002/headshot/67/current" },
];

const PlayerPage: React.FC = () => {
    const location = useLocation();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [selectedSeason, setSelectedSeason] = useState('2024');
    const [bettingGamesCount, setBettingGamesCount] = useState(5);
    const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
    const [fetchGame, setFetchGame] = useState<boolean>(false);
    const currentYear = new Date().getFullYear();
    const currentSeason = "2025";
    const seasons = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    const isCurrentSeason = selectedSeason === currentSeason;

    useEffect(() => {
        const state = location.state as { selectedPlayerId?: number } | null;
        if (state?.selectedPlayerId) {
            setSelectedPlayerId(state.selectedPlayerId);
            setSelectedSeason(currentSeason);
            setFetchGame(true);
        }
    }, [location, currentSeason]);

    const handlePlayerSelect = (playerId: number) => {
        setSelectedPlayerId(playerId);
        setSelectedSeason(currentSeason);
        setBettingGamesCount(5);
        setPlayerTeamId(null);
        setFetchGame(true);

        logEvent('player_selected', {
            player_id: playerId,
            season: currentSeason
        });
    };

    const handleSeasonChange = (season: string) => {
        setSelectedSeason(season);

        logEvent('season_changed', {
            player_id: selectedPlayerId,
            season: season
        });
    };

    const handlePitcherSelect = (playerId: number) => {
        handlePlayerSelect(playerId);
    };

    const handleStatsError = () => {
        if (selectedSeason === currentSeason) {
            const fallbackSeason = (currentYear - 1).toString();
            setSelectedSeason(fallbackSeason);
            logEvent('season_fallback', {
                player_id: selectedPlayerId,
                from_season: currentSeason,
                to_season: fallbackSeason
            });
        }
    };

    return (
        <Box 
            minHeight="100vh" 
            bg="gray.900"
        >
            <NavBar />
            <Container maxW="container.xl" pt="6rem" pb="4rem" flexGrow={1} px={{ base: 4, md: 6 }}>
                <VStack spacing={8} align="stretch">
                    <Flex justify="center">
                        <PlayerSearch onPlayerSelect={handlePlayerSelect} />
                    </Flex>

                    {!selectedPlayerId && (
                        <Box>
                            <Text color={THEME.colors.text.light} fontSize="2xl" fontFamily={THEME.fonts.heading} mb={4} textAlign="center">
                                Popular Players
                            </Text>

                            <SimpleGrid columns={[2, 3, 4, 6]} spacing={4}>
                                {popularPlayers.map((player) => (
                                    <Flex
                                        key={player.id}
                                        direction="column"
                                        align="center"
                                        bg="gray.700"
                                        p={4}
                                        borderRadius="lg"
                                        cursor="pointer"
                                        onClick={() => handlePlayerSelect(player.id)}
                                        _hover={{ bg: 'gray.600', transform: 'scale(1.05)' }}
                                        transition="all 0.2s"
                                    >
                                        <Avatar src={player.image} size="xl" mb={2} />
                                        <Text color="gray.200" fontSize="sm" textAlign="center">
                                            {player.name}
                                        </Text>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Box>
                    )}

                    {selectedPlayerId && (
                        <>
                            <Box bg="gray.800" borderRadius="xl" p={4} shadow="lg">
                                <Tabs variant="enclosed" colorScheme="red">
                                    <TabList>
                                        <Tab color="green.500" _selected={{ color: 'white', bg: 'gray.700' }}>Player Stats</Tab>
                                        <Tab color="green.500" _selected={{ color: 'white', bg: 'gray.700' }}>Betting Analysis</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel p={0} pt={4}>
                                            <PlayerStats
                                                playerId={selectedPlayerId}
                                                season={selectedSeason}
                                                onTeamIdSet={setPlayerTeamId}
                                                onError={handleStatsError}
                                                onSeasonChange={handleSeasonChange}
                                            />
                                        </TabPanel>
                                        <TabPanel p={0} pt={4}>
                                            <PlayerBettingStats
                                                playerId={selectedPlayerId}
                                                gamesCount={bettingGamesCount}
                                                onGamesCountChange={setBettingGamesCount}
                                            />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>

                            {playerTeamId && (
                                <Box 
                                    mt={4}
                                    bg="gray.800"
                                    p={5}
                                    borderRadius="xl"
                                    shadow="lg"
                                >
                                    <Text fontSize="xl" fontWeight="bold" color="white" mb={4} textAlign="center">
                                        Next Scheduled Game
                                    </Text>
                                    <NextScheduledGame
                                        teamId={playerTeamId}
                                        fetchGame={fetchGame}
                                        onPitcherSelect={handlePitcherSelect}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </VStack>
            </Container>
            <FooterComponent />
        </Box>
    );
};

export default PlayerPage; 