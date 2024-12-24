import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Chapter {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface ChapterAccordionProps {
  chapters: Chapter[];
  handleMoveChapter: (index: number, direction: "up" | "down") => void;
  handleEditChapter: (index: number) => void;
  handleDeleteChapter: (index: number) => void;
}

const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapters,
  handleMoveChapter,
  handleEditChapter,
  handleDeleteChapter,
}) => {
  const bgColor = useColorModeValue("#FFFFFF", "#082a46");
  const borderColor = useColorModeValue("#5541ff", "#00ff89");
  const hoverBgColor = useColorModeValue("#F4F4F5", "#082a46");
  const textColor = useColorModeValue("#111111", "#FFFFFF");

  const formatContentPlan = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.includes(":")) {
        const [label, value] = line.split(":");
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2} color={textColor}>
            <Text as="span" fontWeight="bold">{label.trim()}:</Text> {value.trim()}
          </Text>
        );
      } else {
        return (
          <Text as="p" key={index} whiteSpace="pre-line" mb={2} color={textColor}>
            {line.trim()}
          </Text>
        );
      }
    });
  };

  return (
    <Accordion allowMultiple>
      {chapters.map((chapter, index) => (
        <AccordionItem
          key={chapter.id}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          mb={4}
          overflow="hidden"
        >
          <h2>
            <AccordionButton
              _expanded={{ bg: hoverBgColor }}
              _hover={{ bg: hoverBgColor }}
            >
              <Box flex="1" textAlign="left">
                <HStack spacing={2}>
                  <Badge colorScheme="purple" fontSize="0.8em" px={2} py={1}>
                    Chapter {index + 1}
                  </Badge>
                  <Text fontWeight="bold" color={textColor}>{chapter.title}</Text>
                </HStack>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <VStack align="stretch" spacing={4}>
              {chapter.image && (
                <Image
                  src={chapter.image}
                  alt={`Image for ${chapter.title}`}
                  maxH="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <Box>{formatContentPlan(chapter.content)}</Box>
              <Flex justify="flex-end">
                <IconButton
                  aria-label="Move chapter up"
                  icon={<FaArrowUp />}
                  onClick={() => handleMoveChapter(index, "up")}
                  isDisabled={index === 0}
                  mr={2}
                  size="sm"
                  bg="#5541ff"
                  color="white"
                  _hover={{ bg: "#00ff89" }}
                />
                <IconButton
                  aria-label="Move chapter down"
                  icon={<FaArrowDown />}
                  onClick={() => handleMoveChapter(index, "down")}
                  isDisabled={index === chapters.length - 1}
                  mr={2}
                  size="sm"
                  bg="#5541ff"
                  color="white"
                  _hover={{ bg: "#00ff89" }}
                />
                <IconButton
                  aria-label="Edit chapter"
                  icon={<FaEdit />}
                  bg="#5541ff"
                  color="white"
                  _hover={{ bg: "#00ff89" }}
                  onClick={() => handleEditChapter(index)}
                  mr={2}
                  size="sm"
                />
                <IconButton
                  aria-label="Delete chapter"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleDeleteChapter(index)}
                  size="sm"
                />
              </Flex>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;
