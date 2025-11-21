import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { loginService } from "../service/loginService";
import { LoginRequestDTO } from "../model/login";

const TOKEN_KEY = "token";
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const decodeToken = (token: string) => {
    return (jwtDecode as any)(token);
  };
  const normalizeUser = (decoded: any) => {
    if (!decoded) return null;
    const username =
      decoded.username ||
      decoded.preferred_username ||
      decoded.user_name ||
      decoded.sub ||
      decoded.email ||
      null;
    const name =
      decoded.name || decoded.given_name || decoded.full_name || null;
    return { ...decoded, username, name };
  };
  useEffect(() => {
    const t = token || localStorage.getItem(TOKEN_KEY);
    if (t) {
      try {
        const decoded = decodeToken(t as string);
        const roles: any =
          decoded?.role || decoded?.roles || decoded?.authorities || null;
        const hasAdmin = Array.isArray(roles)
          ? roles.some((r: string) => String(r).toLowerCase().includes("admin"))
          : String(roles || "")
              .toLowerCase()
              .includes("admin");
        if (hasAdmin) {
          setUser(normalizeUser(decoded));
          setToken(t);
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);
  const signIn = async (cred: LoginRequestDTO) => {
    const resp = await loginService.login(cred);
    try {
      const decoded = decodeToken(resp.token as string);
      const roles: any =
        decoded?.role ||
        decoded?.roles ||
        decoded?.authorities ||
        resp.role ||
        null;
      const hasAdmin = Array.isArray(roles)
        ? roles.some((r: string) => String(r).toLowerCase().includes("admin"))
        : String(roles || "")
            .toLowerCase()
            .includes("admin");
      if (!hasAdmin) {
        throw new Error("Acesso negado: usuário não é administrador");
      }
      localStorage.setItem(TOKEN_KEY, resp.token);
      setToken(resp.token);
      setUser(normalizeUser(decoded));
      setLoading(false);
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setLoading(false);
      throw e;
    }
  };
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
