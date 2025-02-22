import React from 'react';
import { Box, Grid, GridItem, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/Layout/NavBar';
import TodaySchedule from '../../components/TodaySchedule/TodaySchedule';
import FooterComponent from '../../components/Layout/Footer/Footer';
import { ROUTES, THEME } from '../../constants';
import backgroundImage from '../../img/bg2.jpg';
import { FaChartLine } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

export const StartPage: React.FC = () => {
    return (
        <Box position="relative" minHeight="100vh" bg={THEME.colors.background} width="100%">
            <NavBar />
            <Grid
                templateColumns="repeat(12, 1fr)"
                gap={4}
                mt="4rem"
                pb="60px"
                h="auto"
                w="100%"
                background={`linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${backgroundImage})`}
                backgroundSize="cover"
                backgroundPosition="left 30%"
                backgroundRepeat="no-repeat"
            >
                <GridItem colSpan={12} mt="4rem">
                    <VStack spacing={8} align="center" px="2rem">
                        <Heading
                            as="h1"
                            fontSize={["3xl", "4xl", "6xl"]}
                            color="white"
                            fontFamily={THEME.fonts.heading}
                            fontWeight="800"
                            textAlign="center"
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            <Text as="span" color={THEME.colors.accent}>MLB</Text> First 5 Innings
                            <Text fontSize={["xl", "2xl", "3xl"]} color=".800" mt={2}>
                                Advanced Betting Analytics
                            </Text>
                        </Heading>

                        <Text
                            color="gray.300"
                            fontSize={["md", "lg"]}
                            fontFamily={THEME.fonts.body}
                            maxW="800px"
                            textAlign="center"
                            lineHeight="tall"
                        >
                            Make data-driven betting decisions with our comprehensive First 5 Innings statistics, 
                            NRFI predictions, and advanced MLB analytics including PLAYER STATS.
                        </Text>

                        <Link to={ROUTES.STATISTICS}>
                            <Button
                                bg={THEME.colors.accent}
                                _hover={{
                                    bg: '#c41230',
                                    transform: 'translateY(-2px)',
                                    boxShadow: "lg"
                                }}
                                size="lg"
                                px="2rem"
                                py="1.8rem"
                                color="white"
                                fontFamily={THEME.fonts.heading}
                                fontWeight="600"
                                borderRadius="full"
                                leftIcon={<Icon as={FaChartLine} />}
                            >
                                Analyze Team Stats
                            </Button>
                        </Link>
                    </VStack>
                </GridItem>
            </Grid>
            <Grid mb={"2rem"}>
                <GridItem colSpan={12}>
                    <Box
                        bg="rgba(30, 30, 47, 0.9)"
                        borderRadius="xl"
                        p={6}
                        mx={[4, 8, 16]}
                    >
                        <TodaySchedule />
                    </Box>
                </GridItem>
            </Grid>

            <FooterComponent />
        </Box>
    );
};

export default StartPage;