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
  useColorModeValue
} from "@chakra-ui/react";
import { PDFDocument, PDFFont, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from "xlsx";
import { FaEye, FaTrash } from "react-icons/fa";
import BrandVoiceModal from "./BrandVoiceModal";
import { DeleteCompetitorDialog } from "./DeleteCompetitorDialog";
import { useListBusinessAnalytics } from "../../../@global/api/hooks/businessAnalytics/useListBusinessAnalytics";
import { useDeleteBusinessAnalytics } from "../../../@global/api/hooks/businessAnalytics/useDeleteBusinessAnalytics";

type SocialMediaPost = {
  id: string;
  publishedAt: string;
  salary?: string;
  title?: string;
  jobUrl?: string;
  companyName?: string;
  location?: string;
  description?: string;

  // Facebook-specific fields
  facebookUrl?: string;
  postId?: string;
  pageName?: string;
  user?: {
    id: string;
    name: string;
    profileUrl: string;
    profilePic: string;
  };
  text?: string;
  link?: string;
  likes?: number;
  shares?: number;
  media?: Array<{
    thumbnail: string;
    photo_image: {
      uri: string;
      height: number;
      width: number;
    };
    ocrText?: string;
  }>;

  feedbackId?: string;
  topLevelUrl?: string;
  facebookId?: string;
  pageAdLibrary?: {
    is_business_page_active: boolean;
    id: string;
  };

  // Instagram-specific fields
  username?: string;
  fullName?: string;
  followersCount?: number;
  biography?: string;
  externalUrl?: string;

  // Twitter (X)-specific fields
  full_text?: string;
  permalink?: string;
  favorite_count?: number;

  // LinkedIn-specific fields
  name?: string;
  picture?: string;
  social?: string;
  education?: string;
  experiences?: string;
  about?: string;

  // YouTube-specific fields
  url?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  date?: string;
  channelName?: string;
  channelUrl?: string;
  numberOfSubscribers?: number;
  channelDescription?: string;
};

type SocialMediaPlatformPosts = {
  [platform: string]: SocialMediaPost[];
};

type SocialMediaSummaryType = {
  [url: string]: SocialMediaPlatformPosts;
};

// Tipos ajustados para consistência
type CompetitorsType = {
  id: string;
  name: string;
  website: string;
  socialMedia: string;
  product: string;
  location: string;
  competitors: Array<{
    name: string;
    url: string;
    description: string;
    products: string[];
    services: string[];
    about: string;
    vision: string;
    history: string;
  }>;
  competitorsWebsiteData: Array<{ url: string; content: string }>;
  socialMediaSummary: SocialMediaSummaryType;
  websiteUrls: string[];
  extractedSocialLinks: string[];
};

type BrandVoiceModalContent = {
  website: string;
  product: string;
  location: string;
  competitors: Array<{
    name: string;
    url: string;
    description: string;
    products: string[];
    services: string[];
    about: string;
    vision: string;
    history: string;
  }>;
  websiteUrls: string[];
  competitorsWebsiteData: Array<{ url: string; content: string }>;
  extractedSocialLinks: string[];
  socialMediaSummary: SocialMediaSummaryType;
};

const CompetitorsList = ({ isLoading }: { isLoading: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<BrandVoiceModalContent>({
    website: "",
    product: "N/A",
    location: "N/A",
    competitors: [],
    websiteUrls: [],
    extractedSocialLinks: [],
    socialMediaSummary: {},
    competitorsWebsiteData: []
  });

  const [competitors, setCompetitors] = useState<CompetitorsType[]>([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState<CompetitorsType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [competitorToDelete, setCompetitorToDelete] = useState<CompetitorsType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCompetitors.length / itemsPerPage);

  const { data } = useListBusinessAnalytics();
  const { mutate: deleteCompetitor, isLoading: isDeleteLoading, status: deleteStatus } = useDeleteBusinessAnalytics();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Usar cores do tema
  const darkBlue = useColorModeValue("brand.darkBlue", "white");
  const purple = useColorModeValue("brand.purple", "purple.700");
  const electricGreen = useColorModeValue("brand.electricGreen", "green.400");
  const white = useColorModeValue("brand.white", "gray.800");

  // Atualizar competidores ao receber novos dados
  useEffect(() => {
    if (data && data.length > 0) {
      const mapData = data.map((item) => ({
        id: item.id,
        name: item.name,
        website: item.website,
        socialMedia: item.social_media,
        product: item.product || "",
        location: item.location || "",
        competitors: Array.isArray(item.competitors) ? item.competitors : [],
        competitorsWebsiteData: Array.isArray(item.competitors_website_data)
          ? item.competitors_website_data.map((entry) => ({
            url: entry.url,
            content: entry.content,
          }))
          : [],
        socialMediaSummary:
          item.social_media_summary && typeof item.social_media_summary === 'object'
            ? item.social_media_summary
            : {},
        websiteUrls: Array.isArray(item.website_urls) ? item.website_urls : [],
        extractedSocialLinks: Array.isArray(item.extracted_social_links)
          ? item.extracted_social_links
          : [],
      }));
      setCompetitors(mapData);
      setFilteredCompetitors(mapData);
    } else {
      setCompetitors([]);
      setFilteredCompetitors([]);
    }
  }, [data]);

  // Filtrar competidores com base na pesquisa
  useEffect(() => {
    const result = competitors.filter((competitor) =>
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.socialMedia.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompetitors(result);
    setCurrentPage(1);
  }, [searchQuery, competitors]);

  // Fechar o modal de exclusão após deletar
  useEffect(() => {
    if (deleteStatus === "success") {
      onClose();
    }
  }, [deleteStatus]);

  // Exportação para JSON
  const exportToJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredCompetitors)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "competitors_data.json";
    link.click();
  };

  // Exportação para Excel
  const exportToExcel = () => {
    const flattenedData = filteredCompetitors.map((competitor) => {
      const baseData = {
        id: competitor.id,
        name: competitor.name,
        website: competitor.website,
        product: competitor.product || "N/A",
        location: competitor.location || "N/A",
        websiteUrls: competitor.websiteUrls.length > 0 ? competitor.websiteUrls.join(', ') : "N/A",
        extractedSocialLinks: competitor.extractedSocialLinks.length > 0
          ? competitor.extractedSocialLinks.join(' | ')
          : "N/A",
        competitors: competitor.competitors.length > 0
          ? competitor.competitors.map(comp =>
            `Name: ${comp.name}, Website: ${comp.url || "N/A"}, Description: ${comp.description || "N/A"}, Products: ${comp.products.join(', ') || "N/A"}, Services: ${comp.services.join(', ') || "N/A"}, About: ${comp.about || "N/A"}, Vision: ${comp.vision || "N/A"}, History: ${comp.history || "N/A"}`
          ).join(' | ')
          : "N/A",
        competitorsWebsiteData: competitor.competitorsWebsiteData.length > 0
          ? competitor.competitorsWebsiteData.map(data => `URL: ${data.url}, Content: ${data.content}`).join(' | ')
          : "N/A",
      };

      const socialMediaData: { [key: string]: string } = {};
      let platformIndex = 1;

      Object.entries(competitor.socialMediaSummary || {}).forEach(([url, platformData]) => {
        Object.entries(platformData).forEach(([platformUrl, platformDetails]) => {
          Object.entries(platformDetails).forEach(([platformName, posts]) => {
            const platformKey = `SocialMedia_URL_${platformIndex}`;
            socialMediaData[platformKey] = `URL: ${url}, Platform URL: ${platformUrl}, Platform Name: ${platformName}`;

            if (Array.isArray(posts)) {
              posts.forEach((post, index) => {
                const postKey = `Post_${platformIndex}_${index + 1}`;
                let postDetails = `URL: ${post.url || 'N/A'}, Text: ${post.text || 'N/A'}, Time Since Posted: ${post.timeSincePosted || 'N/A'}, Author: ${post.authorName || 'N/A'}`;

                if (platformName === 'LinkedIn') {
                  postDetails = `
                    Name: ${post.name || 'N/A'}
                    Picture URL: ${post.picture || 'N/A'}
                    LinkedIn URL: ${post.url || 'N/A'}
                    About: ${post.about || 'N/A'}
                    Location: ${post.location || 'N/A'}
                    Education: ${post.education || 'N/A'}
                    Experiences: ${post.experiences || 'N/A'}
                  `;
                } else if (platformName === 'Instagram') {
                  postDetails += `, Username: ${post.username || 'N/A'}, Followers: ${post.followersCount || 0}, Biography: ${post.biography || 'N/A'}, External Link: ${post.externalUrl || 'N/A'}`;
                } else if (platformName === 'X') {
                  postDetails += `, Full Text: ${post.full_text || 'N/A'}, Likes: ${post.favorite_count || 0}, Permalink: https://x.com${post.permalink || ''}`;
                } else if (platformName === 'Facebook') {
                  postDetails += `, Facebook URL: ${post.facebookUrl || 'N/A'}, Post Text: ${post.text || 'N/A'}, Likes: ${post.likes || 0}`;
                } else if (platformName === 'YouTube') {
                  postDetails += `, Video Title: ${post.title || 'N/A'}, Views: ${post.viewCount || 0}, Channel Name: ${post.channelName || 'N/A'}, Subscribers: ${post.numberOfSubscribers || 0}`;
                }

                socialMediaData[postKey] = postDetails;
              });
            } else {
              socialMediaData[`Post_${platformIndex}_NoPosts`] = 'No posts available';
            }

            platformIndex++;
          });
        });
      });

      return { ...baseData, ...socialMediaData };
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competitors");
    XLSX.writeFile(workbook, "competitors_data.xlsx");
  };


  const sanitizeText = (text: string) =>
    text
      .replace(/[^\x00-\x7F]/g, '')

  const addTextWithWrapping = (pdfDoc: PDFDocument, page: PDFPage, text: string, x: number, y: number, maxWidth: number, fontSize: number, font: PDFFont, color: RGB) => {
    const sanitizedText = sanitizeText(text);
    const lines = sanitizedText.split('\n');
    let yOffset = y;

    for (let line of lines) {
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth) {
          if (yOffset < fontSize * 3) { 
            page = pdfDoc.addPage([595.28, 841.89]);
            yOffset = 800;
          }

          page.drawText(currentLine.trim(), { x, y: yOffset, size: fontSize, font, color });
          currentLine = word + ' ';
          yOffset -= fontSize * 1.5;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (yOffset < fontSize * 3) {
          page = pdfDoc.addPage([595.28, 841.89]);
          yOffset = 800;
        }
        page.drawText(currentLine.trim(), { x, y: yOffset, size: fontSize, font, color });
      }
      yOffset -= fontSize * 1.5;
    }

    return yOffset;
  };

  const exportToPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 60;
    const titleFontSize = 20;
    const subtitleFontSize = 16;
    const bodyFontSize = 12;
    const primaryColor = rgb(0.1, 0.4, 0.7);
    const secondaryColor = rgb(0.3, 0.3, 0.3);
    const lineColor = rgb(0.8, 0.8, 0.8);


    for (const competitor of filteredCompetitors) {
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;

      page.drawText(`Competitor: ${competitor.name}`, {
        x: margin,
        y: yPosition,
        size: titleFontSize,
        font: timesBoldFont,
        color: primaryColor,
      });
      yPosition -= titleFontSize * 2;

      const sections = [
        { title: 'Website', content: competitor.website },
        { title: 'Product', content: competitor.product || 'N/A' },
        { title: 'Location', content: competitor.location || 'N/A' },
        {
          title: 'Competitors',
          content: competitor.competitors.length > 0
            ? competitor.competitors.map(comp =>
              `Name: ${comp.name}\nWebsite: ${comp.url || "N/A"}\nDescription: ${comp.description || "N/A"}\nProducts: ${comp.products.join(', ') || "N/A"}\nServices: ${comp.services.join(', ') || "N/A"}\nAbout: ${comp.about || "N/A"}\nVision: ${comp.vision || "N/A"}\nHistory: ${comp.history || "N/A"}`
            ).join('\n\n')
            : 'N/A',
        },
        {
          title: 'Competitors Website Data',
          content: competitor.competitorsWebsiteData.length > 0
            ? competitor.competitorsWebsiteData.map(data => `URL: ${data.url}\nContent: ${data.content}`).join('\n\n')
            : 'N/A',
        },
        {
          title: 'Website URLs',
          content: competitor.websiteUrls.length > 0 ? competitor.websiteUrls.join(', ') : 'N/A',
        },
        {
          title: 'Extracted Social Links',
          content: competitor.extractedSocialLinks.length > 0
            ? competitor.extractedSocialLinks.join(' | ')
            : 'N/A',
        },
        {
          title: 'Social Media Summary',
          content: competitor.socialMediaSummary && Object.keys(competitor.socialMediaSummary).length > 0
            ? Object.entries(competitor.socialMediaSummary).map(([url, platformData]) => {
              let summaryText = `URL: ${url}\n\n`;
              summaryText += Object.entries(platformData).map(([platformUrl, platformDetails]) => {

                let platformText = `Platform URL: ${platformUrl}\n\n`;
                const detailsText = Object.entries(platformDetails).map(([platformName, posts]) => {
                  let platformNameText = `  Platform Name: ${platformName}\n`;
                  const postDetails = Array.isArray(posts) && posts.length > 0
                    ? posts.map((post, index) => {
                      let postText = `    Post ${index + 1}:\n`;
                      postText += `      URL: ${post.url || 'N/A'}\n`;
                      postText += `      Text: ${post.text || 'N/A'}\n`;
                      postText += `      Time Since Posted: ${post.timeSincePosted || 'N/A'}\n`;
                      postText += `      Author: ${post.authorName || 'N/A'}\n`;
                      if (['LinkedIn', 'Instagram', 'X', 'Facebook', 'YouTube'].includes(platformName)) {
                        if (platformName === 'LinkedIn') {
                          postText += `      Name: ${post.name || 'N/A'}\n`;
                          postText += `      Picture URL: ${post.picture || 'N/A'}\n`;
                          postText += `      LinkedIn URL: ${post.url || 'N/A'}\n`;
                          postText += `      About: ${post.about || 'N/A'}\n`;
                          postText += `      Location: ${post.location || 'N/A'}\n`;
                          postText += `      Education: ${post.education || 'N/A'}\n`;
                          postText += `      Experiences: ${post.experiences || 'N/A'}\n`;
                        } else if (platformName === 'Instagram' && post.username) {
                          postText += `      Username: ${post.username || 'N/A'}\n`;
                          postText += `      Full Name: ${post.fullName || 'N/A'}\n`;
                          postText += `      Followers: ${post.followersCount || 0}\n`;
                          postText += `      Biography: ${post.biography || 'N/A'}\n`;
                          postText += `      External Link: ${post.externalUrl || 'N/A'}\n`;
                        } else if (platformName === 'X' && post.full_text) {
                          postText += `      Tweet: ${post.full_text || 'N/A'}\n`;
                          postText += `      Likes: ${post.favorite_count || 0}\n`;
                          postText += `      Permalink: https://x.com${post.permalink || ''}\n`;
                        } else if (platformName === 'Facebook' && post.facebookUrl) {
                          postText += `      Facebook URL: ${post.facebookUrl || 'N/A'}\n`;
                          postText += `      Post Text: ${post.text || 'N/A'}\n`;
                          postText += `      Likes: ${post.likes || 0}\n`;
                        } else if (platformName === 'YouTube' && post.url) {
                          postText += `      Video Title: ${post.title || 'N/A'}\n`;
                          postText += `      Views: ${post.viewCount || 0}\n`;
                          postText += `      Channel Name: ${post.channelName || 'N/A'}\n`;
                          postText += `      Subscribers: ${post.numberOfSubscribers || 0}\n`;
                          postText += `      Channel Description: ${post.channelDescription || 'N/A'}\n`;
                          postText += `      Video Date: ${post.date ? new Date(post.date).toLocaleDateString() : 'Date not available'}\n`;
                          postText += `      Thumbnail: ${post.thumbnailUrl || 'N/A'}\n`;
                        }
                      }
                      return postText;
                    }).join('\n')
                    : '    No posts available\n';
                  return platformNameText + postDetails;
                }).join('\n');
                return platformText + detailsText;
              }).join('\n\n');
              return summaryText;
            }).join('\n\n')
            : 'N/A',
        }
      ];

      for (const section of sections) {
        if (yPosition < margin + subtitleFontSize * 20) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        page.drawText(section.title, {
          x: margin,
          y: yPosition,
          size: subtitleFontSize,
          font: timesBoldFont,
          color: primaryColor,
        });
        yPosition -= subtitleFontSize + 8;

        page.drawLine({
          start: { x: margin, y: yPosition },
          end: { x: pageWidth - margin, y: yPosition },
          thickness: 1,
          color: lineColor,
        });
        yPosition -= 12;

        yPosition = addTextWithWrapping(pdfDoc, page, section.content, margin, yPosition, pageWidth - 2 * margin, bodyFontSize, timesRomanFont, secondaryColor);
        yPosition -= bodyFontSize * 2;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'competitors_data.pdf';
    link.click();
  };

  // Funções de manipulação de eventos
  const handleViewBrandVoice = (competitor: CompetitorsType) => {
    setModalContent({
      website: competitor.website,
      product: competitor.product || "N/A",
      location: competitor.location || "N/A",
      competitors: Array.isArray(competitor.competitors)
        ? competitor.competitors.filter(comp => typeof comp.name === "string" && typeof comp.url === "string")
        : [],
      socialMediaSummary: competitor.socialMediaSummary,
      websiteUrls: competitor.websiteUrls || [],
      extractedSocialLinks: competitor.extractedSocialLinks || [],
      competitorsWebsiteData: competitor.competitorsWebsiteData || [],
    });
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
      {/* Botões de exportação */}
      <HStack mb={4}>
        <Button onClick={exportToJson} bg={purple} color={white}>
          Export to JSON
        </Button>
        <Button onClick={exportToExcel} bg={purple} color={white}>
          Export to Excel
        </Button>
        <Button onClick={exportToPdf} bg={purple} color={white}>
          Export to PDF
        </Button>
      </HStack>

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
          <Text color={darkBlue}>No business analytics found.</Text>
        </Flex>
      ) : (
        currentCompetitors.map((competitor, index) => (
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
                    onClick={() => handleViewBrandVoice(competitor)}
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
        ))
      )}

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
        website={modalContent.website}
        product={modalContent.product}
        location={modalContent.location}
        competitors={modalContent.competitors}
        socialMediaSummary={modalContent.socialMediaSummary}
        websiteUrls={modalContent.websiteUrls}
        extractedSocialLinks={modalContent.extractedSocialLinks}
        competitorsWebsiteData={modalContent.competitorsWebsiteData}
      />

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
