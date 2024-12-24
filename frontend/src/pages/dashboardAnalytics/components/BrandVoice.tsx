import React from 'react';
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Define the brand colors
const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: ' #00ff89', 
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

interface BrandVoiceInsightsProps {
  competitors: Competitor[];
}

const COLORS = [
  brandColors.purple,
  brandColors.electricGreen,
  brandColors.darkBlue,
  '#FFBB28', 
  '#FF8042',
  '#82CA9D',
];

const BrandVoiceInsights: React.FC<BrandVoiceInsightsProps> = ({ competitors }) => {
  // Função para extrair itens com base no título da seção dentro de competitors_website_data
  const extractSectionItems = (competitor: Competitor, sectionTitle: string): string[] => {
    return competitor.competitors_website_data
      .flatMap((data) =>
        data.content
          .split('\n')
          .filter((line) => line.startsWith(`- ${sectionTitle}`))
          .map((item) => item.replace(`- ${sectionTitle}: `, ''))
      );
  };

  // Função para contar os tipos de tons (ou outra categoria específica) nos dados dos websites
  const getAllUniqueTones = (): { name: string; value: number }[] => {
    const toneCount: { [key: string]: number } = {};
    competitors.forEach((competitor) => {
      const tones = extractSectionItems(competitor, 'Tone');
      tones.forEach((tone) => {
        toneCount[tone] = (toneCount[tone] || 0) + 1;
      });
    });
    return Object.entries(toneCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Função para obter o público-alvo mais comum
  const getMostCommonTargetAudience = (): string[] => {
    const audienceCount: { [key: string]: number } = {};
    competitors.forEach((competitor) => {
      const audience = extractSectionItems(competitor, 'Target Audience');
      audience.forEach((item) => {
        audienceCount[item] = (audienceCount[item] || 0) + 1;
      });
    });
    return Object.entries(audienceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([audience]) => audience);
  };

  // Função para obter as Proposições Únicas de Venda (USPs)
  const getUniqueSellingPropositions = (): string[] => {
    return competitors
      .flatMap((competitor) => extractSectionItems(competitor, 'Unique Selling Proposition'))
      .filter((usp) => usp !== '');
  };

  const topTones = getAllUniqueTones();
  const commonAudience = getMostCommonTargetAudience();
  const uniqueSellingPropositions = getUniqueSellingPropositions();

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
      <Heading size="md" mb={6} color={brandColors.darkBlue}>
        Brand Voice Insights
      </Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={8}>
        <Box>
          <Heading size="sm" mb={4} color={brandColors.darkBlue}>
            Top 5 Tones Across Competitors
          </Heading>
          <Box height="200px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topTones}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={brandColors.purple}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topTones.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Box
                          bg={brandColors.white}
                          p={2}
                          borderRadius="md"
                          boxShadow="md"
                        >
                          <Text fontWeight="bold">{data.name}</Text>
                          <Text>Count: {data.value}</Text>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <VStack align="start" spacing={4}>
          <Box>
            <Heading size="sm" mb={2} color={brandColors.darkBlue}>
              Most Common Target Audience
            </Heading>
            <Text>{commonAudience.join(', ')}</Text>
          </Box>
          <Box>
            <Heading size="sm" mb={2} color={brandColors.darkBlue}>
              Unique Selling Propositions
            </Heading>
            {uniqueSellingPropositions.map((usp, index) => (
              <Text key={index} fontSize="sm" mb={2}>
                • {usp}
              </Text>
            ))}
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default BrandVoiceInsights;
