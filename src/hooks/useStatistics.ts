import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatisticsData } from '../types/StatisticsData';

interface UseStatisticsResult {
    fetchStats: (teamId: number, period: number) => Promise<void>;
    data: StatisticsData | null;
    isLoading: boolean;
    error: Error | null;
}

export const useStatistics = (): UseStatisticsResult => {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);


    const fetchStats = async (teamId: number, period: number) => {
        setIsLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL
        try {
            const response = await axios.get<StatisticsData>(`${apiUrl}/stats/${teamId}/${period}`);

            setData(response.data);
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Failed to Fetch Statistics'));
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, fetchStats };
};





