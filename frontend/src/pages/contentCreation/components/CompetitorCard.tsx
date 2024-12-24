import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { CompetitorsResponse } from "../../../@global/@types/ApiResponses";

export const CompetitorCard = ({
  competitor,
  handleRemoveCompetitor,
}: {
  competitor: CompetitorsResponse;
  handleRemoveCompetitor: (id: string) => void;
}) => {
  // Usar cores do tema
  const borderColor = useColorModeValue("brand.purple", "purple.700");
  const textColor = useColorModeValue("brand.purple", "purple.700");

  return (
    <Flex
      key={competitor.id}
      border={"1px solid"}
      borderColor={borderColor}
      padding={"8px"}
      borderRadius={"8px"}
      flexDir={"column"}
      alignItems={"flex-start"}
      w={"full"}
      h={"100px"}
      justify={"center"}
    >
      <Flex justify={"space-between"} w={"100%"}>
        <Text color={textColor} whiteSpace={"wrap"} wordBreak={"break-word"}>
          <span style={{ fontWeight: "bold" }}>Name: </span>
          {competitor.name}
        </Text>
        <Icon
          as={IoMdClose}
          onClick={() => handleRemoveCompetitor(competitor.id)}
          color={textColor}
          cursor={"pointer"}
          mt="4px"
        />
      </Flex>
      <Text color={textColor} whiteSpace={"wrap"} wordBreak={"break-word"}>
        <span style={{ fontWeight: "bold" }}>Social media: </span>
        {competitor.social_media}
      </Text>
      <Text color={textColor} whiteSpace={"wrap"} wordBreak={"break-word"}>
        <span style={{ fontWeight: "bold" }}>Website: </span>
        {competitor.website}
      </Text>
    </Flex>
  );
};
