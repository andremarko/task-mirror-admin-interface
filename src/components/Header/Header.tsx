import React from "react";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username || user?.name || "Admin";

  return (
    <Box as="header" bg="white" boxShadow="md" py={3}>
      <Flex
        align="center"
        justify="space-between"
        maxW="1100px"
        mx="auto"
        px={4}
      >
        <Box onClick={() => navigate("/")} cursor="pointer">
          <Text fontWeight="700" color="#2563EB " fontSize="xl">
            TaskMirror
          </Text>
        </Box>

        <HStack as="nav" spacing={4} align="center">
          <Button
            as={NavLink}
            to="/"
            size="sm"
            bg="transparent"
            px={3}
            _activeLink={{ color: "#2563EB", fontWeight: "600" }}
            _hover={{ bg: "transparent" }}  
            fontSize={18}
          >
            Início
          </Button>
          <Button
            as={NavLink}
            to="/usuarios"
            size="sm"
            bg="transparent"
            px={3}
            _activeLink={{ color: "#2563EB", fontWeight: "600" }}
            _hover={{ bg: "transparent" }}
            fontSize={18}
          >
            Usuários
          </Button>
        </HStack>

        <Box>
          <Menu>
            <MenuButton as={Button} variant="ghost">
              <HStack spacing={2}>
                <Avatar size="sm" name={displayName} />
                <Text>{displayName}</Text>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ marginLeft: 6, color: "#6b7280" }}
                />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/usuarios")}>
                Usuários
              </MenuItem>
              <MenuItem
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                <FontAwesomeIcon
                  icon={faSignOut}
                  style={{ marginRight: 4, color: "#aa0e35" }}
                />
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
}
