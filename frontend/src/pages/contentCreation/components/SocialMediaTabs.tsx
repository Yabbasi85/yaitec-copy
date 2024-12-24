import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Flex,
  Text,
  Spinner,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaFacebookSquare,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { useGetSingleContent } from "../../../@global/api/hooks/content/useGetSingleContent";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export const SocialMediaTabs = () => {
  const tabs = [
    { name: "Facebook", icon: FaFacebookSquare },
    { name: "Twitter", icon: FaTwitter },
    { name: "Instagram", icon: FaInstagram },
    { name: "YouTube", icon: FaYoutube },
    { name: "LinkedIn", icon: FaLinkedin },
  ];

  const [selectedTab, setSelectedTab] = useState<string>("Facebook");

  // Usando cores do tema
  const cardBgColor = useColorModeValue("brand.white", "brand.darkBlue");
  const borderColor = useColorModeValue("brand.purple", "brand.electricGreen");
  const tabColor = useColorModeValue("brand.purple", "brand.electricGreen");
  const hoverBorderColor = useColorModeValue("brand.electricGreen", "brand.purple");

  const { data, isLoading } = useGetSingleContent({
    single: true,
    type: selectedTab,
  });

  return (
    <Box
      overflowX="auto"
      bg={cardBgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      borderColor={borderColor}
    >
      <Tabs variant="soft-rounded" colorScheme="purple">
        <TabList
          w={"100%"}
          display={"grid"}
          gridTemplateColumns={"repeat(5, 1fr)"}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              bg="transparent"
              border={`1px solid ${tabColor}`}
              _hover={{ borderColor: hoverBorderColor }}
              borderRadius="8px"
              mr={2}
              onClick={() => {
                setSelectedTab(tab.name);
              }}
            >
              <Flex align="center">
                <Icon as={tab.icon} color={tabColor} mr={2} />
                <Text>{tab.name}</Text>
              </Flex>
            </Tab>
          ))}
        </TabList>
        <TabPanels mt={4}>
          {tabs.map((tab) => (
            <TabPanel key={tab.name}>
              {isLoading ? (
                <Spinner
                  size="xl"
                  alignSelf="center"
                  color={useColorModeValue("black", "white")}
                  thickness="4px"
                  speed="0.65s"
                />
              ) : data ? (
                <ReactMarkdown>{data?.content}</ReactMarkdown>
              ) : (
                "Content isn't created yet"
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
