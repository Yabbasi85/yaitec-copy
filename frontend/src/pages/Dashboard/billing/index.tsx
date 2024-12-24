import { useState } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
} from "@chakra-ui/react";

const BillingPage = () => {
    const [searchDate, setSearchDate] = useState("");
    const toast = useToast();

    const handleSearch = () => {
        // Logic to search for invoices by date (simulated here)
        toast({
            title: "Search completed",
            description: `Searching invoices for the date: ${searchDate}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleGeneratePDF = () => {
        // Logic to generate the PDF (simulated here)
        toast({
            title: "PDF generated",
            description: "The PDF was successfully generated!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box maxW="500px" mx="auto" mt={8} p={4} borderRadius="lg" bg="white" shadow="md">
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Search Date</FormLabel>
                    <Input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        placeholder="Select a date"
                    />
                </FormControl>
                <Button colorScheme="blue" onClick={handleSearch}>
                    Search Invoices
                </Button>
                <Button colorScheme="green" onClick={handleGeneratePDF}>
                    Generate PDF
                </Button>
            </VStack>
        </Box>
    );
};

export default BillingPage;
