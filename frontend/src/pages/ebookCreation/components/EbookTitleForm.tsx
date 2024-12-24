import React from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";

interface EbookTitleFormProps {
  ebookTitle: string;
  setEbookTitle: (title: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  category: string;
  setCategory: (category: string) => void;
  error: string;
}

const EbookTitleForm: React.FC<EbookTitleFormProps> = ({
  ebookTitle,
  setEbookTitle,
  theme,
  setTheme,
  category,
  setCategory,
  error,
}) => {
  return (
    <>
      {/* Campo para o título do ebook */}
      <FormControl isInvalid={!!error} mb={4}>
        <FormLabel>Ebook Title</FormLabel>
        <Input
          placeholder="Enter ebook title"
          value={ebookTitle}
          onChange={(e) => setEbookTitle(e.target.value)}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>

      {/* Campo para o tema do ebook */}
      <FormControl mb={4}>
        <FormLabel>Theme</FormLabel>
        <Input
          placeholder="Enter theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
      </FormControl>

      {/* Campo para a categoria do ebook */}
      <FormControl mb={4}>
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </Select>
      </FormControl>
    </>
  );
};

export default EbookTitleForm;
