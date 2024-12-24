import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Icon,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { COLORS } from './constants';
import { FC } from 'react';

interface Mockup {
  type: string;
  imageUrl: string;
  consistencyReport: Array<{
    criteria: string;
    status: string;
    recommendation: string;
  }>;
}


interface MockupAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMockup: Mockup | null;
}


const MockupAnalysisModal: FC<MockupAnalysisModalProps> = ({ isOpen, onClose, selectedMockup }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader fontFamily="Cropar, sans-serif" color={COLORS.purple}>
        {selectedMockup?.type.replace('-', ' ')} - Brand Consistency Analysis
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {selectedMockup && (
          <VStack spacing={4} align="stretch">
            <Image
              src={selectedMockup.imageUrl}
              alt={`${selectedMockup.type} design`}
              w="100%"
              borderRadius="md"
            />
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Criteria</Th>
                  <Th>Status</Th>
                  <Th>Recommendation</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedMockup.consistencyReport.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.criteria}</Td>
                    <Td>
                      <Flex align="center">
                        <Icon
                          as={item.status === 'Consistent' ? CheckCircleIcon : WarningIcon}
                          color={item.status === 'Consistent' ? 'green.500' : 'yellow.500'}
                          mr={2}
                        />
                        {item.status}
                      </Flex>
                    </Td>
                    <Td>
                      <Tooltip label={item.recommendation} placement="top">
                        <Flex align="center" cursor="pointer">
                          {item.recommendation.slice(0, 30)}...
                          <InfoOutlineIcon ml={2} />
                        </Flex>
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        )}
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="purple" mr={3} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default MockupAnalysisModal;
