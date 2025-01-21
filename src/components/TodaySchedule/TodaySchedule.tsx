import React from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    SimpleGrid,
    Spinner,
    VStack,
    HStack,
} from "@chakra-ui/react";
import ScheduleCard from "../ScheduleCard/ScheduleCard";
import axios from "axios";




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
    };
}

interface Game {
    game_datetime: string;
    away_team: Team;
    home_team: Team;
}

interface TodayScheduleProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}


const TodaySchedule: React.FC<TodayScheduleProps> = ({ setIsLoading }) => {

    const [gamesData, setGamesData] = React.useState<Game[]>([]);
    const [error, setError] = React.useState<string | null>(null);


    React.useEffect(() => {
        fetchTodaySchedule();
    }, []);

    function saveScheduleToStorage(gamesData: Game[]) {
        localStorage.setItem("todaySchedule", JSON.stringify(gamesData));
    }


    const fetchTodaySchedule = async () => {

        const isScheduleCached = localStorage.getItem("todaySchedule");

        if (isScheduleCached) {
            setGamesData(JSON.parse(isScheduleCached));
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        await axios.get<Game[]>("http://127.0.0.1:5000/schedule_today")
            .then((response) => {
                setGamesData(response.data);
                saveScheduleToStorage(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching today's games:", error);
                setError("An error occurred while fetching today's games.");
                setIsLoading(false);
                setGamesData([]);
            });
    }

    if (error) {
        return (
            <Box>
                <Text>{error}</Text>
            </Box>
        );
    }

    if (gamesData.length === 0) {
        return (
            <Box>
                <Spinner />
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
            <ScheduleCard GamesData={gamesData} />
        </div>
    );

}
export default TodaySchedule;



