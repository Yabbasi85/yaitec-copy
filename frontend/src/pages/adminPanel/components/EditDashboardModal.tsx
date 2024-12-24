import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface Dashboard {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  createdAt: string;
}

interface EditDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDashboard: Dashboard | null;
  setEditingDashboard: Dispatch<SetStateAction<Dashboard | null>>;
  handleUpdateDashboard: () => void;
  categories: string[];
}

const EditDashboardModal: React.FC<EditDashboardModalProps> = ({
  isOpen,
  onClose,
  editingDashboard,
  setEditingDashboard,
  handleUpdateDashboard,
  categories,
}) => {
  const theme = useTheme(); // Acessa o tema global
  const currentDashboard = editingDashboard || { name: "", category: "" };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Dashboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nome do Dashboard</FormLabel>
              <Input
                value={currentDashboard.name}
                onChange={(e) =>
                  setEditingDashboard((prev) =>
                    prev
                      ? { ...prev, name: e.target.value }
                      : {
                          id: "",
                          name: e.target.value,
                          category: "",
                          enabled: false,
                          createdAt: "",
                        }
                  )
                }
              />
            </FormControl>

            {categories.length > 0 ? (
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={currentDashboard.category}
                  onChange={(e) =>
                    setEditingDashboard((prev) =>
                      prev
                        ? { ...prev, category: e.target.value }
                        : {
                            id: "",
                            name: "",
                            category: e.target.value,
                            enabled: false,
                            createdAt: "",
                          }
                    )
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Text>No categories available for selection.</Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleUpdateDashboard}
          >
            Update
          </Button>
          <Button
            backgroundColor={theme.colors.red[500]}
            color="white"
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDashboardModal;
