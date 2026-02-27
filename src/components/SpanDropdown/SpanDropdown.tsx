import React from "react";
import { Box, FormControl, FormLabel, Select } from "@chakra-ui/react";

interface SpanDropdownProps {
  onPeriodChange: (period: number) => void;
  selectedPeriod: number;
}

const SpanDropdown: React.FC<SpanDropdownProps> = ({ onPeriodChange, selectedPeriod }) => {
  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPeriodChange(parseInt(event.target.value, 10));
  };

  const periods = [5, 10, 15, 20, 25, 30];

  return (
    <Box width="100%">
      <FormControl id="period-select" isRequired>
        <FormLabel fontWeight="bold" color="textSecondary" fontSize="sm">
          Date Span
        </FormLabel>
        <Select value={selectedPeriod} onChange={handlePeriodChange}>
          {periods.map((period) => (
            <option key={period} value={period}>
              Last {period} Days
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SpanDropdown;
