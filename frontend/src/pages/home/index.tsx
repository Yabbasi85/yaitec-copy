import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Icon,
  LinkBox,
  LinkOverlay,
  useTheme,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiMic,
  FiTrendingUp,
  FiBarChart2,
  FiPenTool,
  FiUserCheck,
  FiBookOpen,
  FiSettings,
  FiPieChart,
} from "react-icons/fi";
import { IconType } from "react-icons";
import createTheme from "../../styles/theme";

interface MenuItemProps {
  title: string;
  icon: IconType;
  to: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, to }) => {
  const theme = createTheme("brand1");
  const bgColor = useColorModeValue(theme.colors.brand.white, theme.colors.brand.darkBlue);
  const borderColor = useColorModeValue(theme.colors.brand.purple, theme.colors.brand.electricGreen);
  const hoverBg = useColorModeValue(`${theme.colors.brand.purple}20`, `${theme.colors.brand.electricGreen}20`);
  const textColor = useColorModeValue(theme.colors.brand.darkBlue, theme.colors.brand.white);

  return (
    <LinkBox
      as="article"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        bg: hoverBg,
      }}
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={4}>
        <Icon
          as={icon}
          w={10}
          h={10}
          color={borderColor}
          _hover={{ color: theme.colors.brand.electricGreen }}
        />
        <LinkOverlay as={Link} to={to}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            {title}
          </Text>
        </LinkOverlay>
      </VStack>
    </LinkBox>
  );
};

const HomePage = () => {
  const theme = useTheme();
  const bgGradient = useColorModeValue(
    `linear(to-br, ${theme.colors.brand.white}, ${theme.colors.brand.purple}20)`,
    `linear(to-br, ${theme.colors.brand.darkBlue}, ${theme.colors.brand.purple}20)`
  );
  const textColor = useColorModeValue(theme.colors.brand.darkBlue, theme.colors.brand.white);

  const menuItems = [
    { title: "Competitors Panel", icon: FiUsers, to: "/competitors" },
    { title: "Business Analytics", icon: FiPieChart, to: "/business-analytics" },
    { title: "Content Creation", icon: FiFileText, to: "/content-creation" },
    { title: "Voice AI", icon: FiMic, to: "/vapi-voice" },
    { title: "Marketing Campaign", icon: FiTrendingUp, to: "/marketing-campaign" },
    { title: "Dashboard Analytics", icon: FiBarChart2, to: "/dashboard-analytics" },
    { title: "Design AI", icon: FiPenTool, to: "/design-ai" },
    { title: "Lead Management", icon: FiUserCheck, to: "/lead-management" },
    { title: "Ebook Creation", icon: FiBookOpen, to: "/ebook-creation" },
    { title: "Admin Panel", icon: FiSettings, to: "/admin-panel" },
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Flex direction="column" align="center" justify="center" minH="100vh" p={8}>
        <VStack spacing={6} mb={12} textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl" }}
            fontWeight="bold"
            color={textColor}
          >
            Content Creator Dashboard
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} maxW="2xl">
            Empower your content strategy with our advanced tools and analytics.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full" maxW="1200px">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default HomePage;
