import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Badge,
  Flex,
  Tooltip,
  Switch,
  Heading,
  useColorModeValue,
  Box,
  useTheme,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Dashboard {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  createdAt: string;
}

interface DashboardTableProps {
  dashboards: Dashboard[];
  handleToggleDashboard: (id: string) => void;
  handleEditDashboard: (dashboard: Dashboard) => void;
  handleDeleteDashboard: (id: string) => void;
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  dashboards,
  handleToggleDashboard,
  handleEditDashboard,
  handleDeleteDashboard,
}) => {
  const theme = useTheme(); // Acessa o tema global
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue(theme.colors.brand.darkBlue, theme.colors.brand.white);
  const editButtonBg = theme.colors.brand.purple;
  const editButtonHoverBg = theme.colors.brand.electricGreen;

  return (
    <Box
      overflowX="auto"
      bg={cardBgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      borderColor={borderColor}
    >
      <Heading size="lg" mb={6} color={headingColor}>
        Dashboards Management
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <Tr key={dashboard.id}>
                <Td>{dashboard.name}</Td>
                <Td>{dashboard.category}</Td>
                <Td>
                  <Flex align="center">
                    <Switch
                      colorScheme="green"
                      isChecked={dashboard.enabled}
                      onChange={() => handleToggleDashboard(dashboard.id)}
                      mr={2}
                    />
                    <Badge colorScheme={dashboard.enabled ? "green" : "red"}>
                      {dashboard.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </Flex>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Tooltip label="Edit Dashboard">
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit Dashboard"
                        bg={editButtonBg}
                        color="white"
                        _hover={{ bg: editButtonHoverBg }}
                        onClick={() => handleEditDashboard(dashboard)}
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Delete Dashboard">
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete Dashboard"
                        colorScheme="red"
                        onClick={() => handleDeleteDashboard(dashboard.id)}
                        size="sm"
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} textAlign="center">
                No dashboards match the current filters.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DashboardTable;
