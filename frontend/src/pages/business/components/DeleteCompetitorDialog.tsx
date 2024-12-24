import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
  Text,
  useToast,  
} from "@chakra-ui/react";

type Competitor = {
  id: string;
  name: string;
  website: string;
  socialMedia: string;
};

interface DeleteCompetitorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  handleDelete: () => void;
  competitorToDelete: Competitor | null;
}

export const DeleteCompetitorDialog: React.FC<DeleteCompetitorDialogProps> = ({
  isOpen,
  onClose,
  isLoading,
  handleDelete,
  competitorToDelete,
}) => {
  // Usar as cores do tema
  const modalBg = useColorModeValue("brand.white", "gray.800");
  const textColor = useColorModeValue("brand.darkBlue", "white");

  // Criando o toast
  const toast = useToast();

  const handleDeleteWithToast = () => {
    handleDelete();
    toast({
      title: "Business Analytics deleted.",
      description: `${competitorToDelete?.name} was successfully deleted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader color={textColor}>Confirm Deletion</ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody>
          <Text color={textColor}>
            Are you sure you want to delete the business analytics entry "
            {competitorToDelete ? competitorToDelete.name : "this entry"}"?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            onClick={handleDeleteWithToast}
            mr={3}
            isLoading={isLoading}
          >
            Delete
          </Button>
          <Button
            bg="brand.purple"
            color="white"
            _hover={{ bg: "brand.electricGreen" }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};