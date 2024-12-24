import { HamburgerIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import createTheme from "../../../styles/theme";

const Sidebar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDrawer = useBreakpointValue({ base: true, md: false });
  const theme = createTheme("brand1");

  const bgColor = useColorModeValue(theme.colors.brand.white, theme.colors.brand.darkBlue);
  const gradient = `linear-gradient(to bottom, ${theme.colors.brand.darkBlue}, ${theme.colors.brand.purple}, ${theme.colors.brand.electricGreen}, ${theme.colors.brand.white})`;

  return (
    <>
      {isDrawer ? (
        <>
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            position="fixed"
            top={4}
            left={4}
            zIndex="overlay"
          />
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  <SidebarContent onClose={onClose} />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        <Flex
          as="nav"
          pos="fixed"
          left={0}
          h="100vh"
          w="60px"
          bg={bgColor} 
          zIndex={0}
          position="relative"
          align={"center"}
          paddingTop={"24px"}
          gap={"16px"}
          direction={"column"}
          _after={{
            content: '""',
            position: "absolute",
            right: 0,
            top: 0,
            width: "3px",
            height: "100%",
            background: gradient, 
            zIndex: 1,
          }}
        >
          <Image src="/logo.png" h="25px" w="25px" />
          <SidebarContent />
        </Flex>
      )}
    </>
  );
};

export default Sidebar;
