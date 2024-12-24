import { useState, useEffect } from "react";
import { Box, Container, VStack, Heading, Text, useToast, Divider, useColorModeValue } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import DashboardFilters from "./components/DashboardFilters";
import DashboardForm from "./components/DashboardForm";
import DashboardTable from "./components/DashboardTable";
import EditDashboardModal from "./components/EditDashboardModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"; 
import createTheme from "../../styles/theme";

interface Dashboard {
  id: string; 
  name: string;
  category: string;
  enabled: boolean;
  createdAt: string;
}

const categories = ["Competitors", "Business Analytics", "Content Creation", "Voice IA", "Marketing Campaign", "Dashboard Analytics", "Design AI", "Lead Management", "Ebook Creation"];

const AdminPanelPage = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [newDashboard, setNewDashboard] = useState({ name: "", category: "" });
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null); 
  const [filter, setFilter] = useState({
    status: "all",
    category: "all",
    search: "",
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure(); 
  const apiUrl = import.meta.env.VITE_API_URL;
  const usedCategories = dashboards.map(dashboard => dashboard.category); 
  const availableCategories = categories.filter(category => !usedCategories.includes(category)); 
  const theme = createTheme("brand1");
  const primaryColor = theme.colors.brand?.purple;
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue(theme.colors.brand?.darkBlue, theme.colors.brand?.white);


  // Fetch all dashboards from the backend
  useEffect(() => {
    axios.get(`${apiUrl}/dashboards/`)
      .then(response => {
        setDashboards(response.data);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch dashboards",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [apiUrl]);

  // Add new dashboard
  const handleAddDashboard = () => {
    if (newDashboard.name && newDashboard.category) {
      axios.post(`${apiUrl}/dashboards/`, {
        name: newDashboard.name,
        category: newDashboard.category,
        enabled: true,
        createdAt: new Date().toISOString(),
      })
      .then(response => {
        setDashboards([...dashboards, response.data]);
        setNewDashboard({ name: "", category: "" });
        window.location.reload();
        toast({
          title: "Dashboard added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add dashboard",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Toggle dashboard status
  const handleToggleDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    if (dashboard) {
      axios.put(`${apiUrl}/dashboards/${id}`, {
        ...dashboard,
        enabled: !dashboard.enabled,
      })
      .then(response => {
        setDashboards(dashboards.map(d => (d.id === id ? response.data : d))); 
        window.location.reload();
        toast({
          title: "Dashboard status updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update dashboard",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
    }
  };

  // Open the delete confirmation modal
  const openDeleteModal = (id: string) => {
    const dashboard = dashboards.find((d) => d.id === id);
    if (dashboard) {
      setDashboardToDelete(dashboard);
      onDeleteOpen();
    }
  };

  // Confirm and delete dashboard
  const confirmDeleteDashboard = () => {
    if (dashboardToDelete) {
      axios.delete(`${apiUrl}/dashboards/${dashboardToDelete.id}`)
        .then(() => {
          setDashboards(dashboards.filter((dashboard) => dashboard.id !== dashboardToDelete.id));
          onDeleteClose();
          toast({
            title: "Dashboard deleted",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location.reload(); // Refresh the page
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to delete dashboard",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    }
  };

  // Edit dashboard
  const handleEditDashboard = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard);
    onOpen();
  };

  const handleUpdateDashboard = () => {
    if (editingDashboard && editingDashboard.name && editingDashboard.category) {
      axios.put(`${apiUrl}/dashboards/${editingDashboard.id}`, editingDashboard)
        .then(response => {
          setDashboards(dashboards.map(d => (d.id === editingDashboard.id ? response.data : d)));
          onClose();
          setEditingDashboard(null);
          toast({
            title: "Dashboard updated",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to update dashboard",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const filteredDashboards = dashboards.filter((dashboard) => {
    const statusMatch =
      filter.status === "all" ||
      (filter.status === "enabled" && dashboard.enabled) ||
      (filter.status === "disabled" && !dashboard.enabled);
    const categoryMatch =
      filter.category === "all" || dashboard.category === filter.category;
    const searchMatch =
      filter.search === "" ||
      dashboard.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      dashboard.category.toLowerCase().includes(filter.search.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="2xl" color={primaryColor} mb={2}>
              Admin Panel
            </Heading>
            <Text fontSize="lg" color={headingColor}>
              Manage all dashboards and functionalities in one place
            </Text>
          </Box>

          <DashboardFilters
            filter={filter}
            setFilter={setFilter}
            categories={categories}
          />

          <Divider my={6} />

          <DashboardForm
            newDashboard={newDashboard}
            setNewDashboard={setNewDashboard}
            handleAddDashboard={handleAddDashboard}
            categories={availableCategories} 
          />

          <DashboardTable
            dashboards={filteredDashboards}
            handleToggleDashboard={handleToggleDashboard}
            handleEditDashboard={handleEditDashboard}
            handleDeleteDashboard={openDeleteModal} // Open modal instead of directly deleting
          />
        </VStack>
      </Container>

      <EditDashboardModal
        isOpen={isOpen}
        onClose={onClose}
        editingDashboard={editingDashboard}
        setEditingDashboard={setEditingDashboard}
        handleUpdateDashboard={handleUpdateDashboard}
        categories={availableCategories} 
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        dashboardToDelete={dashboardToDelete}
        confirmDeleteDashboard={confirmDeleteDashboard}
      />
    </Box>
  );
};

export default AdminPanelPage;

