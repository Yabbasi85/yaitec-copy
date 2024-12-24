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

interface Chapter {
  id?: string;
  title: string;
  content: string;
  image?: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterToDelete: Chapter | null;  
  confirmDeleteChapter: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  chapterToDelete,
  confirmDeleteChapter,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the chapter "
          {chapterToDelete ? chapterToDelete.title : "this chapter"}"?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={confirmDeleteChapter}>
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
