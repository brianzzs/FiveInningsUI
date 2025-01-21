import React, { useState } from "react";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import TodaySchedule from "../TodaySchedule/TodaySchedule";
import FooterComponent from "../Footer/Footer";
import Bg from "../../img/bg.jpg";

const StartPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <Box position="relative" minHeight="100vh" bg="#253750">
            {/* Header */}
            <Flex
                as="nav"
                justify="space-between"
                align="center"
                p="1rem 2rem"
                bg="#152643"
                position="fixed"
                top={0}
                left={0}
                right={0}
                zIndex={100}
            >
                <Heading as="h1" size="lg" color="white">
                    Five Innings Friend
                </Heading>
                <ChakraLink
                    as={Link}
                    to="/stats"
                    textDecoration="none"
                    color="white"
                    fontSize="lg"
                >
                    Statistics
                </ChakraLink>
            </Flex>

            {/* Background Image */}
            <Box
                backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${Bg})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={-2}
            />

            {/* Content */}
            <Grid
                templateColumns="repeat(12, 1fr)"
                gap={4}
                mt="4rem"
                fontFamily="Poppins"
                fontWeight="400"
                pb="60px" /* Add padding to prevent overlap with footer */
            >
                {/* Hero Section */}
                <GridItem colSpan={12} mt="4rem">
                    <VStack spacing={6} align="center" textAlign="center">
                        <Heading
                            as="h2"
                            fontSize={["2xl", "4xl", "6xl"]}
                            color="#F3F4F6"
                            textAlign="center"
                            mb={4}
                        >
                            Unlock the Power of BETTING with Data!
                        </Heading>
                        <Text color="#9CA3AF" fontSize={["md", "lg"]} mb={6}>
                            Our comprehensive statistics provide detailed insights for those
                            who love to bet on First 5 Innings including:
                        </Text>
                        <VStack align="flex-start" color="white" spacing={2}>
                            <Text>- Over 1.5 Runs</Text>
                            <Text>- Over 2.5 Runs</Text>
                            <Text>- No Run First Inning %</Text>
                            <Text>- First 5 Innings Money Line</Text>
                            <Text>
                                - Game History for 5 innings up to the last{" "}
                                <strong>30 Days</strong>
                            </Text>
                        </VStack>
                        <VStack spacing={4}>
                            <Text color="white" fontSize={["md", "lg"]}>
                                Empower your betting decision-making with our data-driven
                                approach. Ready to out-smart the bookies?
                            </Text>
                            <ChakraLink as={Link} to="/stats" textDecoration="none">
                                <Button
                                    bg="#F59E0B"
                                    _hover={{
                                        bg: "#D97706",
                                        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
                                    }}
                                    borderRadius="30px"
                                    size="lg"
                                    color="white"
                                >
                                    EXPLORE
                                </Button>
                            </ChakraLink>
                        </VStack>
                    </VStack>
                </GridItem>

                {/* Schedule Section */}
                <GridItem colSpan={12}>
                    <Flex
                        justify="center"
                        align="center"
                        overflowX="auto"
                        p="1rem"
                        bg="linear-gradient(135deg, #1E1E2F 0%, #2E3A59 100%)"
                    >
                        <TodaySchedule
                            placeholder={
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="50vh"
                                >
                                    <Text color="white" fontSize="lg">
                                        Loading today's schedule...
                                    </Text>
                                </Box>
                            }
                            setIsLoading={setIsLoading}
                        />
                    </Flex>
                </GridItem>
            </Grid>

            <FooterComponent isLoading={isLoading} />
        </Box>
    );
};

export default StartPage;
