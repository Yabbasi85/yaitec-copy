import {
  Heading,
  Input,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  FormErrorMessage,
  Icon,
  Tooltip,
  Box,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import CompetitorsList from "./components/CompetitorsList";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiMinusSquare } from "react-icons/fi";
import { useCreateCompetitors } from "../../@global/api/hooks/competitors/useCreateCompetitors";

const CompetitorsPage = () => {
  const { context, mutate, isLoading } = useCreateCompetitors();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset, 
    formState: { errors },
  } = context;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "competitors",
  });

  const toast = useToast();

  const onSubmit = async () => {
    try {
      const competitors = getValues("competitors") || [];
      mutate(
        { competitors },
        {
          onSuccess: () => {
            reset();
            toast({
              title: "Success!",
              description: "Competitors added successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          },
          onError: () => {
            toast({
              title: "Error!",
              description: "Failed to add competitors.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isError = (index: number) => {
    return (
      !!errors.competitors?.[index]?.name ||
      !!errors.competitors?.[index]?.website ||
      !!errors.competitors?.[index]?.social_media
    );
  };

  // Usar cores do tema
  const purple = useColorModeValue("brand.purple", "purple.700");
  const electricGreen = useColorModeValue("brand.electricGreen", "green.400");
  const white = useColorModeValue("brand.white", "gray.800");
  const darkBlue = useColorModeValue("brand.darkBlue", "white");

  return (
    <Flex w="100%" gap="24px" flexDir="column" p={{ base: "4", md: 8 }}>
      <Flex flexDir="column" w="100%" gap="16px">
        <Flex align="center">
          <Heading color={purple}>Competitors</Heading>
          <Box position="relative" display="inline-block" ml={2}>
            <Tooltip
              label="The competitors allows users to input detailed information about their competitors, 
  including name, website, and social media profiles, to build a comprehensive competitor analysis list. 
  The page supports adding multiple competitors dynamically, making it easy to manage and submit this data 
  to the backend for analysis and strategic decision-making."
              placement="right"
              hasArrow
              bg={white}
              color={darkBlue}
            >
              <Flex>
                <Icon as={IoInformationCircleOutline} color={electricGreen} />
              </Flex>
            </Tooltip>
          </Box>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap="16px">
            <Heading size="md" color={darkBlue}>
              Add Competitors
            </Heading>
            {fields.map((item, index) => (
              <Grid
                key={item.id}
                gap="16px"
                gridTemplateColumns={{
                  base: "1fr auto",
                  md: "1fr auto",
                }}
                w="100%"
                alignItems="flex-end"
              >
                <Grid
                  gridTemplateColumns={{
                    base: "1fr",
                    md: "1fr 1fr 1fr",
                  }}
                  gap="16px"
                  w="100%"
                >
                  {/* Campos de Formulário */}
                  <FormControl isInvalid={!!errors.competitors?.[index]?.name}>
                    <FormLabel color={darkBlue}>Name</FormLabel>
                    <Input
                      placeholder="Enter competitor's name"
                      {...register(`competitors.${index}.name`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage>
                      {errors.competitors?.[index]?.name?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.competitors?.[index]?.website}
                  >
                    <FormLabel>Website</FormLabel>
                    <Input
                      placeholder="Enter competitor's website"
                      {...register(`competitors.${index}.website`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage>
                      {errors.competitors?.[index]?.website?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.competitors?.[index]?.social_media}
                  >
                    <FormLabel>Social Media</FormLabel>
                    <Input
                      placeholder="Enter competitor's social media"
                      {...register(`competitors.${index}.social_media`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage m={0}>
                      {errors.competitors?.[index]?.social_media?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>
                <Flex
                  h={isError(index) ? "100px" : "48px"}
                  align="center"
                  justify="center"
                >
                  <Icon
                    as={FiMinusSquare}
                    onClick={() => {
                      if (!isLoading) {
                        remove(index);
                      }
                    }}
                    color="red.500"
                    fontSize="32px"
                    cursor="pointer"
                  />
                </Flex>
              </Grid>
            ))}
            <Flex w="100%" justify="flex-end" gap="12px" flexWrap="wrap">
              <Button
                type="button"
                onClick={() =>
                  append({ name: "", website: "", social_media: "" })
                }
                alignSelf="flex-start"
                w={{ base: "100%", md: "200px" }}
                h="48px"
                leftIcon={<AiOutlinePlus />}
                isDisabled={isLoading}
              >
                Add Competitor
              </Button>
              <Button
                type="submit"
                alignSelf="flex-end"
                w={{ base: "100%", md: "200px" }}
                h="48px"
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Send Competitors
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
      <Flex gap="12px" flexWrap="wrap">
        <Flex flexDir="column" flex="1" transition="flex 0.3s ease" w="100%">
          <CompetitorsList isLoading={isLoading} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CompetitorsPage;