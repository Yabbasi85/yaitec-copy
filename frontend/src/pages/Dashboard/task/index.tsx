import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Heading,
  VStack,
  HStack,
  useToast,
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { jsPDF } from "jspdf";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export interface Project {
  notion_id: string;
  project_name: string;
  business_name: string;
  status: string;
  team_department: string;
  assigned_person: string;
  priority: string;
  link?: string;
  due_date: string;
  approved?: boolean;
}

interface PaginationProps {
  totalProjects: number;
  projectsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const Pagination: React.FC<PaginationProps> = ({ totalProjects, projectsPerPage, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  return (
    <HStack spacing={4} justify="center" mt={4}>
      <IconButton
        aria-label="Previous Page"
        icon={<ChevronLeftIcon />}
        onClick={handlePrevious}
        isDisabled={currentPage === 1}
        colorScheme="blue"
        size="sm"
      />
      <Button size="sm" variant="ghost" disabled>
        Page {currentPage} of {totalPages}
      </Button>
      <IconButton
        aria-label="Next Page"
        icon={<ChevronRightIcon />}
        onClick={handleNext}
        isDisabled={currentPage === totalPages}
        colorScheme="blue"
        size="sm"
      />
    </HStack>
  );
};

const TasksSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const [processingProjects, setProcessingProjects] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('processingProjects');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [taskIds, setTaskIds] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('taskIds');
    return saved ? JSON.parse(saved) : {};
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  // Adicione um useEffect para salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('processingProjects', JSON.stringify([...processingProjects]));
  }, [processingProjects]);

  useEffect(() => {
    localStorage.setItem('taskIds', JSON.stringify(taskIds));
  }, [taskIds]);

  // Adicione um useEffect para verificar status das tasks ao carregar
  useEffect(() => {
    Object.entries(taskIds).forEach(([projectId, taskId]) => {
      checkTaskStatus(projectId, taskId);
    });
  }, []);



  const checkTaskStatus = async (projectId: string, taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/pdf-status/${taskId}`);
      if (!response.ok) throw new Error('Failed to check status');

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        // Remove do processamento e localStorage
        setProcessingProjects(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
        setTaskIds(prev => {
          const next = { ...prev };
          delete next[projectId];
          return next;
        });
        loadProjects();

        toast({
          title: "PDF Generated",
          description: "PDF has been successfully generated and saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (data.status === 'FAILURE') {
        // Remove do processamento e localStorage em caso de falha
        setProcessingProjects(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
        setTaskIds(prev => {
          const next = { ...prev };
          delete next[projectId];
          return next;
        });

        toast({
          title: "Error Processing PDF",
          description: data.error || "Failed to process the PDF.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Ainda processando, continua o polling
        setTimeout(() => checkTaskStatus(projectId, taskId), 3000);
      }
    } catch (error) {
      console.error('Error checking task status:', error);
    }
  };


  useEffect(() => {
    loadProjects();
  }, []);

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

  const generatePDF = (project: Project) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Project Report", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Project Name: ${project.project_name}`, 20, 30);
    doc.text(`Business Name: ${project.business_name}`, 20, 40);
    doc.text(`Status: ${project.status}`, 20, 50);
    doc.text(`Team/Department: ${project.team_department}`, 20, 60);
    doc.text(`Assigned Person: ${project.assigned_person}`, 20, 70);
    doc.text(`Priority: ${project.priority}`, 20, 80);
    doc.text(`Due Date: ${project.due_date}`, 20, 90);

    if (project.link) {
      doc.text(`Link: ${project.link}`, 20, 100);
    }

    return doc;
  };

  const handleViewPDF = (projectId: string) => {
    const project = projects.find(p => p.notion_id === projectId);
    if (project) {
      const doc = generatePDF(project);
      doc.save(`${project.project_name}_report.pdf`);
    } else {
      toast({
        title: "Error viewing PDF",
        description: "Project not found.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleApprovePDF = async (projectId: string) => {
    const project = projects.find(p => p.notion_id === projectId);
    if (project) {
      setProcessingProjects(prev => new Set(prev).add(projectId));
      const doc = generatePDF(project);
      const pdfBlob = doc.output('blob');

      const formData = new FormData();
      formData.append('pdf_file', pdfBlob, `${project.notion_id}.pdf`);

      try {
        const response = await fetch(`${API_URL}/save-pdf-approved/?project_id=${project.notion_id}&folder_name=${project.team_department}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to save PDF');
        }

        const data = await response.json();
        if (data.task_id) {
          // Armazena o task_id e inicia o polling
          setTaskIds(prev => ({ ...prev, [projectId]: data.task_id }));
          checkTaskStatus(projectId, data.task_id);

          toast({
            title: "Processing PDF",
            description: "Your PDF is being processed in the queue...",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error saving PDF:', error);
        setProcessingProjects(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });

        toast({
          title: "Error approving PDF",
          description: "Failed to save the PDF.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };



  return (
    <Box minH="100vh" bg="gray.50">
      <Heading size="md" mb={2}>
        My Projects
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={6}>
        Projects awaiting approval
      </Text>
      {loading ? (
        <Spinner />
      ) : (
        <VStack spacing={4}>
          {currentProjects.map((project) => (
            <Flex
              key={project.notion_id}
              w="full"
              align="center"
              justify="space-between"
              bg="gray.50"
              rounded="lg"
              p={4}
              shadow="sm"
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                {project.project_name}
              </Text>
              <HStack spacing={2}>
                <Button
                  variant="link"
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleViewPDF(project.notion_id)}
                >
                  View PDF
                </Button>
                <Button
                  size="sm"
                  colorScheme={project.approved ? "green" : "blackAlpha"}
                  onClick={() => handleApprovePDF(project.notion_id)}
                  isDisabled={project.approved || processingProjects.has(project.notion_id)}
                  isLoading={processingProjects.has(project.notion_id)}
                  loadingText="Processing"
                  _disabled={{
                    opacity: 0.6,
                    cursor: 'not-allowed'
                  }}
                >
                  {project.approved ? "Approved" : processingProjects.has(project.notion_id) ? "Processing" : "Approve"}
                </Button>
              </HStack>
            </Flex>
          ))}
        </VStack>
      )}
      {projects.length > projectsPerPage && (
        <Pagination
          totalProjects={projects.length}
          projectsPerPage={projectsPerPage}
          currentPage={currentPage}
          paginate={paginate}
        />
      )}
    </Box>
  );
};

export default TasksSection;