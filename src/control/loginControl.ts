import { useState } from "react";
import { LoginRequestDTO } from "../model/login";
import { loginService } from "../service/loginService";

export const useLoginControl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequestDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginService.login(credentials);
      return data;
    } catch (err: any) {
      const message = err?.message || String(err) || "Erro ao autenticar";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, setError } as const;
};

export default useLoginControl;
