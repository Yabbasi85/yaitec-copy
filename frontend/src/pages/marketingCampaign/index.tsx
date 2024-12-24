import { useEffect, useState } from "react";
import { Box, Heading, Flex, useToast, useDisclosure } from "@chakra-ui/react";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CampaignForm from "./components/CampaignForm";
import CampaignList from "./components/CampaignList";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import axios from "axios";

interface Campaign {
  id: string;
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
  content_plan: string;
}

// Define the brand colors
const brandColors = {
  darkBlue: "#082a46",
  purple: "#5541ff",
  electricGreen: "#00ff89",
  white: "#FFFFFF",
};

const MarketingCampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignName, setCampaignName] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const apiUrl = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!campaignName.trim()) newErrors.name = "Campaign name is required";
    if (!budget) newErrors.budget = "Budget is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        newErrors.startDate = "Start date cannot be later than the end date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Campaign[]>(`${apiUrl}/campaigns/`);
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateOrUpdateCampaign = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const campaignData = {
      name: campaignName,
      budget: parseFloat(budget),
      startDate,
      endDate,
    };

    try {
      const url = editingCampaign
        ? `${apiUrl}/campaigns/${editingCampaign.id}`
        : `${apiUrl}/campaigns/`;

      const method = editingCampaign ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: campaignData,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        setCampaigns((prev) =>
          editingCampaign
            ? prev.map((campaign) => (campaign.id === result.id ? result : campaign))
            : [...prev, result]
        );
        toast({
          title: editingCampaign ? "Campaign Updated" : "Campaign Created",
          description: `The campaign has been successfully ${
            editingCampaign ? "updated" : "created"
          }.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
      } else {
        throw new Error("Failed to save campaign");
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the campaign.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCampaignName("");
    setBudget("");
    setStartDate("");
    setEndDate("");
    setErrors({});
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    onOpen();
  };

  const confirmDeleteCampaign = async () => {
    if (campaignToDelete && campaignToDelete.id) {
      try {
        const response = await axios.delete(`${apiUrl}/campaigns/${campaignToDelete.id}`);

        if (response.status === 200) {
          setCampaigns((prevCampaigns) =>
            prevCampaigns.filter((campaign) => campaign.id !== campaignToDelete.id)
          );
          toast({
            title: "Campaign Deleted",
            description: `${campaignToDelete.name} has been successfully deleted.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setCampaignToDelete(null);
          onClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to delete campaign.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting campaign:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the campaign.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "No campaign selected for deletion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignName(campaign.name);
    setBudget(campaign.budget.toString());
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
  };

  return (
    <Box p={4}>
      <Heading size="xl" mb={6} color={brandColors.purple}>
        Marketing Campaign Dashboard
      </Heading>

      <AnalyticsDashboard />

      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        <CampaignForm
          campaignName={campaignName}
          setCampaignName={setCampaignName}
          budget={budget}
          setBudget={setBudget}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          errors={errors}
          handleCreateOrUpdateCampaign={handleCreateOrUpdateCampaign}
          isLoading={isLoading}
          editingCampaign={editingCampaign}
          resetForm={resetForm}
        />
        <CampaignList
          campaigns={campaigns}
          isLoading={isLoading}
          handleEditCampaign={handleEditCampaign}
          handleDeleteCampaign={handleDeleteCampaign}
          isProcessing={false}
        />
      </Flex>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        campaignToDelete={campaignToDelete}
        confirmDeleteCampaign={confirmDeleteCampaign}
      />
    </Box>
  );
};

export default MarketingCampaignDashboard;
