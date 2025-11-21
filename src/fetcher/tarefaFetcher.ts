import { TotalStatus } from "../model/tarefa";
import { taskMirrorApi } from "./api";

// total de tarefas criadas no sistema
export const totalTarefas = async (): Promise<number> => {
  const response = await taskMirrorApi.get<number>(
    "/api/tarefas/estatistica/total-tarefas"
  );
  return response.data;
};

// total de tarefas agrupadas por status
export const totalTarefasPorStatus = async (): Promise<TotalStatus[]> => {
  const response = await taskMirrorApi.get<TotalStatus[]>(
    "/api/tarefas/admin/estatistica/total-tarefas-por-status"
  );
  return response.data;
};

// tempo medio de conclusao de tarefas (em horas)
export const tempoMedioConclusaoTarefas = async (): Promise<number> => {
  const response = await taskMirrorApi.get<number>(
    "/api/tarefas/admin/estatistica/tempo-medio-conclusao"
  );
  return response.data;
}
