import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { Lead } from "./types";

interface LeadFormProps {
  lead: Lead | null;
  onSubmit: (lead: Lead) => void;
  isLoading: boolean;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, isLoading}) => {
  const [formData, setFormData] = useState<Lead>(
    lead || {
      id: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "",
      source: "",
      notes: "",
      score: 50,
      temperature: "",
      suggestions: ""
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleScoreChange = (value: number) => {
    setFormData({ ...formData, score: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.status) newErrors.status = "Status is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Company</FormLabel>
          <Input
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.status}>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select a status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Temperature</FormLabel>
          <Select
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          >
            <option value="">Select temperature</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Lead Score: {formData.score}</FormLabel>
          <Slider
            aria-label="lead-score"
            defaultValue={50}
            min={0}
            max={100}
            step={1}
            value={formData.score}
            onChange={handleScoreChange}
          >
            <SliderTrack bg="purple.100">
              <SliderFilledTrack bg="purple.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </FormControl>

        <Button
          type="submit"
          width="full"
          h="48px"
          borderRadius="8px"
          isDisabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" color="white" /> : (lead ? "Update Lead" : "Add Lead")}
        </Button>
      </VStack>
    </form>
  );
};

export default LeadForm;
