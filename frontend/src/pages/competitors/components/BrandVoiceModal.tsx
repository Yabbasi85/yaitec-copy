import ReactMarkdown from "react-markdown";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";

type BrandVoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
};

const BrandVoiceModal = ({ isOpen, onClose, content }: BrandVoiceModalProps) => {
  // Usar cores do tema
  const modalBg = useColorModeValue("brand.white", "gray.800");
  const headerColor = useColorModeValue("brand.darkBlue", "white");
  const buttonBg = useColorModeValue("brand.purple", "purple.600");
  const buttonHoverBg = useColorModeValue("brand.electricGreen", "green.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={modalBg} p={4}>
        <ModalHeader color={headerColor}>Brand Voice</ModalHeader>
        <ModalCloseButton color={headerColor} />
        <ModalBody>
          <ReactMarkdown>{content}</ReactMarkdown>
        </ModalBody>
        <ModalFooter>
          <Button
            bg={buttonBg}
            color="white"
            _hover={{ bg: buttonHoverBg }}
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BrandVoiceModal;