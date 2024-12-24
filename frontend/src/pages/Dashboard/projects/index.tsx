import { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Spinner,
  IconButton,
  HStack
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  notion_id: string;
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

const ProjectCard = ({ project }: { project: Project }) => (
  <Card>
    <CardBody>
      <Text fontSize="lg" fontWeight="bold">{project.project_name}</Text>
      <Text>Business: {project.business_name}</Text>
      <Text>Status: {project.status}</Text>
      <Text>Priority: {project.priority}</Text>
      <Text>Team/Department: {project.team_department}</Text>
      <Text>Assigned Person: {project.assigned_person}</Text>
      <Text>Due Date: {project.due_date}</Text>
      <Text>
        Link:{" "}
        <a href={project.link} target="_blank" rel="noopener noreferrer">
          {project.link || "No link provided"}
        </a>
      </Text>
    </CardBody>
  </Card>
);

// Página principal de projetos
const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const toast = useToast();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects/`);
      if (!response.ok) {
        throw new Error("Failed to load projects");
      }
      const data = await response.json();
      setProjects(data);
      toast({
        title: "Projects loaded",
        description: "All projects have been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "Unable to update the project list.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handlePageChange = (direction: "next" | "previous") => {
    setCurrentPage((prevPage: number) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Projects</Text>

      {loading ? (
        <Spinner size="xl" color="blue.500" />
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {currentProjects.map((project: Project) => (
              <ProjectCard key={project.notion_id} project={project} />
            ))}
          </SimpleGrid>

          {projects.length > itemsPerPage && (
            <HStack justify="center" spacing={4} mt={6}>
              <IconButton
                icon={<ChevronLeft />}
                aria-label="Previous Page"
                onClick={() => handlePageChange("previous")}
                isDisabled={currentPage === 1}
              />
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton
                icon={<ChevronRight />}
                aria-label="Next Page"
                onClick={() => handlePageChange("next")}
                isDisabled={currentPage === totalPages}
              />
            </HStack>
          )}
        </>
      )}
    </Box>
  );
};

export default ProjectsPage;
