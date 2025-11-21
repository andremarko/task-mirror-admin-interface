import { taskMirrorApi } from "./api";
import {
  LiderResponseDTO,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
} from "../model/usuario";

export const todosUsuarios = async (
  page: number,
  size: number
): Promise<UsuarioResponseDTO[]> => {
  const response = await taskMirrorApi.get(
    `/api/usuarios/admin/todos-usuarios`,
    {
      params: {
        page,
        size,
        sort: ["ativo,desc", "username,asc"],
      },
    }
  );
  const data = response.data as any;
  if (Array.isArray(data)) return data as UsuarioResponseDTO[];
  if (data && Array.isArray(data.content))
    return data.content as UsuarioResponseDTO[];
  return [];
};

export const criarUsuario = async (
  usuario: UsuarioRequestDTO
): Promise<UsuarioResponseDTO> => {
  const response = await taskMirrorApi.post<UsuarioResponseDTO>(
    "/api/usuarios/admin/criar",
    usuario
  );
  return response.data;
};

export const atualizarUsuario = async (
  idUsuario: number,
  usuario: Partial<UsuarioRequestDTO> & { gerarNovaSenha?: boolean }
): Promise<UsuarioResponseDTO> => {
  const { gerarNovaSenha, ...payload } = usuario;

  const response = await taskMirrorApi.put<UsuarioResponseDTO>(
    `/api/usuarios/admin/atualizar/${idUsuario}?gerarNovaSenha=${
      gerarNovaSenha === true
    }`,
    payload
  );
  return response.data;
};

export const desativarUsuario = async (
  idUsuario: number
): Promise<UsuarioResponseDTO[]> => {
  const response = await taskMirrorApi.put<UsuarioResponseDTO[]>(
    `/api/usuarios/admin/desativar/${idUsuario}`
  );
  return response.data;
};

export const ativarUsuario = async (
  idUsuario: number
): Promise<UsuarioResponseDTO[]> => {
  const response = await taskMirrorApi.put<UsuarioResponseDTO[]>(
    `/api/usuarios/admin/ativar/${idUsuario}`
  );
  return response.data;
};

export const buscarUsuarioPorId = async (
  idUsuario: number
): Promise<UsuarioResponseDTO> => {
  const response = await taskMirrorApi.get<UsuarioResponseDTO>(
    `/api/usuarios/geral/${idUsuario}`
  );
  return response.data;
};

export const buscarTodosOsLideres = async (): Promise<LiderResponseDTO[]> => {
  const response = await taskMirrorApi.get<LiderResponseDTO[]>(
    `/api/usuarios/admin/todos-lideres/`
  );
  const data = response.data as any;
  if (Array.isArray(data)) return data as LiderResponseDTO[];
  if (data && Array.isArray(data.content))
    return data.content as LiderResponseDTO[];
  return [];
};

// produtividade por usuario (em %)
/* 
Essa operação calcula a produtividade de um usuário subordinado, 
que é baseada na média do tempo estimado versus o tempo real das tarefas concluídas. 
A produtividade é expressa como uma porcentagem. Este cálculo só é permitido para usuários com o papel ADMIN. 
O valor retornado será a produtividade média de todas as tarefas concluídas do usuário no sistema. 
Caso o usuário não tenha tarefas concluídas ou não tenha o papel adequado, a API retorna um erro.
*/
export const produtividadePorUsuario = async (
  idUsuario: number
): Promise<number> => {
  const response = await taskMirrorApi.get<number>(
    `/api/usuarios/admin/estatistica/produtividade/${idUsuario}`
  );
  return response.data;
};

export const totalUsuariosAtivos = async (): Promise<number> => {
  const response = await taskMirrorApi.get<number>(
    "/api/usuarios/admin/estatistica/total-usuarios-ativos"
  );
  return response.data;
};
