import React from "react";
import { Box, Heading, Text, VStack, type StackProps } from "@chakra-ui/react";

interface PageTitleProps extends StackProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, eyebrow = "Dashboard", ...rest }) => {
  return (
    <VStack align="start" spacing={3} {...rest}>
      <Text
        fontSize="11px"
        color="textMuted"
        fontWeight={700}
        textTransform="uppercase"
        letterSpacing="0.14em"
        px={2.5}
        py={1}
        borderRadius="full"
        bg="panelMuted"
      >
        {eyebrow}
      </Text>
      <Box>
        <Heading
          as="h1"
          size="2xl"
          textTransform="uppercase"
          letterSpacing="0.04em"
          lineHeight="0.95"
        >
          {title}
        </Heading>
        <Box mt={2} h="3px" w="100px" borderRadius="full" bgGradient="linear(to-r, baseball.red, baseball.clay)" />
      </Box>
      {subtitle ? (
        <Text color="textSecondary" fontSize={{ base: "sm", md: "md" }} maxW="900px">
          {subtitle}
        </Text>
      ) : null}
    </VStack>
  );
};

export default PageTitle;
