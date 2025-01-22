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
    Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import TodaySchedule from "../TodaySchedule/TodaySchedule";
import FooterComponent from "../Footer/Footer";
import Bg from "../../img/bg2.webp";

const StartPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <Box
            position="relative"
            minHeight="100vh"
            bg="#1A202C" // Dark gray background
            width="100%"
        >
            {/* Navigation Bar */}
            <Flex
                as="nav"
                justify="space-between"
                align="center"
                p="1rem 2rem"
                bg="#2D3748" // Slightly lighter gray for contrast
                position="fixed"
                top={0}
                left={0}
                right={0}
                zIndex={100}
            >
                <Heading
                    as="h1"
                    size="lg"
                    color="white"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="700"
                >
                    Five Innings
                </Heading>
                <ChakraLink
                    as={Link}
                    to="/stats"
                    textDecoration="none"
                    color="white"
                    fontSize="lg"
                    fontFamily="Roboto, sans-serif"
                >
                    Statistics
                </ChakraLink>
            </Flex>

            {/* Content Section */}
            <Grid
                templateColumns="repeat(12, 1fr)"
                gap={4}
                mt="4rem"
                pb="60px"
                w="100%"
                h="100vh"
                background={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${Bg})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
            >
                <GridItem colSpan={12} mt="4rem" w="100%">
                    <VStack spacing={6} align="center" textAlign="center" px="2rem">
                        {/* Headline */}
                        <Heading
                            as="h2"
                            fontSize={["3xl", "4xl", "5xl"]}
                            color="#F59E0B" // Golden yellow for emphasis
                            fontFamily="Poppins, sans-serif"
                            fontWeight="700"
                        >
                            Bet Smarter, Win Bigger!
                        </Heading>

                        {/* Subheadline */}
                        <Text
                            color="whiteAlpha.800"
                            fontSize={["md", "lg"]}
                            fontFamily="Roboto, sans-serif"
                            mb={6}
                        >
                            Unlock data-driven insights for the First 5 Innings to gain the edge
                            you need.
                        </Text>

                        {/* Features List */}
                        <VStack
                            align="center"
                            spacing={2}
                            color="white"
                            fontSize={["sm", "md"]}
                            fontFamily="Roboto, sans-serif"
                        >
                            <Text>- Over 1.5 and 2.5 Runs Analysis</Text>
                            <Text>- No Run First Inning Statistics</Text>
                            <Text>- First 5 Innings Money Line</Text>
                            <Text>- 30-Day Game History</Text>
                        </VStack>

                        {/* Call-to-Action */}
                        <VStack spacing={4}>
                            <Text
                                color="white"
                                fontSize={["md", "lg"]}
                                fontFamily="Roboto, sans-serif"
                            >
                                Make informed decisions and outsmart the competition today!
                            </Text>
                            <ChakraLink as={Link} to="/stats" textDecoration="none">
                                <Button
                                    bg="#38B2AC" // Teal for an energetic look
                                    _hover={{
                                        bg: "#2C7A7B",
                                        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
                                    }}
                                    borderRadius="30px"
                                    size="lg"
                                    px="2rem"
                                    color="white"
                                    fontFamily="Poppins, sans-serif"
                                    fontWeight="600"
                                >
                                    Get Started
                                </Button>
                            </ChakraLink>
                        </VStack>
                    </VStack>
                </GridItem>

                {/* Today's Schedule Section */}
                <GridItem colSpan={12} w="100%">
                    <Flex
                        justify="center"
                        align="center"
                        overflowX="auto"
                        p="1rem"
                        bg="linear-gradient(135deg, #1E1E2F 0%, #2E3A59 100%)"
                    >
                        <TodaySchedule isLoading={isLoading} setIsLoading={setIsLoading} />
                    </Flex>
                </GridItem>
            </Grid>

            {/* Footer */}
            <FooterComponent isLoading={isLoading} />
        </Box>
    );
};

export default StartPage;
