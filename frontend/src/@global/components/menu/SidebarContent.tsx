import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { VStack, Tooltip, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaHome, FaEdit, FaMicrophone, FaChartLine, FaBullhorn, FaCogs, FaBook, FaUserTie, FaSignOutAlt } from "react-icons/fa";
import { MdAnalytics, MdGroup } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import axios from "axios";
import createTheme from "../../../styles/theme";
import { useAuth } from "../../../auth/AuthProvider";

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const location = useLocation();
  const [enabledDashboards, setEnabledDashboards] = useState<string[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { logout } = useAuth();

  const theme = createTheme("brand1");
  const activeBg = useColorModeValue(theme.colors.brand.purple, theme.colors.brand.darkBlue);
  const hoverBg = useColorModeValue(theme.colors.brand.purple, theme.colors.brand.electricGreen);
  const activeColor = useColorModeValue(theme.colors.brand.white, theme.colors.brand.white);

  useEffect(() => {
    // Buscando dashboards habilitados
    axios.get(`${apiUrl}/dashboards/`)
      .then(response => {
        const dashboards = response.data.filter((dashboard: any) => dashboard.enabled);
        setEnabledDashboards(dashboards.map((d: any) => d.category)); 
      })
      .catch(error => {
        console.error("Error fetching dashboards", error);
      });
  }, [apiUrl]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <VStack spacing="4" align="center" py={4}>
      <Tooltip label="Home" placement="right">
        <IconButton
          as={Link}
          to="/"
          icon={<FaHome />}
          aria-label="Home"
          onClick={onClose}
          variant="ghost"
          _hover={{ bg: hoverBg, color: activeColor }}
          bg={isActive("/") ? activeBg : "transparent"}
          color={isActive("/") ? activeColor : "inherit"}
        />
      </Tooltip>

      {enabledDashboards.includes("Competitors") && (
        <Tooltip label="Competitors Panel" placement="right">
          <IconButton
            as={Link}
            to="/competitors"
            icon={<MdGroup />}
            aria-label="Competitors Panel"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/competitors") ? activeBg : "transparent"}
            color={isActive("/competitors") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Business Analytics") && (
        <Tooltip label="Business Analytics" placement="right">
          <IconButton
            as={Link}
            to="/business-analytics"
            icon={<MdAnalytics />}
            aria-label="Business Analytics"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/business-analytics") ? activeBg : "transparent"}
            color={isActive("/business-analytics") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}


      {enabledDashboards.includes("Content Creation") && (
        <Tooltip label="Content Creation" placement="right">
          <IconButton
            as={Link}
            to="/content-creation"
            icon={<FaEdit />}
            aria-label="Content Creation"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/content-creation") ? activeBg : "transparent"}
            color={isActive("/content-creation") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Voice IA") && (
        <Tooltip label="Voice IA" placement="right">
          <IconButton
            as={Link}
            to="/vapi-voice"
            icon={<FaMicrophone />}
            aria-label="Voice IA"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/vapi-voice") ? activeBg : "transparent"}
            color={isActive("/vapi-voice") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Marketing Campaign") && (
        <Tooltip label="Marketing Campaign" placement="right">
          <IconButton
            as={Link}
            to="/marketing-campaign"
            icon={<FaBullhorn />}
            aria-label="Marketing Campaign"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/marketing-campaign") ? activeBg : "transparent"}
            color={isActive("/marketing-campaign") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Dashboard Analytics") && (
        <Tooltip label="Dashboard Analytics" placement="right">
          <IconButton
            as={Link}
            to="/dashboard-analytics"
            icon={<FaChartLine />}
            aria-label="Dashboard Analytics"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/dashboard-analytics") ? activeBg : "transparent"}
            color={isActive("/dashboard-analytics") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Design AI") && (
        <Tooltip label="Design AI" placement="right">
          <IconButton
            as={Link}
            to="/design-ai"
            icon={<GiArtificialIntelligence />}
            aria-label="Design AI"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/design-ai") ? activeBg : "transparent"}
            color={isActive("/design-ai") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Lead Management") && (
        <Tooltip label="Lead Management" placement="right">
          <IconButton
            as={Link}
            to="/lead-management"
            icon={<FaUserTie />}
            aria-label="Lead Management"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/lead-management") ? activeBg : "transparent"}
            color={isActive("/lead-management") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      {enabledDashboards.includes("Ebook Creation") && (
        <Tooltip label="Ebook Creation" placement="right">
          <IconButton
            as={Link}
            to="/ebook-creation"
            icon={<FaBook />}
            aria-label="Ebook Creation"
            onClick={onClose}
            variant="ghost"
            _hover={{ bg: hoverBg, color: activeColor }}
            bg={isActive("/ebook-creation") ? activeBg : "transparent"}
            color={isActive("/ebook-creation") ? activeColor : "inherit"}
          />
        </Tooltip>
      )}

      <Tooltip label="Admin Panel" placement="right">
        <IconButton
          as={Link}
          to="/admin-panel"
          icon={<FaCogs />}
          aria-label="Admin Panel"
          onClick={onClose}
          variant="ghost"
          _hover={{ bg: hoverBg, color: activeColor }}
          bg={isActive("/admin-panel") ? activeBg : "transparent"}
          color={isActive("/admin-panel") ? activeColor : "inherit"}
        />
      </Tooltip>
      <Tooltip label="Logout" placement="right">
        <IconButton
          onClick={logout}
          icon={<FaSignOutAlt />}
          variant="ghost"
          _hover={{ bg: hoverBg, color: activeColor }}
          width="full"
          aria-label={"Logout"}>
          Logout
        </IconButton>
      </Tooltip>
    </VStack>
  );
};

export default SidebarContent;
