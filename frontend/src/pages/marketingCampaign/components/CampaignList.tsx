import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  IconButton,
  Tooltip,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

interface Campaign {
  id: string;
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
  content_plan: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  isProcessing: boolean;
  handleEditCampaign: (campaign: Campaign) => void;
  handleDeleteCampaign: (campaign: Campaign) => void;
}

// Define the brand colors
const brandColors = {
  darkBlue: "#082a46",
  purple: "#5541ff",
  electricGreen: "#00ff89",
  white: "#FFFFFF",
  lightGray: "#F7F7F8",
};

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  isProcessing,
  handleEditCampaign,
  handleDeleteCampaign,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstItem, indexOfLastItem);

  const formatContentPlan = (contentPlan: string) => {
    return contentPlan.split("\n").map((line, index) => {
      if (line.includes(":")) {
        const [label, value] = line.split(":");
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2}>
            <strong>{label.trim()}:</strong> {value.trim()}
          </Text>
        );
      } else {
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2}>
            {line.trim()}
          </Text>
        );
      }
    });
  };

  const handleViewContentPlan = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    onOpen();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Box
      flex={1}
      border="1px solid"
      borderColor={brandColors.purple}
      p={6}
      borderRadius="12px"
      bg={brandColors.white}
      boxShadow="lg"
    >
      <Heading size="lg" mb={6} color={brandColors.darkBlue}>
        Active Campaigns
      </Heading>
      {isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner
            size="xl"
            color={brandColors.darkBlue}
            thickness="4px"
            speed="0.65s"
          />
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {currentCampaigns.length === 0 ? (
            <Text fontSize="lg" color="gray.500" textAlign="center">
              No active campaigns.
            </Text>
          ) : (
            currentCampaigns.map((campaign) => (
              <Box
                key={campaign.id}
                p={6}
                borderWidth={1}
                borderRadius="md"
                boxShadow="sm"
                bg={brandColors.lightGray}
              >
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <HStack spacing={4} align="center">
                      <Text fontWeight="bold" fontSize="lg">
                        Campaign:
                      </Text>
                      <Text fontSize="lg">{campaign.name}</Text>
                    </HStack>
                    <HStack spacing={4} align="center">
                      <Text fontWeight="bold" fontSize="lg">
                        Budget:
                      </Text>
                      <Text>${campaign.budget.toLocaleString()}</Text>
                    </HStack>
                    <HStack spacing={4} align="center">
                      <Text fontWeight="bold" fontSize="lg">
                        Duration:
                      </Text>
                      <Text>
                        {campaign.startDate} - {campaign.endDate}
                      </Text>
                    </HStack>
                  </Box>

                  {!isProcessing && (
                    <HStack justifyContent="flex-end">
                      <Tooltip
                        label="View Content Plan"
                        aria-label="View Content Plan tooltip"
                      >
                        <IconButton
                          aria-label="View content plan"
                          icon={<FaEye />}
                          bg={brandColors.purple}
                          color={brandColors.white}
                          _hover={{ bg: brandColors.electricGreen }}
                          size="sm"
                          onClick={() => handleViewContentPlan(campaign)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Edit Campaign"
                        aria-label="Edit Campaign tooltip"
                      >
                        <IconButton
                          aria-label="Edit campaign"
                          icon={<FaEdit />}
                          bg={brandColors.purple}
                          color={brandColors.white}
                          _hover={{ bg: brandColors.electricGreen }}
                          size="sm"
                          onClick={() => handleEditCampaign(campaign)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Delete Campaign"
                        aria-label="Delete Campaign tooltip"
                      >
                        <IconButton
                          aria-label="Delete campaign"
                          icon={<FaTrash />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign)}
                        />
                      </Tooltip>
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))
          )}
          {/* Pagination controls - always visible */}
          <Flex justify="center" mt={6}>
            <Button
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1 || isProcessing}
              mr={2}
            >
              Previous
            </Button>
            <Text alignSelf="center" mx={2}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              onClick={handleNextPage}
              isDisabled={currentPage === totalPages || isProcessing}
              ml={2}
            >
              Next
            </Button>
          </Flex>
        </VStack>
      )}

      {/* Modal for Content Plan */}
      {selectedCampaign && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Content Plan for {selectedCampaign.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" mb={2}>
                Content Plan Details:
              </Text>
              <Box>{formatContentPlan(selectedCampaign.content_plan)}</Box>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default CampaignList;
