import { useState, useEffect } from "react";
import { 
  Box, Text, SimpleGrid, VStack, Icon, HStack, Button, Spinner, IconButton 
} from "@chakra-ui/react";
import { Folder, FileText, ArrowLeft, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

type Folder = { id: number; name: string };

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  return (
    <HStack spacing={4} justify="center" mt={4}>
      <IconButton
        aria-label="Previous Page"
        icon={<ChevronLeft />}
        onClick={handlePrevious}
        isDisabled={currentPage === 1}
        colorScheme="blue"
        size="sm"
      />
      <Button size="sm" variant="ghost" disabled>
        Page {currentPage} of {totalPages}
      </Button>
      <IconButton
        aria-label="Next Page"
        icon={<ChevronRight />}
        onClick={handleNext}
        isDisabled={currentPage === totalPages}
        colorScheme="blue"
        size="sm"
      />
    </HStack>
  );
};

const FilesSection = () => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const folders = [
    { id: 1, name: "Branding" },
    { id: 2, name: "Social Media" },
    { id: 3, name: "Email Marketing" },
    { id: 4, name: "Website Development" },
    { id: 5, name: "AI Integrations" },
  ];

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/list-pdfs/`, {
        cache: 'no-store',  
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      setPdfFiles(data.pdf_files);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      setPdfFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFolder?.name === "Social Media") {
      fetchPDFs();
    }
  }, [selectedFolder]);

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
    setCurrentPage(1); // Reset to first page when a new folder is selected
  };

  const handleBackClick = () => {
    setSelectedFolder(null);
    setPdfFiles([]);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Logic for displaying current files
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = pdfFiles.slice(indexOfFirstFile, indexOfLastFile);

  return (
    <Box minH="100vh" bg="#F5F9FF" p={6}>
      <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
          My Files
        </Text>
        <Text color="gray.600" mb={8}>
          Approved content organized in folders
        </Text>
        {selectedFolder ? (
          <VStack align="stretch" spacing={4}>
            <Button
              leftIcon={<ArrowLeft />}
              onClick={handleBackClick}
              alignSelf="flex-start"
              mb={4}
            >
              Back to Folders
            </Button>
            <Text fontSize="xl" fontWeight="bold" color="gray.900" mb={4}>
              {selectedFolder.name}
            </Text>
            {loading ? (
              <Spinner size="xl" color="blue.500" alignSelf="center" />
            ) : (
              <>
                {currentFiles.map((pdf, index) => (
                  <HStack
                    key={index}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={4}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "#00B8B9",
                      shadow: "md",
                    }}
                    align="center"
                    justify="space-between"
                  >
                    <HStack>
                      <Icon as={FileText} w={5} h={5} color="#00B8B9" />
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {pdf}
                      </Text>
                    </HStack>
                    <HStack spacing={4}>
                      {/* Botão de Visualizar */}
                      <Button
                        leftIcon={<Eye />}
                        size="sm"
                        colorScheme="blue"
                        as="a"
                        href={`${API_BASE_URL}/pdfs/${pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visualizar
                      </Button>

                      {/* Botão de Download */}
                      <Button
                        leftIcon={<Download />}
                        size="sm"
                        colorScheme="teal"
                        as="a"
                        href={`${API_BASE_URL}/pdfs/${pdf}`}
                        download={`${pdf}`} 
                      >
                        Baixar
                      </Button>
                    </HStack>
                  </HStack>
                ))}
                {pdfFiles.length > filesPerPage && (
                  <Pagination
                    totalItems={pdfFiles.length}
                    itemsPerPage={filesPerPage}
                    currentPage={currentPage}
                    paginate={paginate}
                  />
                )}
              </>
            )}
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={4}>
            {folders.map((folder) => (
              <VStack
                key={folder.id}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
                transition="all 0.2s"
                _hover={{
                  borderColor: "#00B8B9",
                  shadow: "md",
                }}
                cursor="pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <Icon
                  as={Folder}
                  w={6}
                  h={6}
                  color="#00B8B9"
                  mb={3}
                  _hover={{ transform: "scale(1.1)" }}
                />
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                  _hover={{ color: "#00B8B9" }}
                >
                  {folder.name}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default FilesSection;
