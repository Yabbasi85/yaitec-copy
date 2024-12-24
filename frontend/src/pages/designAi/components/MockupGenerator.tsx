import { FC, useState } from "react";
import axios from "axios";
import {
  Flex,
  Select,
  Button,
  Spinner,
  Input,
  Box,
  FormLabel,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
  Text,
  Image,
  VStack,
  Heading,
  useToast,
  Wrap,
  WrapItem,
  Badge,
  RadioGroup,
  Stack,
  Radio,
  useTheme,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

type MockupTypeKey = 'logo' | 'website' | 'mobile-app' | 'business-card' | 'social-media';

interface MockupGeneratorProps {
  mockupType: MockupTypeKey | '';
  setMockupType: React.Dispatch<React.SetStateAction<MockupTypeKey | ''>>;
  handleGenerateMockup: () => Promise<void>;
  isGenerating: boolean;
}


const MockupGenerator: FC<MockupGeneratorProps> = ({}) => {
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [element, setElement] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [fonts, setFonts] = useState<string[]>([]);
  const [mockupType, setMockupType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [socialMedia, setSocialMedia] = useState("");
  const [postType, setPostType] = useState("");
  const [customColor, setCustomColor] = useState<string>("#000000");
  const [customColors, setCustomColors] = useState<
    { name: string; code: string }[]
  >([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();
  const theme = useTheme();

  const colorOptions = [
    { name: "White", code: theme.colors.brand.white },
    { name: "Dark Blue", code: theme.colors.brand.darkBlue },
    { name: "Purple", code: theme.colors.brand.purple },
    { name: "Electric Green", code: theme.colors.brand.electricGreen },
  ];

  const fontOptions = [
    "Montserrat Extralight",
    "Montserrat Light",
    "Montserrat Regular",
    "Montserrat Medium",
    "Montserrat Bold",
    "Montserrat Extrabold",
    "Montserrat Black",
    "Cropar Regular",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Tahoma",
  ];

  const handleColorToggle = (colorCode: string) => {
    if (colors.includes(colorCode)) {
      setColors(colors.filter((c) => c !== colorCode));
    } else {
      setColors([...colors, colorCode]);
    }
  };

  const handleAddCustomColor = () => {
    if (customColor) {
      const colorExists = customColors.find(
        (color) => color.code.toLowerCase() === customColor.toLowerCase()
      );
      if (!colorExists) {
        const newCustomColor = { name: customColor, code: customColor };
        setCustomColors([...customColors, newCustomColor]);
        handleColorToggle(customColor);
        toast({
          title: "Color Added",
          description: "Custom color has been added to your selection.",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Color Already Added",
          description: "This custom color is already in your selection.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleStyleChange = (selectedStyles: string[]) => {
    setStyles(selectedStyles);
  };

  const handleGenerateMockup = async () => {
    if (
      !product ||
      !brand ||
      !element ||
      colors.length === 0 ||
      styles.length === 0 ||
      fonts.length === 0 ||
      !mockupType ||
      !socialMedia
    ) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields before generating.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
      const response = await axios.post(`${apiUrl}/generate-image`, {
        product,
        brand,
        element,
        colors,
        styles,
        fonts,
        social_media: socialMedia,
        post_type: postType,
        mockup_type: mockupType,
      });
      setGeneratedImageUrl(response.data.image_url);
      toast({
        title: "Mockup Generated",
        description: "Your mockup has been successfully created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation Failed",
        description:
          "There was an error generating your mockup. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      gap={8}
      bg={theme.colors.brand.background}
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      fontFamily="'Futura PT', sans-serif"
    >
      <VStack spacing={6} align="stretch" flex={1}>
        <Heading as="h1" size="xl" color={theme.colors.brand.purple} textAlign="center">
          Packaging Design Generator
        </Heading>

        {/* Product Information */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
              Product Information
            </FormLabel>
            <Input
              placeholder="Enter product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <Input
              placeholder="Enter brand name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <Input
              placeholder="Enter element (e.g., spout bag)"
              value={element}
              onChange={(e) => setElement(e.target.value)}
            />
          </VStack>
        </Box>

        {/* Social Media Platform */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Social Media Platform
          </FormLabel>
          <RadioGroup onChange={setSocialMedia} value={socialMedia}>
            <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
              <Radio value="Facebook">
                <Flex align="center">
                  <FaFacebook style={{ marginRight: "8px" }} />
                  Facebook
                </Flex>
              </Radio>
              <Radio value="Twitter">
                <Flex align="center">
                  <FaTwitter style={{ marginRight: "8px" }} />
                  Twitter
                </Flex>
              </Radio>
              <Radio value="Instagram">
                <Flex align="center">
                  <FaInstagram style={{ marginRight: "8px" }} />
                  Instagram
                </Flex>
              </Radio>
              <Radio value="YouTube">
                <Flex align="center">
                  <FaYoutube style={{ marginRight: "8px" }} />
                  YouTube
                </Flex>
              </Radio>
            </SimpleGrid>
          </RadioGroup>
        </Box>

        {/* Post Type */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Post Type
          </FormLabel>
          <RadioGroup onChange={setPostType} value={postType}>
            <Stack direction={{ base: "column", sm: "row" }}>
              <Radio value="Post">Post</Radio>
              <Radio value="Story">Story</Radio>
            </Stack>
          </RadioGroup>
        </Box>

        {/* Color Selection */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Color
          </FormLabel>
          <Wrap spacing={4}>
            {[...colorOptions, ...customColors].map((colorItem) => (
              <WrapItem key={colorItem.code}>
                <Box
                  onClick={() => handleColorToggle(colorItem.code)}
                  cursor="pointer"
                  borderWidth={colors.includes(colorItem.code) ? "2px" : "1px"}
                  borderColor={
                    colors.includes(colorItem.code) ? theme.colors.brand.electricGreen : theme.colors.brand.purple
                  }
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ transform: "scale(1.05)" }}
                  transition="all 0.2s"
                  p={2}
                >
                  <Box
                    w="40px"
                    h="40px"
                    bg={colorItem.code}
                    borderRadius="md"
                    mb={2}
                  />
                  <Text fontSize="xs" color={theme.colors.brand.purple} textAlign="center">
                    {colorItem.name}
                  </Text>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
          <FormLabel fontSize="sm" color={theme.colors.brand.purple} fontWeight="bold" mt={4}>
            Add Custom Color
          </FormLabel>
          <Flex align="center">
            <Input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              w="50px"
              h="50px"
              p={0}
              border="none"
              bg="transparent"
            />
            <Button
              ml={4}
              colorScheme="purple"
              onClick={handleAddCustomColor}
            >
              Add Color
            </Button>
          </Flex>
        </Box>

        {/* Style Selection */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Style
          </FormLabel>
          <CheckboxGroup
            colorScheme="purple"
            value={styles}
            onChange={handleStyleChange}
          >
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
              <Checkbox value="Minimalist">Minimalist</Checkbox>
              <Checkbox value="Modern">Modern</Checkbox>
              <Checkbox value="Organic">Organic</Checkbox>
              <Checkbox value="Bold">Bold</Checkbox>
              <Checkbox value="Earthy">Earthy</Checkbox>
              <Checkbox value="Sustainable">Sustainable</Checkbox>
              <Checkbox value="Clean">Clean</Checkbox>
              <Checkbox value="Smart">Smart</Checkbox>
              <Checkbox value="Luxurious">Luxurious</Checkbox>
              <Checkbox value="Fun">Fun</Checkbox>
              <Checkbox value="Retro">Retro</Checkbox>
            </SimpleGrid>
          </CheckboxGroup>
        </Box>

        {/* Font Selection */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Font Selection
          </FormLabel>
          <CheckboxGroup
            colorScheme="purple"
            value={fonts}
            onChange={(value) => setFonts(value as string[])}
          >
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
              {fontOptions.map((font) => (
                <Checkbox key={font} value={font}>
                  {font}
                </Checkbox>
              ))}
            </SimpleGrid>
          </CheckboxGroup>
        </Box>

        {/* Mockup Type */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <FormLabel fontSize="md" color={theme.colors.brand.purple} fontWeight="bold">
            Mockup Type
          </FormLabel>
          <Select
            placeholder="Choose a design type"
            onChange={(e) => setMockupType(e.target.value)}
          >
            <option value="3D Render">3D Render</option>
            <option value="Flat Design">Flat Design</option>
            <option value="Photorealistic">Photorealistic</option>
          </Select>
        </Box>

        {/* Generate Button */}
        <Button
          colorScheme="purple"
          bgGradient={`linear(to-r, ${theme.colors.brand.electricGreen}, ${theme.colors.brand.purple})`}
          color={theme.colors.brand.white}
          _hover={{ bgGradient: `linear(to-r, #1A52FD, #1DCFFF)` }}
          onClick={handleGenerateMockup}
          isDisabled={isGenerating}
          height="50px"
          fontSize="lg"
          boxShadow="md"
        >
          {isGenerating ? (
            <Spinner size="md" color={theme.colors.brand.white} />
          ) : (
            "Generate & Analyze"
          )}
        </Button>
      </VStack>

      {/* Preview and Selected Options */}
      <VStack spacing={6} align="stretch" flex={1}>
        {/* Preview */}
        <Box
          bg={theme.colors.brand.white}
          p={6}
          borderRadius="md"
          boxShadow="md"
          minHeight="300px"
        >
          <Heading as="h2" size="lg" color={theme.colors.brand.purple} mb={4}>
            Preview
          </Heading>
          {generatedImageUrl ? (
            <Image
              src={generatedImageUrl}
              alt="Generated Mockup"
              maxW="100%"
              borderRadius="md"
            />
          ) : isGenerating ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Spinner size="xl" color={theme.colors.brand.purple} mb={4} />
              <Text color="gray.500">Generating your mockup...</Text>
            </Flex>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Text color="gray.500">
                Your generated mockup will appear here
              </Text>
            </Flex>
          )}
        </Box>

        {/* Selected Options */}
        <Box bg={theme.colors.brand.white} p={6} borderRadius="md" boxShadow="md">
          <Heading as="h2" size="lg" color={theme.colors.brand.purple} mb={4}>
            Selected Options
          </Heading>
          <VStack align="stretch" spacing={2}>
            <Text>
              <strong>Product:</strong> {product || "Not specified"}
            </Text>
            <Text>
              <strong>Brand:</strong> {brand || "Not specified"}
            </Text>
            <Text>
              <strong>Element:</strong> {element || "Not specified"}
            </Text>
            <Text>
              <strong>Colors:</strong>
            </Text>
            <Wrap>
              {colors.map((color) => (
                <WrapItem key={color}>
                  <Badge
                    bg={color}
                    color={color.toLowerCase() === "#ffffff" ? "black" : "white"}
                    variant="solid"
                    px={2}
                    py={1}
                  >
                    {color}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
            <Text>
              <strong>Styles:</strong>
            </Text>
            <Wrap>
              {styles.map((style) => (
                <WrapItem key={style}>
                  <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                    {style}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
            <Text>
              <strong>Fonts:</strong>
            </Text>
            <Wrap>
              {fonts.map((font) => (
                <WrapItem key={font}>
                  <Badge colorScheme="green" variant="solid" px={2} py={1}>
                    {font}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
            <Text>
              <strong>Mockup Type:</strong> {mockupType || "Not specified"}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default MockupGenerator;
