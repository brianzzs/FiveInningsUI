import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

interface SectionCardProps extends BoxProps {
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, ...rest }) => {
  return (
    <Box
      bg="panelBg"
      borderWidth="1px"
      borderColor="borderSubtle"
      borderRadius="panel"
      boxShadow="panel"
      p={{ base: 5, md: 6 }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        h: "3px",
        bgGradient: "linear(to-r, baseball.red, baseball.clay)",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default SectionCard;
