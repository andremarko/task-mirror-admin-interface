import {
  Box,
  Text,
  Divider,
  Heading,
  Flex,
  HStack,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Tag,
  IconButton,
  Tooltip,
  Switch,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import UsuarioModal from "../../components/Usuarios/UsuarioModal";
import { useUsuarioControl } from "../../control/usuarioControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from "@chakra-ui/react";
import { UsuarioRequestDTO } from "../../model/usuario";

export default function Usuarios() {
  const {
    usuarios,
    isLoading,
    loadUsuarios,
    desativarUsuario,
    ativarUsuario,
    criarUsuario,
    atualizarUsuario,
    loadLideres,
    lideres,
    buscarUsuarioPorId,
    produtividadeMap,
    isLoadingProd,
  } = useUsuarioControl();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    void loadUsuarios();
  }, []);

  const handleToggleActive = async (u: {
    idUsuario: number;
    ativo: boolean;
  }) => {
    const confirmMsg = u.ativo
      ? "Deseja desativar este usuário?"
      : "Deseja ativar este usuário?";
    if (!window.confirm(confirmMsg)) return;

    try {
      if (u.ativo) {
        await desativarUsuario(u.idUsuario);
        toast({ title: "Usuário desativado", status: "success" });
      } else {
        await ativarUsuario(u.idUsuario);
        toast({ title: "Usuário ativado", status: "success" });
      }

      await loadUsuarios();
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message ?? "Falha ao executar ação",
        status: "error",
      });
    }
  };

  const filtered = useMemo(() => {
    return (usuarios || []).filter((u) => {
      if (filter === "active" && !u.ativo) return false;
      if (filter === "inactive" && u.ativo) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        (u.funcao || "").toLowerCase().includes(q) ||
        (u.cargo || "").toLowerCase().includes(q) ||
        (u.setor || "").toLowerCase().includes(q)
      );
    });
  }, [filter, query, usuarios]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" w="100%" px={6} py={8} mx="auto">
        <Flex mb={6} align="center" justify="space-between">
          <VStack align="flex-start" spacing={1}>
            <Heading size="md">Usuários do Sistema</Heading>
            <Text color="gray.500" fontSize="sm">
              Gerencie acessos, visualize usuários cadastrados
            </Text>
          </VStack>

          <HStack spacing={3}>
            <HStack spacing={1}>
              <Button
                size="sm"
                variant={filter === "all" ? "solid" : "ghost"}
                onClick={() => setFilter("all")}
              >
                Todos
              </Button>
              <Button
                size="sm"
                colorScheme="green"
                variant={filter === "active" ? "solid" : "outline"}
                onClick={() => setFilter("active")}
              >
                Ativos
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant={filter === "inactive" ? "solid" : "outline"}
                onClick={() => setFilter("inactive")}
              >
                Inativos
              </Button>
            </HStack>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => {
                setSelectedUser(null);
                onOpen();
              }}
            >
              Novo usuário
            </Button>
          </HStack>
        </Flex>

        <Divider borderColor="gray.200" mb={1} />

        {isLoading ? (
          <Center py={12} w="100%">
            <Spinner size="lg" />
          </Center>
        ) : (
          <TableContainer overflowX="auto" maxW="100%">
            <Table variant="simple" size="lg" minW="900px">
              <Thead>
                <Tr>
                  <Th minW="120px" textAlign={{ base: "center", md: "center" }}>
                    Produtividade
                  </Th>
                  <Th minW="180px" textAlign={{ base: "center", md: "left" }}>
                    Username
                  </Th>
                  <Th minW="220px" textAlign={{ base: "center", md: "left" }}>
                    Função / Cargo
                  </Th>
                  <Th minW="140px" textAlign={{ base: "center", md: "left" }}>
                    Setor
                  </Th>
                  <Th minW="160px" textAlign={{ base: "center", md: "left" }}>
                    Líder
                  </Th>
                  <Th minW="140px" textAlign={{ base: "center", md: "left" }}>
                    Role/Papel
                  </Th>
                  <Th minW="100px" textAlign={{ base: "center", md: "center" }}>
                    Status
                  </Th>
                  <Th minW="120px" textAlign={{ base: "center", md: "center" }}>
                    Ações
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((usuario) => {
                  const isActive = Boolean(usuario.ativo);
                  const prod = produtividadeMap
                    ? produtividadeMap[usuario.idUsuario]
                    : undefined;
                  const prodLoading = isLoadingProd && prod === undefined;
                  return (
                    <Tr
                      key={usuario.idUsuario}
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                    >
                      <Td
                        minW="120px"
                        textAlign={{ base: "center", md: "center" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        {String(usuario.roleUsuario || "")
                          .toLowerCase()
                          .includes("subordinado") ? (
                          prodLoading ? (
                            <Spinner size="sm" />
                          ) : prod == null ? (
                            <Text color="gray.400">
                              Não há tarefas atribuídas
                            </Text>
                          ) : (
                            <Text>{String(prod.toFixed(0))}%</Text>
                          )
                        ) : (
                          <Text color="gray.400">N/A</Text>
                        )}
                      </Td>

                      <Td
                        minW="180px"
                        textAlign={{ base: "center", md: "left" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        {usuario.username}
                      </Td>

                      <Td
                        minW="220px"
                        textAlign={{ base: "center", md: "left" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        <Text>{usuario.funcao || "-"}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {usuario.cargo || "-"}
                        </Text>
                      </Td>

                      <Td
                        minW="140px"
                        textAlign={{ base: "center", md: "left" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        {usuario.setor ? (
                          <Badge colorScheme="blue" style={{ padding: 3 }}>
                            {usuario.setor}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </Td>

                      <Td
                        minW="160px"
                        textAlign={{ base: "center", md: "left" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        {usuario.idLider ? (
                          usuarios.find((u) => u.idUsuario === usuario.idLider)
                            ?.username || <Text color="gray.400">N/A</Text>
                        ) : (
                          <Text color="gray.400">N/A</Text>
                        )}
                      </Td>

                      <Td
                        minW="140px"
                        textAlign={{ base: "center", md: "left" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        {usuario.roleUsuario
                          ? {
                              ROLE_ADMIN: "ADMINISTRADOR",
                              ROLE_SUBORDINADO: "SUBORDINADO",
                              ROLE_SUPERIOR: "LIDER",
                            }[usuario.roleUsuario] || usuario.roleUsuario
                          : "-"}
                      </Td>

                      <Td
                        minW="100px"
                        textAlign={{ base: "center", md: "center" }}
                        onClick={() => {
                          setSelectedUser(usuario);
                          onOpen();
                        }}
                      >
                        <Tag colorScheme={isActive ? "green" : "red"} size="sm">
                          {isActive ? "Ativo" : "Inativo"}
                        </Tag>
                      </Td>

                      <Td
                        minW="120px"
                        textAlign={{ base: "center", md: "center" }}
                      >
                        <HStack justify="center">
                          <Tooltip label="Editar usuário">
                            <IconButton
                              aria-label="editar"
                              size="sm"
                              colorScheme="gray"
                              icon={
                                <FontAwesomeIcon
                                  color="gray"
                                  icon={faUserEdit}
                                />
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(usuario);
                                onOpen();
                              }}
                            />
                          </Tooltip>
                          <Switch
                            isChecked={usuario.ativo}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleActive(usuario);
                            }}
                            colorScheme="green"
                            aria-label={
                              usuario.ativo
                                ? "Desativar usuário"
                                : "Ativar usuário"
                            }
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Footer mt="auto" />
      <UsuarioModal
        isOpen={isOpen}
        onClose={onClose}
        usuario={selectedUser}
        onSave={async (usuarioEdicao) => {
          try {
            if (selectedUser?.idUsuario) {
              const result = await atualizarUsuario(
                selectedUser.idUsuario,
                usuarioEdicao
              );
              toast({ title: "Usuário atualizado", status: "success" });
              return { senhaGerada: result?.senhaGerada };
            } else {
              const result = await criarUsuario(
                usuarioEdicao as UsuarioRequestDTO
              );
              toast({ title: "Usuário criado", status: "success" });
              return { senhaGerada: result?.senhaGerada };
            }
          } catch (err: any) {
            toast({
              title: "Erro",
              description: err?.message ?? "Falha ao salvar usuário",
              status: "error",
            });
            return {};
          }
        }}
        lideres={lideres}
        loadLideres={loadLideres}
        buscarUsuarioPorId={buscarUsuarioPorId}
      />
    </Box>
  );
}
