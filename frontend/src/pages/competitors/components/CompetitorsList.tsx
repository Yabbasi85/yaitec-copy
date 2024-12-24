import { useEffect, useState } from "react";
import {
  Flex,
  Grid,
  GridItem,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  Input,
  Box,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import BrandVoiceModal from "./BrandVoiceModal";
import { DeleteCompetitorDialog } from "./DeleteCompetitorDialog";
import { useListCompetitors } from "../../../@global/api/hooks/competitors/useListCompetitors";
import { useDeleteCompetitor } from "../../../@global/api/hooks/competitors/useDeleteCompetitor";
import { FaEye, FaTrash } from "react-icons/fa";

type CompetitorsType = {
  id: string;
  name: string;
  website: string;
  socialMedia: string;
  brandVoice: string;
};

const CompetitorsList = ({ isLoading }: { isLoading: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [competitors, setCompetitors] = useState<CompetitorsType[]>([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState<CompetitorsType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [competitorToDelete, setCompetitorToDelete] = useState<CompetitorsType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCompetitors.length / itemsPerPage);

  const { data } = useListCompetitors();
  const { mutate: deleteCompetitor, isLoading: isDeleteLoading, status: deleteStatus } = useDeleteCompetitor();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Usar cores do tema
  const darkBlue = useColorModeValue("brand.darkBlue", "white");
  const purple = useColorModeValue("brand.purple", "purple.700");
  const electricGreen = useColorModeValue("brand.electricGreen", "green.400");
  const white = useColorModeValue("brand.white", "gray.800");

  useEffect(() => {
    if (data && data.length > 0) {
      const mapData = data.map((item) => ({
        id: item.id,
        name: item.name,
        website: item.website,
        socialMedia: item.social_media,
        brandVoice: item.brand_voice || "",
      }));
      setCompetitors(mapData);
      setFilteredCompetitors(mapData);
    } else {
      setCompetitors([]);
      setFilteredCompetitors([]);
    }
  }, [data]);

  useEffect(() => {
    const result = competitors.filter((competitor) =>
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.socialMedia.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompetitors(result);
    setCurrentPage(1);
  }, [searchQuery, competitors]);


  useEffect(() => {
    if (deleteStatus === "success") {
      onClose();
    }
  }, [deleteStatus]);

  const handleViewBrandVoice = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deleteContent = (competitor: CompetitorsType) => {
    setCompetitorToDelete(competitor);
    onOpen();
  };

  const handleDelete = () => {
    if (competitorToDelete) {
      deleteCompetitor({ id: competitorToDelete.id });
    }
  };

  // Funções de navegação de página
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompetitors = filteredCompetitors.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Flex direction="column" border="1px solid" borderColor={darkBlue} p={4} w="100%" borderRadius="8px">

      {/* Campo de Filtro */}
      <Box mb={4}>
        <Input
          placeholder="Search by name, website or social media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Cabeçalho da tabela */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr 1fr 150px",
        }}
        padding={"8px"}
        gap={4}
        bg={purple}
      >
        <GridItem>
          <Text fontWeight="bold" color={white}>Name</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color={white}>Website</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color={white}>Social Media</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold" color={white}>Action</Text>
        </GridItem>
      </Grid>

      {/* Verificação de lista vazia */}
      {currentCompetitors.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" mt={6}>
          <Text color={darkBlue}>No competitor found.</Text>
        </Flex>
      ) : (
        <>

          {/* Lista de competidores */}
          {currentCompetitors.map((competitor, index) => (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr 1fr 150px",
              }}
              key={index}
              alignItems="center"
              padding={"8px"}
              bg={index % 2 === 0 ? white : `${purple}20`}
              gap={4}
            >
              <GridItem>
                <Text color={darkBlue}>{competitor.name}</Text>
              </GridItem>
              <GridItem>
                <Text color={darkBlue}>{competitor.website}</Text>
              </GridItem>
              <GridItem>
                <Text color={darkBlue}>{competitor.socialMedia}</Text>
              </GridItem>
              <GridItem>
                <Flex gap={2}>
                  <Tooltip
                    label="View Brand Voice"
                    aria-label="View Brand Voice tooltip"
                  >
                    <IconButton
                      aria-label="View brand voice"
                      icon={<FaEye />}
                      onClick={() => handleViewBrandVoice(competitor.brandVoice)}
                      bg={purple}
                      color={white}
                      _hover={{ bg: electricGreen }}
                      size="sm"
                      isDisabled={isLoading}
                    />
                  </Tooltip>
                  <Tooltip
                    label="Remove Competitor"
                    aria-label="Remove Competitor tooltip"
                  >
                    <IconButton
                      aria-label="Remove competitor"
                      icon={<FaTrash />}
                      onClick={() => deleteContent(competitor)}
                      bg="red.500"
                      color={white}
                      _hover={{ bg: "red.600" }}
                      size="sm"
                      isDisabled={isLoading}
                    />
                  </Tooltip>
                </Flex>
              </GridItem>
            </Grid>
          ))}

          {/* Paginação */}
          {totalPages > 1 && (
            <HStack justifyContent="center" mt={6}>
              <Button
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text color={darkBlue}>
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

          <BrandVoiceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            content={modalContent}
          />
        </>
      )}
      <DeleteCompetitorDialog
        handleDelete={handleDelete}
        isLoading={isDeleteLoading}
        isOpen={isOpen}
        onClose={onClose}
        competitorToDelete={competitorToDelete}
      />
    </Flex>
  );
};

export default CompetitorsList;