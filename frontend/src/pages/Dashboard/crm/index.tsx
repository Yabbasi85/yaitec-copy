import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Heading,
  Card,
  CardBody,
  HStack,
  Text,
  IconButton,
  Badge,
  useToast,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";

interface CRM {
  id?: string;
  full_name: string;
  email: string;
  website: string;
  phone: string;
  instagram: string;
  facebook: string;
  additional_info: string;
  type: "lead" | "customer";
}

const CRMSection: React.FC = () => {
  const [formData, setFormData] = useState<CRM>({
    full_name: "",
    email: "",
    website: "",
    phone: "",
    instagram: "",
    facebook: "",
    additional_info: "",
    type: "lead",
  });

  const [crms, setCRMs] = useState<CRM[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const toast = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch all CRMs when the component mounts
    const fetchCRMs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/crms`);
        const data = response.data;
        if (Array.isArray(data)) {
          setCRMs(data);
        } else {
          setCRMs([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error fetching CRMs",
            description: error.message,
            status: "error",
            duration: 2000,
          });
        }
      }
    };
    fetchCRMs();
  }, []);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Update CRM
      try {
        const updatedCRM = { ...formData };
        await axios.put(`${API_BASE_URL}/crms/${formData.id}`, updatedCRM);
        setCRMs((prev) =>
          prev.map((crm) => (crm.id === formData.id ? updatedCRM : crm))
        );
        setEditingIndex(null);
        toast({
          title: "CRM Updated",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error updating CRM",
            description: error.message,
            status: "error",
            duration: 2000,
          });
        }
      }
    } else {
      // Create CRM
      try {
        const response = await axios.post(`${API_BASE_URL}/crms`, formData);
        setCRMs((prev) => [...prev, response.data]);
        toast({
          title: "CRM Added",
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error adding CRM",
            description: error.message,
            status: "error",
            duration: 2000,
          });
        }
      }
    }
    setFormData({
      full_name: "",
      email: "",
      website: "",
      phone: "",
      instagram: "",
      facebook: "",
      additional_info: "",
      type: "lead",
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(crms[index]);
  };

  const handleDelete = async (crmId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/crms/${crmId}`);
      setCRMs((prev) => prev.filter((crm) => crm.id !== crmId));
      toast({
        title: "CRM Deleted",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error deleting CRM",
          description: error.message,
          status: "error",
          duration: 2000,
        });
      }
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Form Section */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">
                {editingIndex !== null ? "Edit CRM" : "Add New CRM"}
              </Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Website</FormLabel>
                      <Input
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Instagram</FormLabel>
                      <Input
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Facebook</FormLabel>
                      <Input
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                  <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="lead">Lead</option>
                      <option value="customer">Customer</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Additional Information</FormLabel>
                    <Textarea
                      name="additional_info"
                      value={formData.additional_info}
                      onChange={handleChange}
                      rows={3}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" w="full">
                    {editingIndex !== null ? "Update CRM" : "Add CRM"}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
        {/* CRMs Section */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">CRMs</Heading>
              <Tabs>
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Leads</Tab>
                  <Tab>Customers</Tab>
                </TabList>
                <TabPanels>
                  {["all", "lead", "customer"].map((type) => (
                    <TabPanel key={type}>
                      <VStack spacing={4} align="stretch">
                        {crms
                          .filter((crm) =>
                            type === "all" ? true : crm.type === type
                          )
                          .map((crm, index) => (
                            <Card key={index} variant="outline">
                              <CardBody>
                                <Flex justify="space-between" align="center">
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold">
                                      {crm.full_name}
                                    </Text>
                                    <Text fontSize="sm">{crm.email}</Text>
                                    <Badge
                                      colorScheme={
                                        crm.type === "lead" ? "blue" : "green"
                                      }
                                    >
                                      {crm.type}
                                    </Badge>
                                  </VStack>
                                  <HStack>
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<Edit2 />}
                                      size="sm"
                                      onClick={() => handleEdit(index)}
                                    />
                                    <IconButton
                                      aria-label="Delete"
                                      icon={<Trash2 />}
                                      colorScheme="red"
                                      size="sm"
                                      onClick={() => handleDelete(crm.id!)}
                                    />
                                  </HStack>
                                </Flex>
                              </CardBody>
                            </Card>
                          ))}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default CRMSection;
