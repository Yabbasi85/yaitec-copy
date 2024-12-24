import React from 'react';
import { VStack, Heading, Text } from '@chakra-ui/react';

// Define the brand colors
const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: '#00ff89', 
  white: '#FFFFFF',
};

const DashboardHeader: React.FC = () => {
  // Use brandColors instead of useColorModeValue
  const textColor = brandColors.darkBlue;

  return (
    <VStack spacing={4} align="center" textAlign="center" mb={8}>
      <Heading size="2xl" color={brandColors.purple}>
        Competitor Analysis Dashboard
      </Heading>
      <Text fontSize="lg" color={textColor}>
        Analyze competitor data and brand voice trends.
      </Text>
    </VStack>
  );
};

export default DashboardHeader;
