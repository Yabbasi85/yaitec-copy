import React from 'react';
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

interface Campaign {
  id: string;
  name: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignToDelete?: Campaign | null;
  confirmDeleteCampaign: () => void;
}

const brandColors = {
  darkBlue: "#082a46",
  purple: "#5541ff",
  electricGreen: "#00ff89",
  white: "#FFFFFF",
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  campaignToDelete,
  confirmDeleteCampaign,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the campaign "
          {campaignToDelete ? campaignToDelete.name : "this campaign"}"?
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={confirmDeleteCampaign}
          >
            Delete
          </Button>
          <Button
            color={brandColors.white}
            backgroundColor={brandColors.purple}
            onClick={onClose}
            _hover={{ bg: brandColors.electricGreen }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
