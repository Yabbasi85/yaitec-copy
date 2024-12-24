import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
  Checkbox,
  Icon,
  Input,
  Grid,
  FormErrorMessage,
  Box,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaFacebookSquare,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { CompetitorsResponse } from "../../../@global/@types/ApiResponses";
import { CompetitorCard } from "./CompetitorCard";
import { CreateContentProgressModal } from "./CreateContentProgressModal";
import { useListCompetitors } from "../../../@global/api/hooks/competitors/useListCompetitors";
import { useCreateContent } from "../../../@global/api/hooks/content/useCreateContent";

type SocialMediaOptionsType = {
  label: string;
  value: string;
  icon: IconType;
};

const socialMediaOptions: SocialMediaOptionsType[] = [
  { label: "Facebook", value: "Facebook", icon: FaFacebookSquare },
  { label: "Twitter", value: "Twitter", icon: FaTwitter },
  { label: "Instagram", value: "Instagram", icon: FaInstagram },
  { label: "YouTube", value: "YouTube", icon: FaYoutube },
  { label: "LinkedIn", value: "LinkedIn", icon: FaLinkedin },
];

const ContentCreationForm = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const { mutate, context, isLoading, status } = useCreateContent();
  const {
    control,
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = context;

  const {
    fields: selectedCompetitorFields,
    append: appendCompetitor,
    remove: removeCompetitor,
  } = useFieldArray({
    control,
    name: "selectedCompetitors",
  });

  const [goalFields, setGoalFields] = useState<string[]>([]);
  const [availableCompetitors, setAvailableCompetitors] = useState<
    CompetitorsResponse[]
  >([]);
  const selectedPlatforms = watch("platforms") || [];
  const competitorsIds = watch("competitors_ids") || [];

  const { data: competitors } = useListCompetitors();

  useEffect(() => {
    if (competitors && competitors.length && !availableCompetitors.length) {
      setAvailableCompetitors(competitors);
    }
  }, [competitors, availableCompetitors.length]);

  // Cores usando useColorModeValue
  const primaryColor = useColorModeValue("brand.purple", "purple.700");
  const hoverColor = useColorModeValue("brand.electricGreen", "green.400");
  const labelColor = useColorModeValue("brand.electricGreen", "green.400");

  const handleSelectCompetitor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCompetitor = availableCompetitors.find(
      (c) => c.id === selectedId,
    );

    if (selectedCompetitor) {
      appendCompetitor(selectedCompetitor);
      setValue("competitors_ids", [...competitorsIds, selectedCompetitor.id]);
      const removeSelected = availableCompetitors.filter(
        (c) => c.id !== selectedId,
      );
      setAvailableCompetitors(removeSelected);
      clearErrors("competitors_ids");
      e.target.value = "";
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    const removedCompetitor = selectedCompetitorFields[index];
    removeCompetitor(index);
    setAvailableCompetitors((prev) => [...prev, removedCompetitor]);
    setValue(
      "competitors_ids",
      competitorsIds.filter((id) => id !== removedCompetitor.id),
    );
  };

  const handleSelectAllPlatforms = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValue(
        "platforms",
        socialMediaOptions.map((option) => option.value),
      );
    } else {
      setValue("platforms", []);
    }
  };

  const handlePlatformChange = (value: string) => {
    const updatedPlatforms = selectedPlatforms.includes(value)
      ? selectedPlatforms.filter((platform) => platform !== value)
      : [...selectedPlatforms, value];
    setValue("platforms", updatedPlatforms);
  };

  const handleAddGoal = () => {
    const goal = getValues("newGoal");
    if (goal && goal.length >= 3) {
      setGoalFields((prev) => [...prev, goal]);
      setValue("newGoal", "");
      clearErrors("goals");
    } else {
      setError("goals", {
        type: "manual",
        message: "Goals should be at least 3 characters long",
      });
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoalFields((prev) => prev.filter((_, i) => i !== index));
  };

  const [startTime, setStartTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: any;

    if (isLoading && startTime) {
      intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min((elapsedTime / 50000) * 100, 99);
        setProgress(newProgress);
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading, startTime]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (status === "success") {
      setIsAccordionOpen(false);
      setProgress(100);
      setTimeout(() => onClose(), 500);
      context.reset();
    } else if (status === "error") {
      setProgress(100);
      setTimeout(() => onClose(), 500);
    }
  }, [status, onClose]);

  const onSubmit = () => {
    const payload = context.getValues();
    onOpen();
    setProgress(0);
    setStartTime(Date.now());
    mutate(payload);
  };

  return (
    <>
      <Accordion
        allowToggle
        index={isAccordionOpen ? [0] : []}
        onChange={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="lg" color={primaryColor}>
                  Content Creation Form
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex w="100%" flexDir="column" gap="16px">
                <FormControl isInvalid={!!errors.platforms}>
                  <FormLabel>
                    Select Social Media Platforms
                    <Text as="span" color={labelColor}>
                      *
                    </Text>
                  </FormLabel>
                  <Flex flexDir="row" gap="16px" wrap="wrap">
                    <Checkbox
                      isChecked={
                        selectedPlatforms.length === socialMediaOptions.length
                      }
                      onChange={handleSelectAllPlatforms}
                      colorScheme="purple"
                    >
                      Select All
                    </Checkbox>
                    {socialMediaOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        isChecked={selectedPlatforms.includes(option.value)}
                        onChange={() => handlePlatformChange(option.value)}
                        colorScheme="purple"
                      >
                        <Icon as={option.icon} mr="8px" />
                        {option.label}
                      </Checkbox>
                    ))}
                  </Flex>
                  <FormErrorMessage>
                    {errors.platforms && "Please select at least one platform"}
                  </FormErrorMessage>
                </FormControl>

                <Flex flexDir="column" gap="8px">
                  <FormControl isInvalid={!!errors.competitors_ids}>
                    <FormLabel margin={0} display="flex">
                      Select Competitors
                      <Text as="span" color={labelColor}>
                        *
                      </Text>
                    </FormLabel>
                    <Select
                      placeholder="Select competitors"
                      onChange={handleSelectCompetitor}
                    >
                      {availableCompetitors.map((competitor) => (
                        <option key={competitor.id} value={competitor.id}>
                          {competitor.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors.competitors_ids &&
                        "Please select at least one competitor"}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex gap="8px" flexWrap="wrap" flexDir="column">
                    <Heading size="xs">Main Competitors</Heading>
                    <Grid
                      maxH={"200px"}
                      overflowY={"auto"}
                      columnGap={"16px"}
                      rowGap={"8px"}
                      w={"100%"}
                      gridTemplateColumns={"repeat(4, 1fr)"}
                    >
                      {selectedCompetitorFields.map((item, index) => (
                        <CompetitorCard
                          key={item.id}
                          competitor={item}
                          handleRemoveCompetitor={() =>
                            handleRemoveCompetitor(index)
                          }
                        />
                      ))}
                    </Grid>
                  </Flex>
                </Flex>

                <FormControl isInvalid={!!errors.campaign_duration}>
                  <FormLabel>
                    Campaign Duration (in month)
                    <Text as="span" color={labelColor}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter campaign duration"
                    {...register("campaign_duration", {
                      required: "Campaign duration is required",
                      min: {
                        value: 1,
                        message: "Duration must be at least 1 day",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.campaign_duration &&
                      errors.campaign_duration.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.posts_per_month}>
                  <FormLabel>
                    Posts Per Month
                    <Text as="span" color={labelColor}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter posts per month"
                    {...register("posts_per_month", {
                      required: "Posts per month is required",
                      min: {
                        value: 1,
                        message: "Must be at least 1 post per month",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.posts_per_month && errors.posts_per_month.message}
                  </FormErrorMessage>
                </FormControl>

                <Flex flexDir="column" gap="16px">
                  <FormControl isInvalid={!!errors.goals}>
                    <FormLabel>
                      Campaign Goals
                      <Text as="span" color={labelColor}>
                        *
                      </Text>
                    </FormLabel>
                    <Flex gap="8px" flexDir="column">
                      <Flex gap="8px">
                        <Input
                          placeholder="Add a new goal"
                          {...register("newGoal")}
                        />
                        <Button onClick={handleAddGoal} colorScheme="purple">
                          Add Goal
                        </Button>
                      </Flex>
                      {goalFields.length > 0 && (
                        <Box>
                          {goalFields.map((goal, index) => (
                            <Flex
                              key={index}
                              alignItems="center"
                              justifyContent="space-between"
                              p="8px"
                              borderBottom="1px solid #e2e8f0"
                            >
                              <Text>{goal}</Text>
                              <Button
                                onClick={() => handleRemoveGoal(index)}
                                variant="outline"
                                colorScheme="red"
                                size="sm"
                              >
                                Remove
                              </Button>
                            </Flex>
                          ))}
                        </Box>
                      )}
                    </Flex>
                    <FormErrorMessage>{errors.goals?.message}</FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex justifyContent="flex-end">
                  <Button
                    type="submit"
                    bg={primaryColor}
                    color="white"
                    _hover={{ bg: hoverColor }}
                    alignSelf={"flex-end"}
                    w={{ base: "100%", md: "200px" }}
                    h={"48px"}
                    isLoading={isLoading}
                  >
                    Create Content
                  </Button>
                </Flex>
              </Flex>
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <CreateContentProgressModal
        isOpen={isOpen}
        onClose={onClose}
        progress={progress}
      />
    </>
  );
};

export default ContentCreationForm;
