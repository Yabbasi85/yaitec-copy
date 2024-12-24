import { Flex } from "@chakra-ui/react";
import ContentCreationForm from "./components/CreateContentForm";
import { SocialMediaTabs } from "./components/SocialMediaTabs";

export const ContentCreationPage = () => {
  return (
    <Flex w={"100%"} flexDir={"column"} gap={"32px"}>
      <ContentCreationForm />
      <SocialMediaTabs />
    </Flex>
  );
};

export default ContentCreationPage;
