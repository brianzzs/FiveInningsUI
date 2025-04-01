import React from "react";
import {
    Box,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import apiClient from "../../api/axiosInstance";
import ScheduleCard from "../ScheduleCard/ScheduleCard";
import { useNavigate } from "react-router-dom";

interface Team {
    id: number;
    name: string;
    wins: number;
    losses: number;
    probable_pitcher: {
        name: string;
        hand: string;
        wins: number;
        losses: number;
        era: number;
        id: number;
    };
}

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

    const { data: gamesData = [], error, isLoading } = useQuery<Game[], Error>({
        queryKey: ['todaySchedule'],
        queryFn: async () => {
            const response = await apiClient.get<Game[]>('/today_schedule');
            return response.data;
        },
        staleTime: 1000 * 60 * 10, 
    });

    const handlePitcherSelect = (playerId: number) => {
        navigate(`/players`, { state: { selectedPlayerId: playerId } });
    };

    if (error) {
        return (
            <Box>
                <Text color="red.500">An error occurred while fetching today's games.</Text>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center">
                <Spinner size="xl" color="red.500" />
            </Box>
        );
    }

    return (
        <div>
            <Box textAlign="center" mb={6}>
                <Text fontSize="3xl" fontWeight="bold" color="white">
                    Next Scheduled Games
                </Text>
            </Box>
            <ScheduleCard GamesData={gamesData} onPitcherSelect={handlePitcherSelect} />
        </div>
    );
};

export default TodaySchedule;



