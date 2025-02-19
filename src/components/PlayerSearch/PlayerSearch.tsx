import React, { useState, useRef } from 'react';
import {
    Box,
    Input,
    List,
    ListItem,
    Text,
    Flex,
    useOutsideClick,
    InputGroup,
    InputLeftElement,
    Spinner,
    Avatar,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { debounce } from 'lodash';
import { Player } from './interface';


interface PlayerSearchProps {
    onPlayerSelect: (playerId: number) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onPlayerSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useOutsideClick({
        ref: ref,
        handler: () => setShowResults(false),
    });

    const searchPlayers = async (query: string): Promise<Player[]> => {
        if (!query || query.length < 3) return [];
        const response = await axios.get(`${apiUrl}/player/search/${query}`);
        const players = response.data;
        players.sort((a: Player, b: Player) => a.full_name.localeCompare(b.full_name));
        return players;
    };

    const debouncedSearchTerm = debounce((term: string) => {
        setSearchTerm(term);
    }, 300);

    const { data: players = [], isLoading } = useQuery({
        queryKey: ['players', searchTerm],
        queryFn: () => searchPlayers(searchTerm),
        enabled: searchTerm.length >= 3,
        staleTime: 1000 * 60 * 5, 
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        debouncedSearchTerm(value);
        setShowResults(true);
    };

    const handlePlayerClick = (playerId: number) => {
        onPlayerSelect(playerId);
        setShowResults(false);
        setSearchTerm('');
    };

    return (
        <Box position="relative" width="100%" maxW="600px" ref={ref}>
            <InputGroup display="flex" justifyContent="center" alignItems="center">
                <InputLeftElement pointerEvents="none">
                    {isLoading ? <Spinner size="sm" /> : <SearchIcon color="gray.300" />}
                </InputLeftElement>
                <Input
                    placeholder="Search for a player... (Aaron Judge, Shohei Ohtani, Bryce Harper, etc.)"
                    onChange={handleInputChange}
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                    borderRadius="md"
                    _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                    }}
                />
            </InputGroup>

            {showResults && players.length > 0 && (
                <List
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    mt={2}
                    bg="gray.700"
                    borderRadius="md"
                    boxShadow="xl"
                    maxH="400px"
                    overflowY="auto"
                    zIndex={10}
                >
                    {players.map((player) => (
                        <ListItem
                            key={player.id}
                            onClick={() => handlePlayerClick(player.id)}
                            _hover={{ bg: 'gray.600' }}
                            cursor="pointer"
                            p={3}
                            borderBottom="1px"
                            borderColor="gray.600"
                        >
                            <Flex align="center" mb={2}>
                                <Avatar src={player.image_url} size="md" mr={2} />
                                <Text color="white" fontWeight="bold">
                                    {player.full_name}
                                </Text>
                                <Text color="gray.400" ml={2} fontSize="sm">
                                    {player.position}
                                </Text>
                                <Text color="gray.400" ml={2} fontSize="sm">
                                    {player.current_team}
                                </Text>
                            </Flex>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default PlayerSearch; 