import { Box, Flex, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../menu/Sidebar";
import Header from "./Header";

const LayoutUi: React.FC = () => {
  return (
    <Grid
      gap={"24px"}
      gridTemplateColumns={"auto 1fr"}
      h={"100vh"}
      maxH={"100vh"}
    >
      <Sidebar />
      <Box
        flex="1"
        paddingTop={{ base: "24px", md: "32px" }}
        overflowY={"auto"}
      >
        <Flex bg={"#FFFFFF"} flexDir={"column"} padding={"16px"}>
          <Header />
          <Outlet />
        </Flex>
      </Box>
    </Grid>
  );
};

export default LayoutUi;
