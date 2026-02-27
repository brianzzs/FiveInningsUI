import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axiosInstance";
import ScheduleCard from "../ScheduleCard/ScheduleCard";
import { useNavigate } from "react-router-dom";
import QueryState from "../UI/QueryState";

interface Game {
  awayPitcher: string;
  awayPitcherERA: string | number;
  awayPitcherHand: string;
  awayPitcherID: number;
  awayPitcherLosses: string | number;
  awayPitcherWins: string | number;
  away_team_id: number;
  away_team_name: string;
  away_team_record: string;
  game_id: number;
  game_datetime: string;
  homePitcher: string;
  homePitcherERA: string | number;
  homePitcherHand: string;
  homePitcherID: number;
  homePitcherLosses: string | number;
  homePitcherWins: string | number;
  home_team_id: number;
  home_team_name: string;
  home_team_record: string;
  status: string;
  venue: string;
}

const TodaySchedule: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: gamesData = [],
    error,
    isLoading,
  } = useQuery<Game[], Error>({
    queryKey: ["todaySchedule"],
    queryFn: async () => {
      const response = await apiClient.get<Game[]>("/today_schedule");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    refetchIntervalInBackground: true,
  });

  const handlePitcherSelect = (playerId: number) => {
    navigate(`/players`, { state: { selectedPlayerId: playerId } });
  };

  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textTransform="uppercase" letterSpacing="0.04em">
          Next Scheduled Games
        </Text>
        <Text color="textSecondary" mt={2}>
          Jump from matchup cards to team, pitcher, or direct game comparison views.
        </Text>
      </Box>

      <QueryState
        isLoading={isLoading}
        errorMessage={error?.message ?? null}
        hasData={gamesData.length > 0}
        loadingText="Loading scheduled games..."
      />

      {!isLoading && !error ? <ScheduleCard GamesData={gamesData} onPitcherSelect={handlePitcherSelect} /> : null}
    </Box>
  );
};

export default TodaySchedule;
