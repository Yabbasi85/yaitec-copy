import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface CompetitorComparisonProps {
  competitors: Competitor[];
}

const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ competitors }) => {
  // Extrai dados para o gráfico comparativo de produtos e serviços
  const comparisonData = competitors.map((competitor) => ({
    name: competitor.name,
    totalProducts: competitor.competitors.reduce((count, comp) => count + comp.products.length, 0),
    totalServices: competitor.competitors.reduce((count, comp) => count + comp.services.length, 0),
  }));

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
        Competitor Product & Service Comparison
      </Heading>
      <Box height="400px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalProducts" fill={brandColors.purple} name="Total Products" />
            <Bar dataKey="totalServices" fill={brandColors.electricGreen} name="Total Services" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CompetitorComparison;
