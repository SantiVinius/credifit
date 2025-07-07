import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userService } from "../app/services/userService";

interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  salario: number;
  idEmpresa: string;
  empresa: {
    id: string;
    razaoSocial: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    // Se já temos os dados do usuário, não fazemos nova requisição
    if (user) return;
    
    // Se já está carregando, não fazemos nova requisição
    if (loading) return;
    
    // Verificar se ainda há token antes de fazer a requisição
    const token = localStorage.getItem("token");
    if (!token) {
      clearUser();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError("Erro ao carregar dados do usuário");
      console.error("Erro ao buscar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    setLoading(false);
  };

  const logout = () => {
    // Marcar como carregando para evitar novas requisições
    setLoading(true);
    
    // Limpar dados do usuário primeiro
    clearUser();
    
    // Limpar token
    localStorage.removeItem("token");

    // Redirecionar imediatamente
    window.location.href = "/login";
  };

  // Buscar dados do usuário quando o contexto é inicializado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user && !error && !loading) {
      // Verificar se estamos em uma rota que precisa dos dados do usuário
      const currentPath = window.location.pathname;
      const needsUserData = currentPath !== "/login" && currentPath !== "/register";
      
      if (needsUserData) {
        // Pequeno delay para evitar conflitos durante logout
        const timer = setTimeout(() => {
          fetchUser();
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    fetchUser,
    clearUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
