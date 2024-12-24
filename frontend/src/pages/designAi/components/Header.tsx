import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const Header = () => {
  const bgColor = useColorModeValue("brand.white", "brand.darkBlue");
  const textColor = useColorModeValue("brand.darkBlue", "brand.white");
  const headingColor = "brand.purple";

  return (
    <Box
      textAlign="center"
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading
        as="h1"
        size="2xl"
        color={headingColor}
        fontFamily="'Cropar', sans-serif"
        mb={2}
      >
        Design AI and Brand Guardian
      </Heading>
      <Text
        fontSize="xl"
        color={textColor}
        fontFamily="'Futura PT', sans-serif"
      >
        Generate and analyze designs for brand consistency
      </Text>
    </Box>
  );
};

export default Header;
