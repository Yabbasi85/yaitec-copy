import React from 'react';
import { Box, VStack, Heading, Text, SimpleGrid, Badge } from '@chakra-ui/react';

// Define the brand colors
const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: '#00ff89',
  white: '#FFFFFF',
};

interface Competitor {
  id: string;
  name: string;
  website: string;
  social_media: string;
  competitors: {
    name: string;
    description: string;
    url: string;
    products: string[];
    services: string[];
    about: string;
    vision: string;
    history: string;
  }[];
  competitors_website_data: {
    url: string;
    content: string;
  }[];
}

interface CompetitorSummaryProps {
  competitor: Competitor;
}

const CompetitorSummary: React.FC<CompetitorSummaryProps> = ({ competitor }) => {
  return (
    <Box
      border="1px solid"
      borderColor={brandColors.purple}
      p={6}
      borderRadius="12px"
      bg={brandColors.white}
      boxShadow="lg"
      mb={8}
    >
      <Heading size="md" mb={4} color={brandColors.darkBlue}>
        {competitor.name} Summary
      </Heading>
      <SimpleGrid columns={[1, 2]} spacing={6}>
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontWeight="bold">Website:</Text>
            <Text
              as="a"
              href={competitor.website}
              color={brandColors.purple}
              target="_blank"
              rel="noopener noreferrer"
            >
              {competitor.website}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Social Media:</Text>
            <Text>{competitor.social_media}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Competitors:</Text>
            <Box mt={2}>
              {competitor.competitors.map((comp, index) => (
                <Badge
                  key={index}
                  bg={brandColors.purple}
                  color={brandColors.white}
                  mr={2}
                  mb={2}
                >
                  {comp.name}
                </Badge>
              ))}
            </Box>
          </Box>
        </VStack>

        <VStack align="start" spacing={4}>
          <Box>
            <Text fontWeight="bold">Products & Services:</Text>
            <Text fontSize="sm">
              {competitor.competitors
                .flatMap((comp) => comp.products.concat(comp.services))
                .join(', ')}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Website Data:</Text>
            {competitor.competitors_website_data.map((data, index) => (
              <Box key={index} mt={2}>
                <Text as="a" href={data.url} color={brandColors.electricGreen} target="_blank">
                  {data.url}
                </Text>
                <Text fontSize="sm" mt={1}>{data.content}</Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default CompetitorSummary;
