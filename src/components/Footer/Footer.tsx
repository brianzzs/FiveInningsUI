import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";

interface FooterComponentProps {
  isLoading: boolean;
}

const FooterComponent: React.FC<FooterComponentProps> = ({ isLoading }) => {
  if (isLoading) {
    return null;
  }

  return (
    <Box
      as="footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.800"
      color="gray.300"
      position="fixed"
      bottom={0}
      width="100%"
      height="60px"
      boxShadow="0px -2px 5px rgba(0, 0, 0, 0.2)"
      fontSize="sm"
      borderTop="1px solid"
      borderColor="gray.700"
    >
      <Text textAlign="center">
        <Text as="span" fontWeight="bold" color="teal.400">
          Five Innings Friend
        </Text>{" "}
        - © {new Date().getFullYear()} All Rights Reserved | Made by{" "}
        <Link
          href="https://www.linkedin.com/in/brian-zanoni"
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
