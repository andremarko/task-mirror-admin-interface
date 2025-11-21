import * as tarefaFetcher from "../fetcher/tarefaFetcher";

export const tarefaService = {

    totalTarefas: async () => {
        const response = await tarefaFetcher.totalTarefas();
        return response;
    },

    totalTarefasPorStatus: async () => {
        const response = await tarefaFetcher.totalTarefasPorStatus();
        return response;
    },

    tempoMedioConclusaoTarefas: async () => {
        const response = await tarefaFetcher.tempoMedioConclusaoTarefas();
        return response;
    }
}