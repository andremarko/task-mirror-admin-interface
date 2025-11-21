import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Grid,
  GridItem,
  FormErrorMessage,
  Box,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import {
  UsuarioResponseDTO,
  UsuarioEdicao,
  LiderResponseDTO,
} from "../../model/usuario";

type UsuarioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  usuario?: UsuarioResponseDTO | null;
  onSave?: (
    data: UsuarioEdicao & { gerarNovaSenha?: boolean }
  ) => Promise<{ senhaGerada?: string } | void>;
  lideres: LiderResponseDTO[];
  loadLideres: () => Promise<void>;
  buscarUsuarioPorId: (idUsuario: number) => Promise<UsuarioResponseDTO>;
};

export default function UsuarioModal({
  isOpen,
  onClose,
  usuario = null,
  onSave,
  lideres,
  loadLideres,
  buscarUsuarioPorId,
}: UsuarioModalProps) {
  const [username, setUsername] = useState("");
  const [funcao, setFuncao] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [roleUsuario, setRoleUsuario] = useState("");
  const [lider, setLider] = useState("");
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [funcaoError, setFuncaoError] = useState<string | null>(null);
  const [cargoError, setCargoError] = useState<string | null>(null);
  const [setorError, setSetorError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [senhaGerada, setSenhaGerada] = useState<string | null>(null);
  const [gerarNovaSenha, setGerarNovaSenha] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let ativo = true;

    const loadData = async () => {
      setCarregando(true);
      try {
        if (lideres.length === 0) await loadLideres();
        if (!ativo) return;

        if (usuario?.idUsuario) {
          const detailed = await buscarUsuarioPorId(usuario.idUsuario);
          if (!ativo || !detailed) return;

          setUsername(detailed.username ?? "");
          setFuncao(detailed.funcao ?? "");
          setCargo(detailed.cargo ?? "");
          setSetor(detailed.setor ?? "");
          setRoleUsuario(detailed.roleUsuario ?? "");
          setLider(detailed.idLider ? String(detailed.idLider) : "");
        } else {
          setUsername("");
          setFuncao("");
          setCargo("");
          setSetor("");
          setRoleUsuario("");
          setLider("");
        }

        setSenhaGerada(null);
        setGerarNovaSenha(false);
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    loadData();

    return () => {
      ativo = false;
    };
  }, [isOpen, usuario?.idUsuario]);

  useEffect(() => {
    if (!senhaGerada) return;
    const timer = setTimeout(() => setSenhaGerada(null), 15000);
    return () => clearTimeout(timer);
  }, [senhaGerada]);

  const handleSave = async () => {
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Username é obrigatório");
      hasError = true;
    }

    if (!roleUsuario.trim()) {
      setRoleError("Selecione uma ROLE");
      hasError = true;
    }

    if (!funcao.trim()) {
      setFuncaoError("Função é obrigatória");
      hasError = true;
    }

    if (!cargo.trim()) {
      setCargoError("Cargo é obrigatório");
      hasError = true;
    }

    if (!setor.trim()) {
      setSetorError("Setor é obrigatório");
      hasError = true;
    }

    if (hasError) return;

    const payload: UsuarioEdicao & { gerarNovaSenha?: boolean } = {
      username,
      funcao,
      cargo,
      setor,
      roleUsuario,
      idLider: lider === "" ? null : Number(lider),
      gerarNovaSenha: usuario ? gerarNovaSenha : undefined,
    };

    try {
      setSaving(true);
      if (onSave) {
        const result = await onSave(payload);
        if (result?.senhaGerada) {
          setSenhaGerada(result.senhaGerada);
          return;
        }
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const title = usuario ? "Editar usuário" : "Novo usuário";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        p={6}
        boxShadow="lg"
      >
        <ModalHeader p={0} mb={4}>
          <VStack align="start" spacing={1}>
            <Box display="flex" alignItems="center">
              <Avatar
                name={username || usuario?.username || "Usuário"}
                size="md"
                mr={4}
              />
              <Box>
                <Text fontWeight={800} fontSize="lg">
                  {title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {usuario ? usuario.username : "Criar um novo usuário"}
                </Text>
              </Box>
            </Box>
          </VStack>
        </ModalHeader>

        <ModalCloseButton />
        <Divider mb={4} />

        <ModalBody>
          {carregando ? (
            <Text>Carregando dados...</Text>
          ) : (
            <>
              <Grid templateColumns={["1fr", "1fr 1fr"]} gap={4}>
                {/* Username */}
                <GridItem>
                  <FormControl isRequired isInvalid={!!usernameError}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (usernameError) setUsernameError(null);
                      }}
                      placeholder="joao.silva"
                      autoFocus
                    />
                    <FormErrorMessage>{usernameError}</FormErrorMessage>
                  </FormControl>
                </GridItem>

                {/* Função */}
                <GridItem>
                  <FormControl isRequired isInvalid={!!funcaoError}>
                    <FormLabel>Função</FormLabel>
                    <Input
                      value={funcao}
                      onChange={(e) => {
                        setFuncao(e.target.value);
                        if (funcaoError) setFuncaoError(null);
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage>{funcaoError}</FormErrorMessage>
                </GridItem>

                {/* Cargo */}
                <GridItem>
                  <FormControl isRequired isInvalid={!!cargoError}>
                    <FormLabel>Cargo</FormLabel>
                    <Input
                      value={cargo}
                      onChange={(e) => {
                        setCargo(e.target.value);
                        if (cargoError) setCargoError(null);
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage>{cargoError}</FormErrorMessage>
                </GridItem>

                {/* Setor */}
                <GridItem>
                  <FormControl isRequired isInvalid={!!setorError}>
                    <FormLabel>Setor</FormLabel>
                    <Input
                      value={setor}
                      onChange={(e) => {
                        setSetor(e.target.value);
                        if (setorError) setSetorError(null);
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage>{setorError}</FormErrorMessage>
                </GridItem>

                {/* Role */}
                <GridItem>
                  <FormControl isRequired isInvalid={!!roleError}>
                    <FormLabel>Papel do usuário (ROLE)</FormLabel>
                    <Select
                      placeholder="Selecione uma ROLE"
                      value={roleUsuario}
                      onChange={(e) => setRoleUsuario(e.target.value)}
                    >
                      <option value="ROLE_ADMIN">Administrador</option>
                      <option value="ROLE_SUBORDINADO">Subordinado</option>
                      <option value="ROLE_SUPERIOR">Superior</option>
                    </Select>
                    <FormErrorMessage>{roleError}</FormErrorMessage>
                  </FormControl>
                </GridItem>

                {/* Líder */}
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Líder / Superior</FormLabel>
                    {lideres?.length ? (
                      <Select
                        placeholder="Nenhum líder"
                        value={lider}
                        onChange={(e) => setLider(e.target.value)}
                      >
                        {lideres
                          .filter((l) => l.idUsuario !== usuario?.idUsuario)
                          .map((l) => (
                            <option
                              key={l.idUsuario}
                              value={String(l.idUsuario)}
                            >
                              {l.username} {l.funcao ? `- ${l.funcao}` : ""}
                            </option>
                          ))}
                      </Select>
                    ) : (
                      <Text>Nenhum líder encontrado</Text>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>

              {usuario && (
                <FormControl mt={4}>
                  <Checkbox
                    isChecked={gerarNovaSenha}
                    onChange={(e) => setGerarNovaSenha(e.target.checked)}
                  >
                    Gerar nova senha
                  </Checkbox>
                </FormControl>
              )}

              {senhaGerada && (
                <Box
                  mt={4}
                  p={3}
                  bg="yellow.100"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="yellow.300"
                >
                  <Text fontWeight="bold">Senha gerada:</Text>
                  <Text fontFamily="monospace" fontSize="lg">
                    {senhaGerada}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Anote esta senha agora, ela não será exibida novamente.
                  </Text>
                </Box>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
