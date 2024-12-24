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
import CompetitorsList from "./components/BusinessAnalyticsList";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiMinusSquare } from "react-icons/fi";
import { useCreateBusinessAnalytics } from "../../@global/api/hooks/businessAnalytics/useCreateBusinessAnalytics";

const BusinessPage = () => {
  const { context, mutate, isLoading } = useCreateBusinessAnalytics();
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
    let delayToast: string | number | NodeJS.Timeout | undefined;
  
    try {
      const competitors = getValues("competitors") || [];
  
      delayToast = setTimeout(() => {
        reset();
        toast({
          title: "Please Wait",
          description: "The competitors is being processed. It will appear in your list in a few minutes.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }, 5000);

      mutate(
        { competitors },
        {
          onSuccess: () => {
            clearTimeout(delayToast); 
            reset();
            toast({
              title: "Success!",
              description: "Competitors added successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    } catch (error) {
      clearTimeout(delayToast);
      console.error("Error:", error);
    }
  };  
  

  const isError = (index: number) => {
    return (
      !!errors.competitors?.[index]?.name ||
      !!errors.competitors?.[index]?.website ||
      !!errors.competitors?.[index]?.social_media ||
      !!errors.competitors?.[index]?.location ||
      !!errors.competitors?.[index]?.product
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
          <Heading color={purple}>Business Analytics</Heading>
          <Box position="relative" display="inline-block" ml={2}>
            <Tooltip
              label="The business analytics section allows users to input detailed information about their analytics needs, 
  including name, website, and social media profiles, to build a comprehensive analytics list. 
  The page supports adding multiple entries dynamically, making it easy to manage and submit this data 
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
              Add Business Analytics
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
                      placeholder="Enter business analytics name"
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
                      placeholder="Enter business analytics website"
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
                      placeholder="Enter business analytics social media"
                      {...register(`competitors.${index}.social_media`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage m={0}>
                      {errors.competitors?.[index]?.social_media?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.competitors?.[index]?.product}>
                    <FormLabel>Product</FormLabel>
                    <Input
                      placeholder="Enter product name"
                      {...register(`competitors.${index}.product`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage m={0}>
                      {errors.competitors?.[index]?.product?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.competitors?.[index]?.location}>
                    <FormLabel>Location</FormLabel>
                    <Input
                      placeholder="Enter location name"
                      {...register(`competitors.${index}.location`)}
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage m={0}>
                      {errors.competitors?.[index]?.location?.message}
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
                  append({ name: "", website: "", social_media: "", product: "", location: "" })
                }
                alignSelf="flex-start"
                w={{ base: "100%", md: "200px" }}
                h="48px"
                leftIcon={<AiOutlinePlus />}
                isDisabled={isLoading}
              >
                Add Business Analytics
              </Button>
              <Button
                type="submit"
                alignSelf="flex-end"
                w={{ base: "100%", md: "200px" }}
                h="48px"
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Send Business Analytics
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

export default BusinessPage;
