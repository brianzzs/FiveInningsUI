import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import StatisticCard from './StatisticsCard';
import { StatisticsData } from '../../types/StatisticsData';

interface StatisticsPanelProps {
  data: StatisticsData;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ data }) => (
  <SimpleGrid
    columns={[1, 2, 5]}
    spacing={4}
    width="100%"
    px={[4, 8, 16]}
  >
    <StatisticCard id="nrfi" label="Team NRFI" data={data.nrfi} />
    <StatisticCard id="game-nrfi" label="Game NRFI" data={data.game_nrfi_percentage} />
    <StatisticCard id="over1-5f5" label="Over 1.5 F5 TT" data={data.over1_5F5} />
    <StatisticCard id="over2-5f5" label="Over 2.5 F5 TT" data={data.over2_5F5} />
    <StatisticCard id="win-percentage" label="ML F5" data={data.win_percentage_f5} />
  </SimpleGrid>
);
