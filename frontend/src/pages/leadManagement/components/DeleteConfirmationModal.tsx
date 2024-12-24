import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Lead } from "./types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToDelete: Lead | null;
  confirmDeleteLead: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  leadToDelete,
  confirmDeleteLead,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the lead "
          {leadToDelete ? leadToDelete.name : "this lead"}"?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={confirmDeleteLead}>
            Delete
          </Button>
          <Button color="#FFFFFF" backgroundColor="#5541ff" onClick={onClose} _hover={{ bg: "#00ff89" }}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
