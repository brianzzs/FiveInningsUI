import React from 'react';
import { Flex, Heading, Link as ChakraLink, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ROUTES, THEME } from '../../constants';
import { Icon } from '@chakra-ui/react';
import { FaBaseballBall } from 'react-icons/fa';

export const NavBar: React.FC = () => (
    <Flex
        as="nav"
        justify="space-between"
        align="center"
        p="1rem 2rem"
        bg={THEME.colors.navBackground}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        borderBottom="1px solid"
        borderColor="gray.700"
        boxShadow="0 2px 10px rgba(0,0,0,0.3)"
    >
        <Heading
            as="h1"
            size="lg"
            color="white"
            fontFamily={THEME.fonts.heading}
            fontWeight="800"
        >
            <ChakraLink
                as={Link}
                to={ROUTES.HOME}
                _hover={{
                    textDecoration: 'none',
                    color: THEME.colors.accent
                }}
                display="flex"
                alignItems="center"
            >
                <Icon as={FaBaseballBall} mr={2} color={THEME.colors.accent} />
                Five Innings
            </ChakraLink>
        </Heading>
        <HStack spacing={6}>
            <ChakraLink
                as={Link}
                to={ROUTES.STATISTICS}
                color="white"
                fontSize="lg"
                fontFamily={THEME.fonts.body}
                fontWeight="500"
                _hover={{ 
                    textDecoration: 'none', 
                    color: THEME.colors.accent
                }}
                transition="all 0.2s"
            >
                Teams
            </ChakraLink>
            <ChakraLink
                as={Link}
                to={ROUTES.PLAYERS}
                color="white"
                fontSize="lg"
                fontFamily={THEME.fonts.body}
                fontWeight="500"
                _hover={{ 
                    textDecoration: 'none', 
                    color: THEME.colors.accent
                }}
                transition="all 0.2s"
            >
                Players
            </ChakraLink>
        </HStack>
    </Flex>
);