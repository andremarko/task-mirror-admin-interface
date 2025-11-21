import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await signIn({ username, password });
      toast({ title: "Login efetuado", status: "success", duration: 2000 });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Erro ao efetuar login",
        description: err?.message ?? String(err) ?? "Credenciais inválidas",
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w={{ base: "90%", md: "420px" }}
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading size="md" mb={4} textAlign="center" color="#2563EB">
          TaskMirror
        </Heading>
        <Text color="gray.600" mb={6} fontSize="sm" textAlign="center">
          Use suas credenciais para acessar o painel administrativo.
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" isLoading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
