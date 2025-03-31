import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StatisticsData } from '../types/StatisticsData';

export const useStatistics = (teamId: number, period: number) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const query = useQuery<StatisticsData, Error>({
        queryKey: ['statistics', teamId, period],
        queryFn: async () => {
            const response = await axios.get<StatisticsData>(`${apiUrl}/team-stats/${teamId}/${period}`);
            return response.data;
        },
        enabled: !!teamId && teamId > 0,
        staleTime: 1000 * 60 * 5,
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        error: query.error,
    };
};





