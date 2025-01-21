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

interface StatisticCardProps {
    data: number;
    id: string;
    label: string;
}

const getColor = (data: number): string => {
    if (data > 70) {
        return "#02ff4d";
    } else if (data >= 40 && data <= 70) {
        return "#d38800"; 
    } else {
        return "#ff2102"; 
    }
};

const StatisticCard: React.FC<StatisticCardProps> = ({ data, id, label }) => {
    const backgroundColor = getColor(data);
    const cardBg = useColorModeValue("gray.700", "gray.800");
    const textColor = useColorModeValue("gray.100", "white");

    return (
        <Box
            id={id}
            bg={cardBg}
            color={textColor}
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            textAlign="center"
            transition="all 0.3s"
            _hover={{ transform: "scale(1.05)" }}
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                mb={4}
                w={14}
                h={14}
                mx="auto"
                bg={backgroundColor}
                borderRadius="full"
                boxShadow="md"
            >
                <Icon as={FaBaseballBall} w={6} h={6} color={textColor} />
            </Flex>
            <VStack spacing={3}>
                <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    color={textColor}
                >
                    {label}
                </Text>
                <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    color={backgroundColor}
                    textShadow="1px 1px 5px rgba(0,0,0,0.2)"
                >
                    {data}%
                </Text>
            </VStack>
        </Box>
    );
};

export default StatisticCard;
