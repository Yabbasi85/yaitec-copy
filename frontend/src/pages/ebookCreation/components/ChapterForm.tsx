import React from "react";
import { FormControl, FormLabel, Input, Textarea, Button, Stack, Spinner } from "@chakra-ui/react";

interface ChapterFormProps {
  chapterTitle: string;
  setChapterTitle: (title: string) => void;
  chapterContent: string;
  setChapterContent: (content: string) => void;
  setChapterImage: (image: File | null) => void;
  handleAddChapter: () => void;
  editingIndex: number | null;
  isLoading: boolean;
}

const ChapterForm: React.FC<ChapterFormProps> = ({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  handleAddChapter,
  editingIndex,
  isLoading
}) => {
  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Chapter Title</FormLabel>
        <Input
          placeholder="Enter chapter title"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Chapter Content</FormLabel>
        <Textarea
          placeholder="Enter chapter content"
          value={chapterContent}
          onChange={(e) => setChapterContent(e.target.value)}
          rows={6}
          border="1px solid #5541ff"
          _hover={{ borderColor: "#00ff89" }}
          _focus={{
            borderColor: "#00ff89",
            boxShadow: "0 0 0 1px #00ff89",
          }}
          borderRadius="8px"
        />
      </FormControl>

      <Button
        colorScheme="purple"
        onClick={handleAddChapter}
        bgGradient="linear(to-r, #00ff89, #5541ff)"
        _hover={{ bgGradient: "linear(to-r, #1DCFFF, #5541ff)" }}
        h="48px"
        borderRadius="8px"
        isDisabled={isLoading}
      >
        {isLoading ? (
          <Spinner size="sm" color="white" />
        ) : (
          editingIndex !== null ? "Update Chapter" : "Add Chapter"
        )}
      </Button>
    </Stack>
  );
};

export default ChapterForm;
