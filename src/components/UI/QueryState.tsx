import React from "react";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface QueryStateProps {
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string | null;
  hasData?: boolean;
  loadingText?: string;
}

const QueryState: React.FC<QueryStateProps> = ({
  isLoading,
  errorMessage,
  emptyMessage,
  hasData,
  loadingText = "Loading data...",
}) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <VStack spacing={3}>
          <Spinner size="lg" color="accent.500" thickness="4px" />
          <Text color="textSecondary">{loadingText}</Text>
        </VStack>
      </Center>
    );
  }

  if (errorMessage) {
    return (
      <Alert status="error" borderRadius="xl" bg="red.600" color="white">
        <AlertIcon color="white" />
        <VStack align="start" spacing={0}>
          <AlertTitle fontSize="sm">Failed to load</AlertTitle>
          <AlertDescription fontSize="sm">{errorMessage}</AlertDescription>
        </VStack>
      </Alert>
    );
  }

  if (!hasData && emptyMessage) {
    return (
      <Center py={10}>
        <Text color="textSecondary">{emptyMessage}</Text>
      </Center>
    );
  }

  return null;
};

export default QueryState;
