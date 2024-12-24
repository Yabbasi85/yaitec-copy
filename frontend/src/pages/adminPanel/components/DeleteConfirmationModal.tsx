import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useTheme,
} from "@chakra-ui/react";

interface Dashboard {
  id: string;
  name: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardToDelete: Dashboard | null;  
  confirmDeleteDashboard: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  dashboardToDelete,
  confirmDeleteDashboard,
}) => {
  const theme = useTheme(); // Acessando o tema global

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the dashboard "
          {dashboardToDelete ? dashboardToDelete.name : "this dashboard"}"?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={confirmDeleteDashboard}>
            Delete
          </Button>
          <Button
            color="white"
            bg={theme.colors.brand.purple}
            onClick={onClose}
            _hover={{ bg: theme.colors.brand.electricGreen }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
