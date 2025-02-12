import React from 'react';
import { Box, Grid, GridItem, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/Layout/NavBar';
import TodaySchedule from '../../components/TodaySchedule/TodaySchedule';
import FooterComponent from '../../components/Layout/Footer/Footer';
import { ROUTES, THEME } from '../../constants';
import backgroundImage from '../../img/bg2.webp';

export const StartPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <Box position="relative" minHeight="100vh" bg={THEME.colors.background}
            width="100%">
            <NavBar />

            <Grid
                templateColumns="repeat(12, 1fr)"
                gap={4}
                mt="4rem"
                pb="60px"
                h="auto"
                w="100%"
                background={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`}
                backgroundSize="cover"
                backgroundPosition="center 20%"
                backgroundRepeat="no-repeat"
            >
                <GridItem colSpan={12} mt="4rem">
                    <VStack spacing={8} align="center" px="2rem">
                        <Heading
                            as="h2"
                            fontSize={["3xl", "4xl", "5xl"]}
                            color={THEME.colors.accent}
                            fontFamily={THEME.fonts.heading}
                            fontWeight="700"
                        >
                            Professional Baseball Analytics
                        </Heading>

                        <Text
                            color="whiteAlpha.900"
                            fontSize={["md", "lg"]}
                            fontFamily={THEME.fonts.body}
                            maxW="800px"
                            textAlign="center"
                        >
                            Access comprehensive First 5 Innings statistics and data-driven insights
                            to enhance your baseball betting analysis.
                        </Text>

                        <VStack spacing={4} align="center">
                            <Link to={ROUTES.STATISTICS}>
                                <Button
                                    bg={THEME.colors.primary}
                                    _hover={{
                                        bg: THEME.colors.primaryHover,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s',
                                    }}
                                    size="lg"
                                    px="2rem"
                                    color="white"
                                    fontFamily={THEME.fonts.heading}
                                    fontWeight="600"
                                    borderRadius="full"
                                >
                                    View Statistics
                                </Button>
                            </Link>
                        </VStack>
                    </VStack>
                </GridItem>
            </Grid>
            <Grid>

                <GridItem colSpan={12}>
                    <Box
                        bg="rgba(30, 30, 47, 0.9)"
                        borderRadius="xl"
                        p={6}
                        mx={[4, 8, 16]}
                    >
                        <TodaySchedule isLoading={isLoading} setIsLoading={setIsLoading} />
                    </Box>
                </GridItem>
            </Grid>

            <FooterComponent isLoading={isLoading} />

        </Box>
    );
};

export default StartPage;