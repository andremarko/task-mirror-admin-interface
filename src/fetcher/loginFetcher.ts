import { LoginRequestDTO, LoginResponseDTO } from "../model/login";
import { taskMirrorApi } from "./api";

export const loginUser = async (
  loginData: LoginRequestDTO
): Promise<LoginResponseDTO> => {
  try {
    const response = await taskMirrorApi.post<LoginResponseDTO>(
      "/login",
      loginData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Erro ao fazer login";
  }
};
