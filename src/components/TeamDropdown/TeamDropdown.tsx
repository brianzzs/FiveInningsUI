import React from "react";
import { Box, FormControl, FormLabel, Select, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axiosInstance";

interface TeamDropdownProps {
  selectedTeam: number;
  onTeamChange: (teamId: number) => void;
}

const TeamDropdown: React.FC<TeamDropdownProps> = ({ selectedTeam, onTeamChange }) => {
  const { data, isLoading, error } = useQuery<Record<number, string>, Error>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await apiClient.get<Record<number, string>>("/teams");
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTeamChange(Number(event.target.value));
  };

  if (isLoading) {
    return (
      <Box width="100%" textAlign="center" py={4}>
        <Spinner size="md" color="accent.500" />
        <Text mt={2} color="textSecondary" fontSize="sm">
          Loading teams...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width="100%" textAlign="center" py={4}>
        <Text color="red.500" fontWeight="bold" fontSize="sm">
          {error.message}
        </Text>
      </Box>
    );
  }

  const teams = data ?? {};

  return (
    <Box width="100%">
      <FormControl id="team-select" isRequired>
        <FormLabel fontWeight="bold" color="textSecondary" fontSize="sm">
          Select Team
        </FormLabel>
        <Select placeholder="Select a Team" value={selectedTeam} onChange={handleChange}>
          {Object.entries(teams)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TeamDropdown;
