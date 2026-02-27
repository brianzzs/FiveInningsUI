import React from "react";
import { Box, Link, Text } from "@chakra-ui/react";

const FooterComponent: React.FC = () => {
  return (
    <Box
      as="footer"
      bg="footerBg"
      color="textSecondary"
      borderTopWidth="1px"
      borderColor="borderSubtle"
      px={4}
      py={5}
      textAlign="center"
    >
      <Text fontSize="sm">
        <Text as="span" fontWeight="700" color="accent.500" letterSpacing="0.02em">
          Five Innings
        </Text>{" "}
        © {new Date().getFullYear()} | Built by{" "}
        <Link
          href="https://www.linkedin.com/in/brianzan/"
          isExternal
          color="brand.500"
          fontWeight="700"
          _hover={{ color: "accent.500" }}
        >
          Brian Zanoni
        </Link>
      </Text>
    </Box>
  );
};

export default FooterComponent;
