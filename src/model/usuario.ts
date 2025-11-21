export interface UsuarioRequestDTO {
  username: string;
  idLider?: number | null;
  roleUsuario: string;
  funcao: string;
  cargo: string;
  setor: string;
}

export interface UsuarioResponseDTO {
  idUsuario: number;
  username: string;
  funcao: string;
  cargo: string;
  setor: string;
  ativo: boolean;
  senhaGerada?: string;
  idLider?: number | null;
  roleUsuario: string;
}

export interface LiderResponseDTO {
  idUsuario: number;
  username: string;
  funcao: string;
}

export type UsuarioEdicao = Partial<
  Pick<
    UsuarioRequestDTO,
    "username" | "roleUsuario" | "funcao" | "cargo" | "setor" | "idLider"
  >
> & { gerarNovaSenha?: boolean };
