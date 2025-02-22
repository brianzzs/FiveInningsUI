import React from "react";
import { Box, Link, Text } from "@chakra-ui/react";
import { THEME } from '../../../constants';

const FooterComponent: React.FC = () => {
  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      width="100%"
      bg={THEME.colors.navBackground}
      color="white"
      p={4}
      textAlign="center"
      borderTop="1px solid"
      borderColor="gray.700"
    >
      <Text textAlign="center">
        <Text as="span" fontWeight="bold" color="teal.400">
          Five Innings
        </Text>{" "}
        - © {new Date().getFullYear()} All Rights Reserved | Made by{" "}
        <Link
          href="https://www.linkedin.com/in/brianzan/"
          isExternal
          color="teal.400"
          fontWeight="bold"
        >
          Brian Zanoni
        </Link>
      </Text>
    </Box>
  );
};

export default FooterComponent;
