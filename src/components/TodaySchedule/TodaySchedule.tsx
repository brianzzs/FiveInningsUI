import React from "react";
import {
    Box,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
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
    game_datetime: string;
    away_team: Team;
    home_team: Team;
}

const TodaySchedule: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const { data: gamesData = [], error, isLoading } = useQuery<Game[], Error>({
        queryKey: ['todaySchedule'],
        queryFn: async () => {
            const response = await axios.get<Game[]>(`${apiUrl}/today_schedule`);
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



