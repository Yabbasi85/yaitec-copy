import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Button,
  Heading,
  Text,
  Container,
  useToast,
  Flex,
  Icon,
  useTheme,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";
import EbookTitleForm from "./components/EbookTitleForm";
import ChapterForm from "./components/ChapterForm";
import ChapterAccordion from "./components/ChapterAccordion";
import GeneratePDFButton from "./components/GeneratePDFButton";

interface Chapter {
  id: string;
  title: string;
  content: string;
  image?: string;
  theme: string;
  category: string;
}

const steps = [
  { title: "Ebook Details", description: "Set your ebook title and metadata" },
  { title: "Add Chapters", description: "Create and organize your chapters" },
  { title: "Review", description: "Review and generate your ebook" },
];

const IntuitiveEbookCreationWizard: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [ebookTitle, setEbookTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [category, setCategory] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterImage, setChapterImage] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const themeStyles = useTheme();

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const bgColor = themeStyles.colors.brand.background;
  const cardBgColor = themeStyles.colors.brand.white;
  const accentColor = themeStyles.colors.brand.electricGreen;

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/ebooks/`);
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load previous work.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateChapter = async () => {
    if (!chapterTitle || !chapterContent) {
      toast({
        title: "Error",
        description: "Please fill out all chapter fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const chapterData = {
      title: chapterTitle,
      content: chapterContent,
      image: chapterImage
        ? await convertImageToBase64(chapterImage)
        : undefined,
      category,
      theme,
    };

    setIsLoading(true);
    try {
      let response;
      if (editingIndex !== null) {
        response = await fetch(
          `${apiUrl}/ebooks/${chapters[editingIndex].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chapterData),
          }
        );
      } else {
        response = await fetch(`${apiUrl}/ebooks/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chapterData),
        });
      }

      if (!response.ok)
        throw new Error(
          editingIndex !== null
            ? "Failed to update chapter"
            : "Failed to add chapter"
        );

      const updatedChapter = await response.json();

      if (editingIndex !== null) {
        const updatedChapters = [...chapters];
        updatedChapters[editingIndex] = updatedChapter;
        setChapters(updatedChapters);
        toast({
          title: "Chapter updated",
          description: "Your chapter has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setChapters([...chapters, updatedChapter]);
        toast({
          title: "Chapter added",
          description: "Your chapter has been added to the ebook.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      resetChapterForm();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingIndex !== null ? "update" : "add"} chapter.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChapter = (index: number) => {
    const chapter = chapters[index];
    setChapterTitle(chapter.title);
    setChapterContent(chapter.content);
    setEditingIndex(index);
  };

  const handleDeleteChapter = async (index: number) => {
    const chapterToDelete = chapters[index];
    try {
      const response = await fetch(`${apiUrl}/ebooks/${chapterToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete chapter");

      const updatedChapters = chapters.filter((_, i) => i !== index);
      setChapters(updatedChapters);
      toast({
        title: "Chapter Deleted",
        description: `Chapter "${chapterToDelete.title}" has been successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete chapter.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const convertImageToBase64 = (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  };

  const resetChapterForm = () => {
    setChapterTitle("");
    setChapterContent("");
    setChapterImage(null);
    setEditingIndex(null);
  };

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    const newChapters = [...chapters];
    if (direction === "up" && index > 0) {
      [newChapters[index - 1], newChapters[index]] = [
        newChapters[index],
        newChapters[index - 1],
      ];
    } else if (direction === "down" && index < chapters.length - 1) {
      [newChapters[index], newChapters[index + 1]] = [
        newChapters[index + 1],
        newChapters[index],
      ];
    }
    setChapters(newChapters);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <EbookTitleForm
            ebookTitle={ebookTitle}
            setEbookTitle={setEbookTitle}
            theme={theme}
            setTheme={setTheme}
            category={category}
            setCategory={setCategory}
            error={""}
          />
        );
      case 1:
        return (
          <VStack spacing={6} align="stretch">
            <ChapterForm
              chapterTitle={chapterTitle}
              setChapterTitle={setChapterTitle}
              chapterContent={chapterContent}
              setChapterContent={setChapterContent}
              setChapterImage={setChapterImage}
              handleAddChapter={handleAddOrUpdateChapter}
              editingIndex={editingIndex}
              isLoading={isLoading}
            />
            <ChapterAccordion
              chapters={chapters}
              handleMoveChapter={handleMoveChapter}
              handleEditChapter={handleEditChapter}
              handleDeleteChapter={handleDeleteChapter}
            />
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md">Ebook Summary</Heading>
            <Text>
              <strong>Title:</strong> {ebookTitle}
            </Text>
            <Text>
              <strong>Theme:</strong> {theme}
            </Text>
            <Text>
              <strong>Category:</strong> {category}
            </Text>
            <Text>
              <strong>Number of Chapters:</strong> {chapters.length}
            </Text>
            <GeneratePDFButton
              ebookTitle={ebookTitle}
              chapters={chapters}
              toast={toast}
            />
          </VStack>
        );
      default:
        return null;
    }
  };

  return (
    <Box bg={bgColor} minHeight="100vh" py={[4, 8, 12]}>
      <Container
        maxW={{ base: "container.sm", md: "container.md", lg: "container.xl" }}
        px={[4, 6, 8]}
      >
        <VStack spacing={[4, 6, 8]} align="stretch">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              size={{ base: "lg", md: "xl", lg: "2xl" }}
              color={themeStyles.colors.brand.purple}
              textAlign="center"
            >
              <Icon as={FaBook} mr={4} />
              Ebook Creation Studio
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              color={themeStyles.colors.brand.text}
              textAlign="center"
            >
              Craft your masterpiece: Add, edit, and organize your chapters with
              ease.
            </Text>
          </motion.div>
          <Box
            bg={cardBgColor}
            p={{ base: 4, md: 6, lg: 8 }}
            borderRadius="xl"
            boxShadow="xl"
            border={`2px solid ${accentColor}`}
            width="100%"
            maxW="full"
          >
            <Stepper
              index={activeStep}
              colorScheme="purple"
              size={{ base: "sm", md: "md", lg: "lg" }}
              width="100%"
              maxW="full"
              flexWrap={{ base: "wrap", md: "nowrap" }}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box
                    flexShrink="0"
                    textAlign="center"
                    px={{ base: 2, md: 4 }}
                  >
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box
            bg={cardBgColor}
            p={[4, 6, 8]}
            borderRadius="xl"
            boxShadow="xl"
            border={`2px solid ${accentColor}`}
            width="100%"
            maxW="full"
          >
            {renderStepContent(activeStep)}
          </Box>

          <Flex justify="space-between" width="100%" maxW="full">
            <Button
              onClick={() => setActiveStep(activeStep - 1)}
              isDisabled={activeStep === 0}
              size={{ base: "sm", md: "md" }}
            >
              Previous
            </Button>
            <Button
              onClick={() => setActiveStep(activeStep + 1)}
              isDisabled={
                activeStep === steps.length - 1 ||
                (activeStep === 0 && (!ebookTitle || !theme || !category))
              }
              size={{ base: "sm", md: "md" }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default IntuitiveEbookCreationWizard;
