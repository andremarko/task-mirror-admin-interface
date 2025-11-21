import * as usuarioFetcher from '../fetcher/usuarioFetcher';
import { UsuarioRequestDTO } from '../model/usuario';

export const usuarioService = {
    todosUsuarios: async(page = 0, size = 10) => {
        const response = await usuarioFetcher.todosUsuarios(page, size);
        return response;
    },

    criarUsuario: async(usuario:UsuarioRequestDTO) => {
        const response = await usuarioFetcher.criarUsuario(usuario);
        return response;
    },

    atualizarUsuario: async(idUsuario: number, usuario: Partial<UsuarioRequestDTO> & { gerarNovaSenha?: boolean }) => {
        const response = await usuarioFetcher.atualizarUsuario(idUsuario, usuario);
        return response;
    },

    desativarUsuario: async (idUsuario: number) => {
        const response = await usuarioFetcher.desativarUsuario(idUsuario);
        return response;
    },

    ativarUsuario: async( idUsuario: number) => {
        const response = await usuarioFetcher.ativarUsuario(idUsuario);
        return response;
    },

    buscarUsuarioPorId: async (idUsuario: number) => {
        const response = await usuarioFetcher.buscarUsuarioPorId(idUsuario);
        return response;
    },

    produtividadePorUsuario: async (idUsuario: number) => {
        const response = await usuarioFetcher.produtividadePorUsuario(idUsuario);
        return response;
    },

    totalUsuariosAtivos: async () => {
        const response = await usuarioFetcher.totalUsuariosAtivos();
        return response;
    },

    buscarTodosOsLideres: async() => {
        const response = await usuarioFetcher.buscarTodosOsLideres();
        return response;
    }
}