import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Select,
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
} from '@chakra-ui/react';
import axios from 'axios';
import DashboardHeader from './components/DashboardHeader';
import CompetitorSummary from './components/CompetitorSummary';
import CompetitorComparison from './components/CompetitorComparison';
import BrandVoiceInsights from './components/BrandVoice';

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

// Define the brand colors
const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: '#00ff89', 
  white: '#FFFFFF',
  lightGray: '#F7F7F8', 
};

const DashboardAnalyticsPage: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/competitors`);
      setCompetitors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching competitors:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch competitor data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleCompetitorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const competitor = competitors.find((c) => c.id === selectedId) || null;
    setSelectedCompetitor(competitor);
  };

  return (
    <Box p={8} bg={brandColors.lightGray} minH="100vh">
      <DashboardHeader />
      <VStack spacing={8} align="stretch">
        <SimpleGrid columns={[1, 2, 4]} spacing={6}>
          {[
            'Total Competitors',
            'Average Tone Count',
            'Unique Social Media',
            'Analysis Completion',
          ].map((title, index) => (
            <Box
              key={index}
              border="1px solid"
              borderColor={brandColors.purple}
              p={6}
              borderRadius="12px"
              bg={brandColors.white}
              boxShadow="lg"
            >
              <Stat>
                <StatLabel>{title}</StatLabel>
                <StatNumber>
                  {index === 0 && competitors.length}
                  {index === 2 && new Set(competitors.map((c) => c.social_media)).size}
                  {index === 3 && '100%'}
                </StatNumber>
                <StatHelpText>
                  {index === 0 && 'Analyzed in this report'}
                  {index === 2 && 'Platforms used'}
                  {index === 3 && (
                    <Progress
                      value={100}
                      size="sm"
                      colorScheme="green"
                      mt={2}
                      bg={brandColors.lightGray}
                    />
                  )}
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          border="1px solid"
          borderColor={brandColors.purple}
          p={6}
          borderRadius="12px"
          bg={brandColors.white}
          boxShadow="lg"
        >
          <Heading size="md" mb={4}>
            Select Competitor for Detailed Analysis
          </Heading>
          <Select placeholder="Choose a competitor" onChange={handleCompetitorChange}>
            {competitors.map((competitor) => (
              <option key={competitor.id} value={competitor.id}>
                {competitor.name}
              </option>
            ))}
          </Select>
        </Box>

        {selectedCompetitor && <CompetitorSummary competitor={selectedCompetitor} />}

        <BrandVoiceInsights competitors={competitors} />

        <CompetitorComparison competitors={competitors} />

        {!selectedCompetitor && !loading && (
          <Text>Please select a competitor to view detailed analysis.</Text>
        )}
        {loading && <Text>Loading competitor data...</Text>}
      </VStack>
    </Box>
  );
};

export default DashboardAnalyticsPage;
