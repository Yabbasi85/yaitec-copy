import { useState } from 'react';
import { Box, Container, VStack, useToast, useDisclosure } from '@chakra-ui/react';
import { COLORS, generateBrandConsistencyReport } from './components/constants';
import Header from './components/Header';
import MockupGenerator from './components/MockupGenerator';
import MockupGallery from './components/MockupGallery';
import MockupAnalysisModal from './components/ConsistencyAnalysisModal';

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

const DesignAiDashboard = () => {
  const [mockupType, setMockupType] = useState<MockupTypeKey | ''>(''); 
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleGenerateMockup = async () => {
    if (!mockupType) {
      toast({
        title: "Error",
        description: "Please select a mockup type",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    const newMockup: Mockup = {
      id: Date.now(),
      type: mockupType,
      imageUrl: `https://via.placeholder.com/800x600.png?text=${mockupType.replace('-', ' ')} Mockup`,
      consistencyReport: generateBrandConsistencyReport(mockupType).map((report) => ({
        ...report,
        recommendation: "Suggested action to improve consistency", 
      })),
    };
  
    setMockups((prevMockups) => [...prevMockups, newMockup]);
    setIsGenerating(false);
  
    toast({
      title: "Mockup Generated",
      description: `Your ${mockupType.replace('-', ' ')} mockup has been created and analyzed for brand consistency.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleMockupClick = (mockup: Mockup) => {
    setSelectedMockup(mockup);
    onOpen();
  };

  return (
    <Box bg={COLORS.white} minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Header />
          <MockupGenerator
            mockupType={mockupType}
            setMockupType={setMockupType}
            handleGenerateMockup={handleGenerateMockup}
            isGenerating={isGenerating}
          />
          {mockups.length > 0 && (
            <MockupGallery mockups={mockups} handleMockupClick={handleMockupClick} />
          )}
        </VStack>
      </Container>

      <MockupAnalysisModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMockup={selectedMockup}
      />
    </Box>
  );
};

export default DesignAiDashboard;
