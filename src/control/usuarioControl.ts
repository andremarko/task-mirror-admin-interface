import { useEffect, useState, useCallback } from "react";
import { usuarioService } from "../service/usuarioService";
import {
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  UsuarioEdicao,
  LiderResponseDTO,
} from "../model/usuario";

export const useUsuarioControl = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [totalUsuariosAtivos, setTotalUsuariosAtivos] = useState<number>(0);
  const [lideres, setLideres] = useState<LiderResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProd, setIsLoadingProd] = useState(false);
  const [produtividadeMap, setProdutividadeMap] = useState<
    Record<number, number | null>
  >({});
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const [selectedUsuario, setSelectedUsuario] =
    useState<UsuarioResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsuarios = useCallback(
    async (p: number = page, s: number = size) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await usuarioService.todosUsuarios(p, s);
        const users = Array.isArray(data) ? data : [];
        setUsuarios(users);
        // After loading users, prefetch productivity for subordinados so UI can show values after reload
        void (async () => {
          try {
            setIsLoadingProd(true);
            const subs = users.filter((u) =>
              String(u.roleUsuario || "")
                .toLowerCase()
                .includes("subordinado")
            );
            if (subs.length === 0) return;
            const entries = await Promise.all(
              subs.map(async (u) => {
                try {
                  const p = await usuarioService.produtividadePorUsuario(
                    u.idUsuario
                  );
                  const n = p != null ? Number(p) : null;
                  return [u.idUsuario, Number.isFinite(n) ? n : null] as [
                    number,
                    number | null
                  ];
                } catch (e) {
                  // treat missing tasks as null, other errors also set null
                  return [u.idUsuario, null] as [number, number | null];
                }
              })
            );
            const map: Record<number, number | null> = {};
            for (const [id, val] of entries)
              map[id as number] = val as number | null;
            setProdutividadeMap(map);
          } finally {
            setIsLoadingProd(false);
          }
        })();
        setPage(p);
        setSize(s);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar usuários");
      } finally {
        setIsLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    void loadUsuarios(0, size);
  }, [loadUsuarios, size]);

  const refresh = async () => {
    await loadUsuarios(page, size);
  };

  const criarUsuario = async (usuario: UsuarioRequestDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await usuarioService.criarUsuario(usuario);
      const normalized = {
        ...(created as UsuarioResponseDTO),
        ativo: (created as any).ativo ?? true,
      } as UsuarioResponseDTO;
      setUsuarios((prev) => [normalized, ...prev]);
      try {
        const isLider = String(normalized.roleUsuario || "")
          .toLowerCase()
          .includes("superior");
        if (isLider) {
          setLideres((prev) => [
            {
              idUsuario: normalized.idUsuario,
              username: normalized.username,
              funcao: normalized.funcao,
            },
            ...prev,
          ]);
        }
      } catch (e) {
        console.warn("failed to update lideres after criarUsuario", e);
      }
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Erro ao criar usuário");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarUsuario = async (
    idUsuario: number,
    usuario: UsuarioEdicao
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await usuarioService.atualizarUsuario(
        idUsuario,
        usuario as any
      );
      setUsuarios((prev) =>
        prev.map((u) => (u.idUsuario === updated.idUsuario ? updated : u))
      );

      try {
        const isLider = String(updated.roleUsuario || "")
          .toLowerCase()
          .includes("superior");
        setLideres((prev) => {
          const exists = prev.some((l) => l.idUsuario === updated.idUsuario);
          if (isLider && !exists) {
            return [
              {
                idUsuario: updated.idUsuario,
                username: updated.username,
                funcao: updated.funcao,
              },
              ...prev,
            ];
          }
          if (!isLider && exists) {
            return prev.filter((l) => l.idUsuario !== updated.idUsuario);
          }
          return prev.map((l) =>
            l.idUsuario === updated.idUsuario
              ? { ...l, username: updated.username, funcao: updated.funcao }
              : l
          );
        });
      } catch (e) {
        console.warn("failed to update lideres after atualizarUsuario", e);
      }
      return updated;
    } catch (err: any) {
      setError(err?.message ?? "Erro ao atualizar usuário");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const desativarUsuario = async (idUsuario: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedList = await usuarioService.desativarUsuario(idUsuario);
      setUsuarios(Array.isArray(updatedList) ? updatedList : []);
      return updatedList;
    } catch (err: any) {
      setError(err?.message ?? "Erro ao desativar usuário");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const ativarUsuario = async (idUsuario: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedList = await usuarioService.ativarUsuario(idUsuario);
      setUsuarios(Array.isArray(updatedList) ? updatedList : []);
      return updatedList;
    } catch (err: any) {
      setError(err?.message ?? "Erro ao ativar usuário");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const buscarUsuarioPorId = async (idUsuario: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const usuario = await usuarioService.buscarUsuarioPorId(idUsuario);
      return usuario;
    } catch (err: any) {
      setError(err?.message ?? "Erro ao buscar usuário");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Produtividade por usuário ----
  const loadProdutividadePorUsuario = useCallback(
    async (idUsuario: number): Promise<number | null> => {
      // Não usamos o estado global `isLoading` aqui para não disparar carregamento
      // da lista inteira repetidamente — o componente consumidor controla seu próprio loading por usuário.
      try {
        const produtividade = await usuarioService.produtividadePorUsuario(
          idUsuario
        );
        return produtividade;
      } catch (err: any) {
        const msg = err?.message || err?.response?.data || "";
        if (
          String(msg).toLowerCase().includes("não possui tarefas concluídas") ||
          String(msg)
            .toLowerCase()
            .includes("usuario nao possui tarefas concluidas") ||
          String(msg).toLowerCase().includes("ora-20010") ||
          String(msg).toLowerCase().includes("ora-20002")
        ) {
          return null;
        }
        setError(err?.message ?? "Erro ao obter produtividade do usuário");
        throw err;
      }
    },
    []
  );

  // ---- Total de usuários ativos ----
  const loadTotalUsuariosAtivos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const total = await usuarioService.totalUsuariosAtivos();
      setTotalUsuariosAtivos(total);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao obter total de usuários ativos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLideres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const lideres = await usuarioService.buscarTodosOsLideres();
      setLideres(lideres);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao obter líderes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openModalFor = (usuario: UsuarioResponseDTO | null) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUsuario(null);
    setIsModalOpen(false);
  };

  return {
    usuarios,
    isLoading,
    error,
    isLoadingProd,
    produtividadeMap,
    page,
    size,
    setPage,
    setSize,
    loadUsuarios,
    refresh,
    criarUsuario,
    loadLideres,
    lideres,
    atualizarUsuario,
    desativarUsuario,
    ativarUsuario,
    buscarUsuarioPorId,
    loadProdutividadePorUsuario,
    loadTotalUsuariosAtivos,
    totalUsuariosAtivos,
    selectedUsuario,
    isModalOpen,
    openModalFor,
    closeModal,
  };
};
