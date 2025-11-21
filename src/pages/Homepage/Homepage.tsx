import {
  Box,
  Heading,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useTarefaControl } from "../../control/tarefaControl";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useUsuarioControl } from "../../control/usuarioControl";
import { Skeleton } from "@chakra-ui/react";

export default function Homepage() {
  const {
    totalTarefas,
    totalPorStatus,
    tempoMedioConclusao,
    isLoading,
    error,
  } = useTarefaControl();

  const { totalUsuariosAtivos, loadTotalUsuariosAtivos } = useUsuarioControl();

  React.useEffect(() => {
    void loadTotalUsuariosAtivos();
  }, [loadTotalUsuariosAtivos]);

  const pieData = totalPorStatus.map((item) => ({
    name: item.status_tarefa,
    value: item.quantidade,
  }));

  const COLORS = ["#2563EB", "#1E40AF", "#60A5FA"];

  const pageBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
      <Header />
      <Box flex="1" py={16}>
        <Box mx="auto"  maxW="8xl">
          <Heading mb={6} color="#2563EB">
            Dashboard - Estatísticas
          </Heading>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            align="flex-start"
          >
            <Box
              flex={{ md: "0 0 60%" }}
              bg={cardBg}
              p={8}
              borderRadius="md"
              boxShadow="lg"
            >
              <Heading as="h3" size="sm" mb={2}>
                Distribuição de tarefas por status
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={3}>
                Valores mostram quantidade de tarefas por status.
              </Text>

              {isLoading ? (
                <Skeleton height="400px" width="100%" borderRadius="md" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Tooltip
                      formatter={(value: number) => `${value} tarefas`}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="left"
                      formatter={(value) => (
                        <span style={{ color: "black" }}>{value}</span>
                      )}
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, percent }) =>
                        `${name} (${Math.round((percent || 0) * 100)}%)`
                      }
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>

            <Box flex={{ base: "1 1 100%", md: "0 0 35%" }}>
              <Grid templateColumns="1fr" gap={32}>
                <Box
                  bg={cardBg}
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  borderLeftWidth="4px"
                  borderLeftColor="#2563EB"
                >
                  <Stat>
                    <StatLabel fontSize="sm">
                      Total de tarefas atribuídas
                    </StatLabel>
                    <StatNumber fontSize="2xl">
                      {isLoading ? (
                        <Skeleton height="24px" width="80px" />
                      ) : (
                        totalTarefas
                      )}
                    </StatNumber>
                  </Stat>
                </Box>

                <Box
                  bg={cardBg}
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  borderLeftWidth="4px"
                  borderLeftColor="#2563EB"
                >
                  <Stat>
                    <StatLabel fontSize="sm">
                      Tempo Médio de conclusão de tarefas
                    </StatLabel>
                    <StatNumber fontSize="2xl">
                      {isLoading ? (
                        <Skeleton height="24px" width="80px" />
                      ) : (
                        `${tempoMedioConclusao}h`
                      )}
                    </StatNumber>
                  </Stat>
                </Box>

                <Box
                  bg={cardBg}
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  borderLeftWidth="4px"
                  borderLeftColor="#2563EB"
                >
                  <Stat>
                    <StatLabel fontSize="sm">Usuários Ativos</StatLabel>
                    <StatNumber fontSize="2xl">
                      {isLoading? (
                        <Skeleton height="24px" width="80px" />
                      ) : (
                        totalUsuariosAtivos
                      )}
                    </StatNumber>
                  </Stat>
                </Box>
              </Grid>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
