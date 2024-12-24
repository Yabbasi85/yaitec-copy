import { useState, useRef } from 'react';
import {
  Box,
  Text,
  Flex,
  IconButton,
  VStack,
  useToast,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);
const MotionFlex = motion(Flex);

const brandColors = {
  darkBlue: '#082a46',
  purple: '#5541ff',
  electricGreen: '#00ff89',
  white: '#FFFFFF',
};

interface Interaction {
  role: string;
  message: string;
  timestamp: Date;
}

const VoiceAIPage = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [, setAudioChunks] = useState([]);
  const toast = useToast();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleMicrophoneClick = async () => {
    if (isActive) {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setIsActive(false);
    } else {
      try {
        const mimeType = 'audio/webm';
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (!MediaRecorder.isTypeSupported(mimeType)) {
          toast({
            title: 'Unsupported Format',
            description: 'Browser does not support the recording format.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const recorder = new MediaRecorder(stream, { mimeType });
        setMediaRecorder(recorder);

        const chunks: BlobPart[] | undefined = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: mimeType });
          const audioFile = new File([audioBlob], 'audio.webm', { type: mimeType });
          setAudioChunks([]);

          if (audioFile.size > 0) {
            await handleVoiceToVoice(audioFile);
          } else {
            console.error('Audio file is empty.');
            toast({
              title: 'Audio Error',
              description: 'The recorded audio file is empty. Please try again.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        };

        recorder.start();
        setIsActive(true);
      } catch (err) {
        toast({
          title: 'Microphone Error',
          description: 'Error accessing the microphone.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Microphone access error:', err);
      }
    }
  };

  const handleVoiceToVoice = async (audioFile: string | Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('voice_file', audioFile);

    try {
      const response = await fetch(`${apiUrl}/voice-to-voice/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addMessage('user', data.transcribed_text);
        addMessage('assistant', data.generated_text);

        const audio = new Audio(data.audio_url);
        audio.preload = 'auto';
        audio.play();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to process the voice request.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while processing the request.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Voice-to-voice request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (role: string, message: any) => {
    setInteractions((prev) => [...prev, { role, message, timestamp: new Date() }]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={brandColors.white}
      p={4}
    >
      <Box
        w="100%"
        maxW="900px"
        bg={brandColors.white}
        borderRadius="xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        {/* Header */}
        <Box bg={brandColors.purple} p={4} color={brandColors.white}>
          <Flex align="center" justify="space-between">
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
              AI Voice Assistant
            </Text>
            <Button
              onClick={onOpen}
            >
              How it works
            </Button>
          </Flex>
        </Box>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>How the Voice AI Page Works</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                This page allows you to interact with an AI voice assistant. You can record your voice by clicking the microphone button. The AI will process your speech, transcribe it, and respond with a generated message. You'll hear the response played back, and the interaction will be displayed in the chat.
              </Text>
              <Text mt={4}>
                To start recording, click the microphone button. When you’re done, click it again to stop. The assistant will process your request and reply shortly.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Chat Area */}
        <VStack
          spacing={4}
          overflowY="auto"
          flex={1}
          p={4}
          h={{ base: '60vh', md: '70vh' }}
        >
          {interactions.map((interaction, index) => (
            <MotionFlex
              key={index}
              w="100%"
              justify={interaction.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              {interaction.role === 'assistant' && (
                <Avatar
                  size="sm"
                  icon={<FaRobot />}
                  bg={brandColors.purple}
                  color={brandColors.white}
                  mr={2}
                />
              )}
              <Box
                maxW="70%"
                bg={interaction.role === 'assistant' ? brandColors.purple : brandColors.darkBlue}
                color={brandColors.white}
                p={4}
                borderRadius="lg"
                boxShadow="md"
              >
                <Text>{interaction.message}</Text>
                <Text fontSize="xs" color="gray.300" textAlign="right" mt={1}>
                  {formatTimestamp(interaction.timestamp)}
                </Text>
              </Box>
            </MotionFlex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>

        <Divider />

        {/* Footer */}
        <Flex
          justify="space-between"
          align="center"
          p={4}
          bg={brandColors.white}
        >
          <MotionIconButton
            onClick={handleMicrophoneClick}
            aria-label={isActive ? 'Stop Recording' : 'Start Recording'}
            icon={isLoading ? <Spinner /> : isActive ? <FaMicrophoneSlash /> : <FaMicrophone />}
            bg={isActive ? 'red.500' : brandColors.purple}
            color={brandColors.white}
            isRound
            isDisabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            _hover={{ bg: isActive ? 'red.600' : brandColors.electricGreen }}
            size="lg"
          />
          <Badge
            colorScheme={
              isActive ? 'green' : isLoading ? 'yellow' : 'gray'
            }
          >
            {isActive ? 'Listening' : isLoading ? 'Processing' : 'Idle'}
          </Badge>
        </Flex>
      </Box>
    </Flex>
  );
};

export default VoiceAIPage;
