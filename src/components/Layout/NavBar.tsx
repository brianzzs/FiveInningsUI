import React from 'react';
import { Flex, Heading, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ROUTES, THEME } from '../../constants';

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
    >
        <Heading
            as="h1"
            size="lg"
            color="white"
            fontFamily={THEME.fonts.heading}
            fontWeight="700"
        >
            <ChakraLink
                as={Link}
                to={ROUTES.HOME}
                _hover={{textDecoration: 'none', color: THEME.colors.primary}}
            >Five Innings
            </ChakraLink>
        </Heading>
        <ChakraLink
            as={Link}
            to={ROUTES.STATISTICS}
            color="white"
            fontSize="lg"
            fontFamily={THEME.fonts.body}
            _hover={{ textDecoration: 'none', color: THEME.colors.primary }}
        >
            Statistics
        </ChakraLink>
    </Flex>
);