import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";

interface Project {
  notion_id?: string;
  project_name: string;
  business_name: string;
  status: string;
  priority: string;
  due_date: string;
  team_department: string;
  assigned_person: string;
  link: string;
}

const API_URL = import.meta.env.VITE_API_URL;


const ProjectForm = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
}: {
  formData: Partial<Project>;
  onChange: (name: string, value: string) => void;
  onSubmit: (data: Partial<Project>) => void;
  isLoading: boolean;
}) => {
  const isFormValid =
    formData.project_name?.trim() &&
    formData.business_name?.trim() &&
    formData.team_department?.trim() &&
    formData.assigned_person?.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Project Name</FormLabel>
          <Input
            name="project_name"
            value={formData.project_name || ""}
            onChange={handleChange}
            placeholder="Enter project name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Business Name</FormLabel>
          <Input
            name="business_name"
            value={formData.business_name || ""}
            onChange={handleChange}
            placeholder="Enter business name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Team/Department</FormLabel>
          <Input
            name="team_department"
            value={formData.team_department || ""}
            onChange={handleChange}
            placeholder="Enter team/department"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Assigned Person</FormLabel>
          <Input
            name="assigned_person"
            value={formData.assigned_person || ""}
            onChange={handleChange}
            placeholder="Enter assigned person"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
          >
            <option value="Não começou">Not Started</option>
            <option value="Em andamento">In Progress</option>
            <option value="Pronto">Complete</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Link</FormLabel>
          <Input
            type="url"
            name="link"
            value={formData.link || ""}
            onChange={handleChange}
            placeholder="Enter project link"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Priority</FormLabel>
          <Select
            name="priority"
            value={formData.priority || ""}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Due Date</FormLabel>
          <Input
            type="date"
            name="due_date"
            value={formData.due_date || ""}
            onChange={handleChange}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          isDisabled={!isFormValid}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};


const NewProjectPage = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    status: "Não começou",
    priority: "Low",
  });

  const createProject = async (newProject: Partial<Project>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      toast({
        title: "Project created",
        description: "The new project has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "Unable to add the new project.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ status: "Não começou", priority: "Low" });
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Create Project</Text>
      <ProjectForm
        formData={formData}
        onChange={handleFormChange}
        onSubmit={createProject}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default NewProjectPage;
