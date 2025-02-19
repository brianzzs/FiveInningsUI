import React, { useState } from 'react';
import {
    Box,
    Container,
    VStack,
    Select,
    Text,
    Avatar,
    SimpleGrid,
    Flex,
} from '@chakra-ui/react';
import { NavBar } from '../../components/Layout/NavBar';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import PlayerStats from '../../components/PlayerStats/PlayerStats';
import FooterComponent from '../../components/Layout/Footer/Footer';
import { THEME } from '../../constants';

const popularPlayers = [
    { id: 592450, name: "Aaron Judge", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current" },
    { id: 660271, name: "Shohei Ohtani", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current" },
    { id: 608331, name: "Max Fried", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608331/headshot/67/current" },
    { id: 669373, name: "Tarik Skuba", image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/669373/headshot/67/current" },
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
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [selectedSeason, setSelectedSeason] = useState('2024');
    const currentYear = new Date().getFullYear();
    const seasons = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    return (
        <Box minHeight="100vh" bg="gray.900">
            <NavBar />
            <Container maxW="container.xl" pt="6rem" pb="4rem">
                <VStack spacing={8} align="stretch">
                    <PlayerSearch onPlayerSelect={setSelectedPlayerId} />

                    {selectedPlayerId && (
                        <Select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            bg="gray.700"
                            color="red.500"
                            maxW="200px"
                            alignSelf="center"
                            fontFamily={THEME.fonts.body}
                        >
                            {seasons.map((year) => (
                                <option key={year} value={year} color="red">
                                    {year} Season
                                </option>
                            ))}
                        </Select>
                    )}

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
                                        onClick={() => {
                                            setSelectedPlayerId(player.id);
                                            setSelectedSeason('2024');
                                        }}
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
                        <PlayerStats
                            playerId={selectedPlayerId}
                            season={selectedSeason}
                        />
                    )}
                </VStack>
            </Container>
            <FooterComponent isLoading={false} />
        </Box>
    );
};

export default PlayerPage; 