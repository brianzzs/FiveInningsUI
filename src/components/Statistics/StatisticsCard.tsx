import React from "react";
import {
    Box,
    Text,
    Flex,
    Icon,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { FaBaseballBall } from "react-icons/fa";
import { THEME } from "../../constants";

interface StatisticCardProps {
    data: number;
    id: string;
    label: string;
}

const getColor = (data: number): string => {
    if (data > 70) {
        return THEME.colors.success;
    } else if (data >= 40 && data <= 70) {
        return THEME.colors.warning;
    } else {
        return THEME.colors.danger;
    }
};

const StatisticCard: React.FC<StatisticCardProps> = ({ data, id, label }) => {
    const backgroundColor = getColor(data);

    return (
        <Box
            id={id}
            bg={THEME.colors.cardBg}
            color="white"
            borderRadius="xl"
            boxShadow="xl"
            p={6}
            textAlign="center"
            transition="all 0.3s"
            _hover={{ 
                transform: "translateY(-5px)",
                boxShadow: "2xl"
            }}
            border="1px solid"
            borderColor="gray.700"
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                mb={4}
                w={16}
                h={16}
                mx="auto"
                bg={backgroundColor}
                borderRadius="full"
                boxShadow="lg"
            >
                <Icon as={FaBaseballBall} w={8} h={8} color="white" />
            </Flex>
            <VStack spacing={3}>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    letterSpacing="wide"
                    color="gray.100"
                    textTransform="uppercase"
                >
                    {label}
                </Text>
                <Text
                    fontSize="5xl"
                    fontWeight="bold"
                    color={backgroundColor}
                    textShadow="2px 2px 4px rgba(0,0,0,0.4)"
                >
                    {data}%
                </Text>
            </VStack>
        </Box>
    );
};

export default StatisticCard;
