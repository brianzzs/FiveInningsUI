import React from "react";
import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { FaBaseballBall } from "react-icons/fa";

interface StatisticCardProps {
  data: number;
  id: string;
  label: string;
}

const getColor = (data: number): string => {
  if (data > 70) {
    return "statGood";
  }
  if (data >= 40) {
    return "statWarn";
  }
  return "statBad";
};

const StatisticCard: React.FC<StatisticCardProps> = ({ data, id, label }) => {
  const backgroundColor = getColor(data);

  return (
    <Box
      id={id}
      bg="panelSubtle"
      borderWidth="1px"
      borderColor="borderSubtle"
      borderRadius="xl"
      p={5}
      textAlign="center"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", borderColor: "borderStrong" }}
    >
      <Flex alignItems="center" justifyContent="center" mb={4} w={14} h={14} mx="auto" bg={backgroundColor} borderRadius="full" boxShadow="md">
        <Icon as={FaBaseballBall} w={7} h={7} color="white" />
      </Flex>
      <VStack spacing={2}>
        <Text fontSize="sm" fontWeight="700" letterSpacing="0.07em" color="textMuted" textTransform="uppercase">
          {label}
        </Text>
        <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color={backgroundColor}>
          {data}%
        </Text>
      </VStack>
    </Box>
  );
};

export default StatisticCard;
