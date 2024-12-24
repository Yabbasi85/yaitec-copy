import React from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react";

interface Campaign {
  id: string;
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
}

interface CampaignFormProps {
  campaignName: string;
  setCampaignName: React.Dispatch<React.SetStateAction<string>>;
  budget: string;
  setBudget: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  errors: { [key: string]: string };
  handleCreateOrUpdateCampaign: () => void;
  isLoading: boolean;
  editingCampaign: Campaign | null;
  resetForm: () => void;
}

// Define the brand colors
const brandColors = {
  darkBlue: "#082a46",
  purple: "#5541ff",
  electricGreen: "#00ff89",
  white: "#FFFFFF",
};

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignName,
  setCampaignName,
  budget,
  setBudget,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  errors,
  handleCreateOrUpdateCampaign,
  isLoading,
  editingCampaign,
  resetForm,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      flex={1}
      border="1px solid"
      borderColor={brandColors.purple}
      p={4}
      borderRadius="8px"
    >
      <Heading size="lg" mb={4} color={brandColors.darkBlue}>
        {editingCampaign ? "Edit Campaign" : "Create a New Campaign"}
      </Heading>
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Campaign Name</FormLabel>
          <Input
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.budget}>
          <FormLabel>Budget</FormLabel>
          <Input
            type="number"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <FormErrorMessage>{errors.budget}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.startDate}>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
          />
          <FormErrorMessage>{errors.startDate}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.endDate}>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={today}
          />
          <FormErrorMessage>{errors.endDate}</FormErrorMessage>
        </FormControl>
        <Button
          w="100%"
          onClick={handleCreateOrUpdateCampaign}
          isLoading={isLoading}
        >
          {editingCampaign ? "Update Campaign" : "Create Campaign"}
        </Button>
        {editingCampaign && (
          <Button
            w="100%"
            variant="outline"
            onClick={resetForm}
          >
            Cancel Edit
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default CampaignForm;
