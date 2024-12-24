import React, { useState } from "react";
import {
    Box,
    Flex,
    Text,
    VStack,
    useColorModeValue,
    Icon,
    LinkBox,
    Card,
    CardBody,
    useToast,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
} from "@chakra-ui/react";
import {
    FileText, Users, CreditCard, User, Layout, MessageCircle, Globe, Mail, Cpu,
    Headphones,
    Clock,
    Rocket,
    ListTodo} from "lucide-react";
import CRMSection from "../crm";
import TasksSection from "../task";
import FilesSection from "../files";
import ProjectsPage from "../projects";
import BillingPage from "../billing";
import NewProjectPage from "../new_project";


interface MenuItem {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    to: string;
}

const menuItems: MenuItem[] = [
    { title: "Projects", icon: FileText, to: "/projects" },
    { title: "CRM", icon: Users, to: "/dashboard/crm" },
    { title: "My Files", icon: FileText, to: "/dashboard/files" },
    { title: "Billing", icon: CreditCard, to: "/billing" },
    { title: "My Account", icon: User, to: "/account" },
    { title: "Branding and Design", icon: Layout, to: "/branding" },
    { title: "Social Media", icon: MessageCircle, to: "/social-media" },
    { title: "Website", icon: Globe, to: "/website" },
    { title: "Email Marketing", icon: Mail, to: "/email-marketing" },
    { title: "AI Integrations", icon: Cpu, to: "/ai-integrations" },
];

const SidebarItem = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    to: string;
    onClick?: () => void;
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        }
    };

    return (
        <LinkBox
            as="button"
            alignItems="center"
            justifyContent="start"
            w="full"
            px={4}
            py={2}
            borderRadius="md"
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            transition="all 0.2s"
            onClick={handleClick}
        >
            <Flex align="center">
                <Box boxSize="20px" mr={3}>
                    <Icon as={icon} />
                </Box>
                <Text>{label}</Text>
            </Flex>
        </LinkBox>
    );
};


const LiveSupportSection = () => {
    return (
        <Box maxW="800px" mx="auto" h="600px" bg="white" borderRadius="lg" shadow="md">
            <VStack h="full" spacing={0}>
                {/* Header */}
                <Box w="full" p={4} borderBottom="1px" borderColor="gray.200">
                    <VStack spacing={2} align="center">
                        <Icon as={Headphones} boxSize="40px" color="blue.400" />
                        <Text fontSize="lg" fontWeight="medium">Live customer support</Text>
                    </VStack>
                </Box>

                {/* Voice Input Instructions */}
                <VStack p={8} spacing={6}>
                    <Icon as={Globe} boxSize="50px" color="blue.400" />
                    <Text textAlign="center">
                        Press microphone to speak or chat
                    </Text>
                </VStack>

                {/* Voice Input Box */}
                <Box
                    w="90%"
                    p={6}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                >
                    <VStack spacing={4}>
                        <Text fontSize="lg">Copy of voice to voice</Text>
                        <Text fontSize="sm" color="gray.500">
                            Press Command+J to use AI writing assistant
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};


const TopNavItem = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    onClick?: () => void;
}) => {
    return (
        <VStack spacing={1} align="center" cursor="pointer" onClick={onClick}>
            <Box boxSize="24px" color="blue.500">
                <Icon as={icon} />
            </Box>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
                {label}
            </Text>
        </VStack>
    );
};


// Componente do formulário de agendamento
const ScheduleMeetingForm = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        type: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Meeting Scheduled",
            description: "Your meeting has been successfully scheduled.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        setFormData({ title: '', date: '', time: '', type: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Meeting Title</FormLabel>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter meeting title"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Time</FormLabel>
                    <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Meeting Type</FormLabel>
                    <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="Select meeting type"
                    >
                        <option value="consultation">Initial Consultation</option>
                        <option value="followup">Follow-up Meeting</option>
                        <option value="project">Project Discussion</option>
                        <option value="review">Review Meeting</option>
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue">
                    Schedule Meeting
                </Button>
            </Stack>
        </form>
    );
};

const HomePageWithSidebar = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleSectionClick = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <Flex minH="100vh" direction="column" bg={useColorModeValue("gray.50", "gray.800")}>
            {/* Top Navigation */}
            <Box bg={useColorModeValue("white", "gray.900")} shadow="sm" py={4} px={8}>
                <Flex justify="center" gap={4}>
                    <TopNavItem
                        icon={Headphones}
                        label="Live Support"
                        onClick={() => handleSectionClick('support')}
                    />
                    <TopNavItem
                        icon={Clock}
                        label="Schedule Meeting"
                        onClick={() => handleSectionClick('meeting')}
                    />
                    <TopNavItem
                        icon={Rocket}
                        label="New Project"
                        onClick={() => handleSectionClick('project')}
                    />
                    <TopNavItem
                        icon={ListTodo}
                        label="My Tasks"
                        onClick={() => handleSectionClick('tasks')}
                    />
                </Flex>
            </Box>


            {/* Main Content */}
            <Flex flex="1">
                {/* Sidebar */}
                <Box w="64" p={4} bg={useColorModeValue("white", "gray.900")} shadow="sm">
                    <VStack spacing={4} align="stretch">
                        {menuItems.map((item, index) => (
                            <SidebarItem
                                key={index}
                                icon={item.icon}
                                label={item.title}
                                to={item.to}
                                onClick={() => {
                                    if (item.title === "CRM") {
                                        handleSectionClick('crm');
                                    } else if (item.title === "My Files") {
                                        handleSectionClick('files');
                                    } else if (item.title === "Projects") {
                                        handleSectionClick('Projects');
                                    } else if (item.title === "Billing") {
                                        handleSectionClick('Billing');
                                    }
                                }}
                            />
                        ))}
                    </VStack>
                </Box>

                {/* Dashboard Content */}
                <Box flex="1" p={8}>
                    {activeSection === 'support' && <LiveSupportSection />}
                    {activeSection === 'meeting' && (
                        <Box maxW="600px" mx="auto">
                            <Text fontSize="2xl" mb={6}>Schedule a Meeting</Text>
                            <Card>
                                <CardBody>
                                    <ScheduleMeetingForm />
                                </CardBody>
                            </Card>
                        </Box>
                    )}
                    {activeSection === 'tasks' && (
                        <Box>
                            <Card>
                                <CardBody>
                                    <TasksSection />
                                </CardBody>
                            </Card>
                        </Box>
                    )}
                    {activeSection === 'project' && (
                        <NewProjectPage />
                    )}
                    {activeSection === 'Projects' && <ProjectsPage />}
                    {activeSection === 'crm' && <CRMSection />}
                    {activeSection === 'files' && <FilesSection />}
                    {activeSection === 'Billing' && <BillingPage />}
                </Box>
            </Flex>
        </Flex>
    );
};

export default HomePageWithSidebar;
