import { useEffect, useState } from "react";
import { tarefaService } from "../service/tarefaService";
import { TotalStatus } from "../model/tarefa";

export const useTarefaControl = () => {
  const [totalTarefas, setTotalTarefas] = useState<number>(0);
  const [totalPorStatus, setTotalPorStatus] = useState<TotalStatus[]>([]);
  const [tempoMedioConclusao, setTempoMedioConclusao] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTarefaMetrics = async () => {
    console.debug("loadTarefaMetrics() called");
    setIsLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        tarefaService.totalTarefas(),
        tarefaService.totalTarefasPorStatus(),
        tarefaService.tempoMedioConclusaoTarefas()
      ]);

      const [total, totalStatus, tempoMedio] = results;

      if (total.status === "fulfilled") {
        setTotalTarefas(total.value);
      }

      if (totalStatus.status === "fulfilled") {
        setTotalPorStatus(totalStatus.value);
      }

      if (tempoMedio.status === "fulfilled") {
        setTempoMedioConclusao(tempoMedio.value);
      }

    } catch (err: any) {
    
      console.error("Erro ao carregar métricas:", err);
      setError(err?.message ?? "Erro ao carregar métricas de tarefas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTarefaMetrics();
  }, []);

  return {
    totalTarefas,
    totalPorStatus,
    tempoMedioConclusao,
    isLoading,
    error,
    loadTarefaMetrics
  };
};
