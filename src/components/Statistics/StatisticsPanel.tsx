import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import StatisticCard from './StatisticsCard';

interface StatisticsPanelProps {
  data: {
    win_percentage: number;
    nrfi: number;
    over1_5F5: number;
    over2_5F5: number;
  };
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ data }) => (
  <SimpleGrid
    columns={[1, 2, 4]}
    spacing={6}
    width="100%"
    px={[4, 8, 16]}
  >
    <StatisticCard id="win-percentage" label="ML F5" data={data.win_percentage} />
    <StatisticCard id="nrfi" label="NRFI" data={data.nrfi} />
    <StatisticCard id="over1-5f5" label="Over 1.5 F5 TT" data={data.over1_5F5} />
    <StatisticCard id="over2-5f5" label="Over 2.5 F5 TT" data={data.over2_5F5} />
  </SimpleGrid>
);
