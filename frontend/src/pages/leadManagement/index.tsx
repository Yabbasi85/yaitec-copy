import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
  Flex,
  Spacer,
  Select,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import { Lead } from "./components/types";
import LeadList from "./components/LeadList";
import LeadForm from "./components/LeadForm";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

const LeadManagementPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Lead[]>(`${apiUrl}/leads`);
        setLeads(response.data);
        filterLeads(response.data, temperatureFilter);
      } catch (error) {
        toast({
          title: "Error fetching leads",
          description: "Failed to load leads from server.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filterLeads = (leadsToFilter: Lead[], filter: string) => {
    if (filter === "all") {
      setFilteredLeads(leadsToFilter); 
    } else {
      setFilteredLeads(
        leadsToFilter.filter((lead) => lead.temperature.toLowerCase() === filter.toLowerCase())
      ); 
    }
  };  

  useEffect(() => {
    filterLeads(leads, temperatureFilter);
  }, [temperatureFilter, leads]);

  const handleCreateOrUpdateLead = async (lead: Lead) => {
    setIsLoading(true);
    try {
      const url = editingLead ? `${apiUrl}/leads/${editingLead.id}` : `${apiUrl}/leads`;
      const method = editingLead ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: lead,
      });

      const result = await response.data;
      setLeads((prevLeads) =>
        editingLead
          ? prevLeads.map((lead) => (lead.id === result.id ? result : lead))
          : [...prevLeads, result]
      );

      toast({
        title: editingLead ? "Lead Updated" : "Lead Created",
        description: `The lead has been successfully ${editingLead ? "updated" : "created"}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditingLead(null);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the lead.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const lead = leads.find((lead) => lead.id === id);
    if (lead) {
      setLeadToDelete(lead);
      onDeleteOpen();
    }
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsLoading(true);
    try {
      await axios.delete(`${apiUrl}/leads/${leadToDelete.id}`);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadToDelete.id));
      toast({
        title: "Lead Deleted.",
        description: `${leadToDelete.name} has been successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
    } catch (error) {
      toast({
        title: "Error deleting lead",
        description: "An error occurred while deleting the lead.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    onOpen();
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Flex align="center" direction={{ base: "column", md: "row" }} w="full">
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading size="2xl" color="#5541ff">
              Lead Management System
            </Heading>
            <Text fontSize="lg" mt={2}>
              Manage your leads and track their qualification scores
            </Text>
          </Box>
          <Spacer />
          <Button
            mt={{ base: 4, md: 0 }}
            size="lg"
            onClick={() => {
              setEditingLead(null);
              onOpen();
            }}
          >
            Add New Lead
          </Button>
        </Flex>

        <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
          <Text fontSize="lg" fontWeight="bold" mb={{ base: 2, md: 0 }}>
            Filter by Temperature:
          </Text>
          <Select
            value={temperatureFilter}
            onChange={(e) => setTemperatureFilter(e.target.value)}
            width={{ base: "full", md: "200px" }}
          >
            <option value="all">All</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </Select>
        </Flex>
        <LeadList leads={filteredLeads} onEdit={handleEdit} onDelete={handleDelete}/>
      </VStack>

      {/* Modal for adding or editing leads */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingLead ? "Edit Lead" : "Add New Lead"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LeadForm
              lead={editingLead}
              onSubmit={handleCreateOrUpdateLead}
              isLoading={isLoading}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Confirmation modal for deleting lead */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leadToDelete={leadToDelete}
        confirmDeleteLead={confirmDeleteLead}
      />
    </Box>
  );
};

export default LeadManagementPage;

