import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

interface TeamDropdownProps {
  selectedTeam: number;
  onTeamChange: (teamId: number) => void;
}

const TeamDropdown: React.FC<TeamDropdownProps> = ({
  selectedTeam,
  onTeamChange,
}) => {
  const [teams, setTeams] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/teams");
        setTeams(response.data);
      } catch (error) {
        setError("Failed to fetch teams. Please try again later.");
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTeamChange(Number(event.target.value));
  };

  if (loading) {
    return (
      <Box width="100%" textAlign="center" py={4}>
        <Spinner size="lg" color="teal.500" />
        <Text mt={2} color="gray.500">
          Loading teams...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width="100%" textAlign="center" py={4}>
        <Text color="red.500" fontWeight="bold">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <FormControl id="team-select" isRequired>
        <FormLabel fontWeight="bold" color="teal.600">
          Select a Team
        </FormLabel>
        <Select
          placeholder="Select a Team"
          value={selectedTeam}
          onChange={handleChange}
          bg="white"
          focusBorderColor="teal.500"
          borderRadius="md"
          shadow="sm"
        >
          {Object.entries(teams).map(([teamId, teamName]) => (
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
