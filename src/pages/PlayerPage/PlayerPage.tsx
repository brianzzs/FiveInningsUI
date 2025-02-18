import React, { useState } from 'react';
import {
    Box,
    Container,
    VStack,
    Select,
} from '@chakra-ui/react';
import { NavBar } from '../../components/Layout/NavBar';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import PlayerStats from '../../components/PlayerStats/PlayerStats';
import FooterComponent from '../../components/Layout/Footer/Footer';
import { THEME } from '../../constants';

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
                            fontFamily={THEME.fonts.body}
                        >
                            {seasons.map((year) => (
                                <option key={year} value={year} color="red">
                                    {year} Season
                                </option>
                            ))}
                        </Select>
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