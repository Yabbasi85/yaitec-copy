import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"; 
import { Lead } from "./types";
import { getScoreColor, getStatusColor } from "./utils";

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onEdit, onDelete }) => {
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formattedSuggestions, setFormattedSuggestions] = useState<JSX.Element[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const itemsPerPage = 5; // Quantidade de leads por página
  const totalPages = Math.ceil(leads.length / itemsPerPage); // Total de páginas

  const formatContentPlan = (contentPlan: string) => {
    return contentPlan.split("\n").map((line, index) => {
      if (line.includes(":")) {
        const [label, value] = line.split(":");
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2}>
            <strong>{label.trim()}:</strong> {value.trim()}
          </Text>
        );
      } else {
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2}>
            {line.trim()}
          </Text>
        );
      }
    });
  };

  const handleShowSuggestions = (suggestions: string) => {
    if (suggestions) {
      setFormattedSuggestions(formatContentPlan(suggestions));
    } else {
      setFormattedSuggestions([<Text key="no-suggestions">No suggestions available.</Text>]);
    }
    onOpen(); 
  };

  // Funções de navegação de página
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Cálculo para exibir os leads da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box
      overflowX="auto"
      bg={cardBgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      borderColor={borderColor}
    >
      <Heading size="lg" mb={6} color="#111111">
        Leads List
      </Heading>
      {leads.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text>No leads registered.</Text>
        </Box>
      ) : (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Company</Th>
                <Th>Status</Th>
                <Th>Temperature</Th>
                <Th>Score</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentLeads.map((lead) => (
                <Tr key={lead.id}>
                  <Td fontWeight="medium">{lead.name}</Td>
                  <Td>{lead.email}</Td>
                  <Td>{lead.company}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        lead.temperature === "Hot"
                          ? "red"
                          : lead.temperature === "Warm"
                          ? "orange"
                          : "blue"
                      }
                    >
                      {lead.temperature}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getScoreColor(lead.score)}>
                      {lead.score}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>   
                      <IconButton
                        icon={<FaEye />}
                        aria-label="View content plan"
                        bg="#00ff89"
                        color="#FFFFFF"
                        _hover={{ bg: "#5541ff" }}
                        size="sm"
                        onClick={() => handleShowSuggestions(lead.suggestions)}
                      />
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit Lead"
                        bg="#00ff89"
                        color="#FFFFFF"
                        _hover={{ bg: "#5541ff" }}
                        onClick={() => onEdit(lead)}
                        size="sm"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete Lead"
                        colorScheme="red"
                        onClick={() => onDelete(lead.id)}
                        size="sm"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Paginação */}
          {totalPages > 1 && (
            <HStack justifyContent="center" mt={6}>
              <Button
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          )}

          {/* Modal para exibir as sugestões */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Lead Suggestions</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {formattedSuggestions}
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default LeadList;
