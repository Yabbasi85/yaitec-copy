import { Box, Grid, Image, Text, Badge, Heading } from '@chakra-ui/react';
import { COLORS } from './constants';


type MockupTypeKey = 'logo' | 'website' | 'mobile-app' | 'business-card' | 'social-media';

interface ConsistencyCheck {
  criteria: string;
  status: 'Needs Adjustment' | 'Consistent';
  recommendation: string; 
}
interface Mockup {
  id: number;
  type: MockupTypeKey;
  imageUrl: string;
  consistencyReport: ConsistencyCheck[]; 
}

interface MockupGalleryProps {
  mockups: Mockup[];
  handleMockupClick: (mockup: Mockup) => void;
}

const MockupGallery: React.FC<MockupGalleryProps> = ({ mockups, handleMockupClick }) => (
  <Box>
    <Heading as="h2" size="lg" color={COLORS.purple} fontFamily="Cropar, sans-serif" mb={4}>
      Generated Designs
    </Heading>
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
      {mockups.map((mockup) => (
        <Box
          key={mockup.id}
          bg={COLORS.white}
          borderRadius="lg"
          overflow="hidden"
          cursor="pointer"
          onClick={() => handleMockupClick(mockup)}
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          boxShadow="md"
        >
          <Image src={mockup.imageUrl} alt={`${mockup.type} design`} />
          <Box p={4}>
            <Text fontWeight="bold" mb={2} fontFamily="Futura PT, sans-serif">
              {mockup.type.replace('-', ' ')}
            </Text>
            <Badge
              colorScheme={mockup.consistencyReport.some((item) => item.status === 'Needs Adjustment')
                ? 'yellow'
                : 'green'}
            >
              {mockup.consistencyReport.some((item) => item.status === 'Needs Adjustment') ? 'Needs Review' : 'Consistent'}
            </Badge>
          </Box>
        </Box>
      ))}
    </Grid>
  </Box>
);

export default MockupGallery;
