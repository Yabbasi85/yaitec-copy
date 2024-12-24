import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Progress,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
};

export const CreateContentProgressModal = ({
  isOpen,
  onClose,
  progress,
}: ModalProps) => {
  // Utilizando as cores do tema
  const modalBg = useColorModeValue("brand.white", "gray.800");
  const textColor = useColorModeValue("brand.darkBlue", "white");
  const progressColorScheme = useColorModeValue("purple", "green");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalBody p={6}>
          <Text mb={4} fontWeight="bold" textAlign="center" color={textColor}>
            Creating Content...
          </Text>
          <Progress
            value={progress}
            colorScheme={progressColorScheme}
            size="lg"
            mb={2}
          />
          <Text textAlign="center" color={textColor}>
            {Math.round(progress)}% Complete
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
