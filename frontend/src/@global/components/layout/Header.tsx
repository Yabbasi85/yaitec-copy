import { Box, Button, Heading, Flex} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <Box
      as="header"
      py={4}
      px={6}
      bg="gray.50"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading fontWeight="bold" color="gray.700" size="md">
          AI Agent: Content Creator/Researcher for Art of Galaxy
        </Heading>
        {location.pathname !== "/" && (
          <Button
            as={Link}
            to="/"
            variant="solid"
            size="md"
          >
            Back to Home
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
