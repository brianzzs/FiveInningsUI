import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Box,
    Container,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    VStack,
    HStack,
    SimpleGrid,
    Divider,
    Card,
    CardHeader,
    CardBody,
    Icon,
    Badge
} from '@chakra-ui/react';
import { MdCalendarToday, MdStadium, MdInfoOutline, MdTrendingUp, MdBarChart, MdPeople, MdSportsBaseball, MdOutlineErrorOutline } from 'react-icons/md';
import { NavBar } from '../../components/Layout/NavBar';
import FooterComponent from '../../components/Layout/Footer/Footer';
import TeamLogo from '../../components/TeamLogo/TeamLogo';
import { getTeamAbbreviation } from '../../constants/teams';
import { THEME } from '../../constants';
import { StatisticsData } from '../../types/StatisticsData';

interface Player {
    id: number;
    name: string;
    position: string;
}

interface Pitcher {
    hand: string;
    id: number;
    name: string;
    season_era: string | number;
}

interface TeamInfo {
    id: number;
    lineup: Player[] | null;
    name: string; 
}

interface GameInfo {
    away_pitcher: Pitcher;
    away_team: TeamInfo;
    game_datetime: string;
    game_id: number;
    home_pitcher: Pitcher;
    home_team: TeamInfo;
    status: string;
    venue: string;
}

interface TeamComparison {
    away: StatisticsData;
    home: StatisticsData;
    lookback_games: number;
}

interface ComparisonData {
    game_info: GameInfo;
    team_comparison: TeamComparison;
}

const StatDisplay: React.FC<{ label: string; value: number; icon?: React.ElementType }> = ({ label, value, icon }) => {


    return (
        <Flex justify="space-between" w="100%" align="center">
            <HStack spacing={2}>
                {icon && <Icon as={icon} color="gray.400" boxSize={4} />}
                <Text color="gray.100" fontSize="sm" lineHeight="1">{label}:</Text>
            </HStack>
            <Badge
                colorScheme={value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red'}
                variant="subtle"
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
            >
                {value}%
            </Badge>
        </Flex>
    );
};

const ComparisonPage: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const { data, isLoading, error } = useQuery<ComparisonData, Error>({
        queryKey: ['gameComparison', gameId],
        queryFn: async () => {
            if (!gameId) throw new Error("Game ID is required");
            const response = await axios.get<ComparisonData>(`${apiUrl}/comparison/${gameId}`);
            return response.data;
        },
        enabled: !!gameId,
        retry: 1,
    });

    const handlePlayerClick = (playerId: number) => {
        navigate(`/players`, { state: { selectedPlayerId: playerId } });
    };

    const handleTeamClick = (teamId: number) => {
        navigate(`/stats`, { state: { selectedTeamId: teamId } });
    };

    const renderLineup = (lineup: Player[] | null, pitcher: Pitcher) => (
        <VStack align="start" spacing={1.5} w="100%" p={2}>
            <Heading size="xs" color="gray.100" mb={1.5} display="flex" alignItems="center" w="100%">
                 <Icon as={MdPeople} mr={2} boxSize={4.5}/> Lineup
            </Heading>
            {lineup && lineup.length > 0 ? (
                <VStack align="start" spacing={1} pl={2} w="100%">
                    {lineup.map((player) => (
                        <Text
                            key={player.id}
                            fontSize="sm"
                            cursor="pointer"
                            _hover={{ color: THEME.colors.accent, textDecoration: 'underline' }}
                            onClick={() => handlePlayerClick(player.id)}
                            lineHeight="short"
                            color="whiteAlpha.900"
                        >
                            {player.name} <Text as="span" color="gray.400" fontSize="xs">({player.position})</Text>
                        </Text>
                    ))}
                </VStack>
            ) : (
                <HStack color="yellow.400" fontSize="sm" pl={2}>
                    <Icon as={MdOutlineErrorOutline} />
                    <Text>No lineup released yet.</Text>
                </HStack>
            )}
            <Divider my={3} borderColor="gray.500" />
             <Heading size="xs" color="gray.100" mb={1.5} display="flex" alignItems="center" w="100%">
                 <Icon as={MdSportsBaseball} mr={2} boxSize={4.5}/> Starting Pitcher
            </Heading>
            <Box pl={2}>
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    _hover={{ color: THEME.colors.accent, textDecoration: 'underline' }}
                    onClick={() => handlePlayerClick(pitcher.id)}
                    lineHeight="short"
                    color="whiteAlpha.900"
                >
                    {pitcher.name} <Text as="span" color="gray.400" fontSize="xs">({pitcher.hand})</Text>
                </Text>
                <Text fontSize="xs" color="gray.100">
                    {pitcher.season_era !== 'TBD' ? `${pitcher.season_era} ERA` : 'Season ERA TBD'}
                </Text>
            </Box>
        </VStack>
    );

    const renderComparisonStats = (stats: StatisticsData, lookback: number) => (
        <VStack align="stretch" spacing={3} w="100%" p={2}>
             <Heading size="xs" color="gray.100" mb={1.5} display="flex" alignItems="center">
                <Icon as={MdBarChart} mr={2} boxSize={4.5} /> Stats (Last {lookback} Games)
            </Heading>
            <StatDisplay label="Team NRFI %" value={stats.nrfi} icon={MdInfoOutline}/>
            <StatDisplay label="Game NRFI %" value={stats.game_nrfi_percentage} icon={MdInfoOutline}/>
            <StatDisplay label="F5 Win %" value={stats.win_percentage_f5} icon={MdTrendingUp}/>
            <StatDisplay label="F5 Over 1.5 Runs %" value={stats.over1_5F5} icon={MdTrendingUp}/>
            <StatDisplay label="F5 Over 2.5 Runs %" value={stats.over2_5F5} icon={MdTrendingUp}/>
        </VStack>
    );

    const gameDate = data?.game_info.game_datetime ? new Date(data.game_info.game_datetime) : null;
    const formattedDate = gameDate ? gameDate.toLocaleString() : 'TBD';

    return (
        <Box minHeight="100vh" bg={THEME.colors.background} color="white">
            <NavBar />
            <Container maxW="container.xl" pt={{ base: "5rem", md: "6rem" }} pb="4rem" flexGrow={1} px={{ base: 4, md: 6 }}>
                {isLoading && (
                    <Flex justify="center" align="center" height="50vh">
                        <Spinner size="xl" color={THEME.colors.accent} thickness="4px"/>
                    </Flex>
                )}
                {error && (
                    <Alert status="error" borderRadius="md" variant="subtle" bg="red.900" color="red.100" mt={4}>
                        <AlertIcon color="red.100"/>
                        Error fetching game comparison data: {error.message}
                    </Alert>
                )}
                {data && (
                    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                        <Card bg="gray.800" borderRadius="xl" shadow="xl" overflow="hidden">
                             <CardHeader py={3.5} px={{ base: 4, md: 6 }} bg="gray.700" borderBottom="2px solid" borderColor="gray.600">
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    wrap={{ base: "wrap", md: "nowrap" }}
                                    gap={{ base: 3, md: 4 }}
                                >
                                     <HStack 
                                        spacing={3} 
                                        flexShrink={0} 
                                        cursor="pointer" 
                                        onClick={() => handleTeamClick(data.game_info.away_team.id)}
                                        _hover={{ opacity: 0.8 }}
                                        transition="opacity 0.2s"
                                    >
                                        <TeamLogo teamId={data.game_info.away_team.id} size="50px" />
                                        <Heading size="md" fontFamily={THEME.fonts.heading} color="gray.100" noOfLines={1}>{getTeamAbbreviation(data.game_info.away_team.name)}</Heading>
                                    </HStack>
                                    <VStack spacing={0.5} textAlign="center" px={2} flexGrow={1} minWidth="150px">
                                         <Heading size="lg" color={THEME.colors.accent} fontWeight="bold">vs</Heading>
                                         <HStack spacing={1.5} fontSize={{ base: "xs", md: "sm" }} color="gray.100"> <Icon as={MdStadium}/> <Text>{data.game_info.venue}</Text> </HStack>
                                         <HStack spacing={1.5} fontSize={{ base: "xs", md: "sm" }} color="gray.100"> <Icon as={MdCalendarToday}/> <Text>{formattedDate}</Text> </HStack>
                                         <Badge
                                            colorScheme={data.game_info.status === "Live" ? "red" : "gray"}
                                            variant="solid"
                                            mt={1}
                                            fontSize="xs"
                                            px={2}
                                        >
                                             {data.game_info.status}
                                         </Badge>
                                    </VStack>
                                    <HStack 
                                        spacing={3} 
                                        justify="flex-end" 
                                        flexShrink={0} 
                                        cursor="pointer" 
                                        onClick={() => handleTeamClick(data.game_info.home_team.id)}
                                        _hover={{ opacity: 0.8 }}
                                        transition="opacity 0.2s"
                                    >
                                        <Heading size="md" fontFamily={THEME.fonts.heading} color="gray.100" noOfLines={1}>{getTeamAbbreviation(data.game_info.home_team.name)}</Heading>
                                        <TeamLogo teamId={data.game_info.home_team.id} size="50px" />
                                    </HStack>
                                </Flex>
                            </CardHeader>
                             <CardBody pt={5} pb={6} px={{ base: 4, md: 6 }} bg="gray.800">
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                                    <Card bg="gray.700" borderRadius="lg" shadow="md" overflow="hidden">
                                         <CardBody p={5}>
                                            <VStack spacing={4} align="stretch">
                                                 {renderLineup(data.game_info.away_team.lineup, data.game_info.away_pitcher)}
                                                 <Divider borderColor="gray.600" />
                                                 {renderComparisonStats(data.team_comparison.away, data.team_comparison.lookback_games)}
                                            </VStack>
                                        </CardBody>
                                    </Card>

                                     <Card bg="gray.700" borderRadius="lg" shadow="md" overflow="hidden">
                                         <CardBody p={5}>
                                            <VStack spacing={4} align="stretch">
                                                 {renderLineup(data.game_info.home_team.lineup, data.game_info.home_pitcher)}
                                                 <Divider borderColor="gray.600" />
                                                 {renderComparisonStats(data.team_comparison.home, data.team_comparison.lookback_games)}
                                             </VStack>
                                        </CardBody>
                                    </Card>
                                </SimpleGrid>
                            </CardBody>
                        </Card>
                    </VStack>
                )}
            </Container>
            <FooterComponent />
        </Box>
    );
};

export default ComparisonPage; 