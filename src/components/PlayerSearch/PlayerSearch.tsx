import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Spinner,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import apiClient from "../../api/axiosInstance";
import { Player } from "./interface";

interface PlayerSearchProps {
  onPlayerSelect: (playerId: number) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onPlayerSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref,
    handler: () => setShowResults(false),
  });

  const debouncedSetSearch = useMemo(() => debounce((term: string) => setSearchTerm(term), 250), []);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const searchPlayers = async (query: string): Promise<Player[]> => {
    if (!query || query.length < 3) return [];
    const response = await apiClient.get<Player[]>(`/player/search/${query}`);
    return [...response.data].sort((a, b) => a.full_name.localeCompare(b.full_name));
  };

  const { data: players = [], isLoading } = useQuery<Player[]>({
    queryKey: ["players", searchTerm],
    queryFn: () => searchPlayers(searchTerm),
    enabled: searchTerm.length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearch(value.trim());
    setShowResults(true);
  };

  const handlePlayerClick = (playerId: number, playerName: string) => {
    onPlayerSelect(playerId);
    setShowResults(false);
    setInputValue(playerName);
    setSearchTerm("");
  };

  return (
    <Box position="relative" width="100%" maxW="700px" ref={ref}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isLoading ? <Spinner size="sm" color="accent.500" /> : <SearchIcon color="textMuted" />}
        </InputLeftElement>
        <Input
          value={inputValue}
          placeholder="Search a player (Aaron Judge, Shohei Ohtani, Bryce Harper...)"
          onChange={handleInputChange}
          bg="panelSubtle"
          color="textPrimary"
          borderRadius="full"
          pl={10}
          _placeholder={{ color: "textMuted" }}
        />
      </InputGroup>

      {showResults && players.length > 0 ? (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg="panelBg"
          borderWidth="1px"
          borderColor="borderSubtle"
          borderRadius="xl"
          boxShadow="panel"
          maxH="420px"
          overflowY="auto"
          zIndex={20}
        >
          {players.map((player) => (
            <ListItem
              key={player.id}
              onClick={() => handlePlayerClick(player.id, player.full_name)}
              _hover={{ bg: "panelSubtle" }}
              cursor="pointer"
              p={3}
              borderBottomWidth="1px"
              borderColor="borderSubtle"
            >
              <Flex align="center" gap={2}>
                <Avatar src={player.image_url} size="md" />
                <Box>
                  <Text color="textPrimary" fontWeight="bold">
                    {player.full_name}
                  </Text>
                  <Text color="textMuted" fontSize="sm">
                    {player.position} · {player.current_team}
                  </Text>
                </Box>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : null}
    </Box>
  );
};

export default PlayerSearch;
