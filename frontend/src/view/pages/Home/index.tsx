import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { emprestimoService } from "../../../app/services/emprestimoService";
import { AvatarIcon, ExitIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { formatarMoeda } from "../../../app/utils/format";

export function Home() {
  const { user, loading, error, logout } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [emprestimosAtivos, setEmprestimosAtivos] = useState(0);
  const [loadingEmprestimos, setLoadingEmprestimos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Buscar empréstimos ativos
  useEffect(() => {
    const fetchEmprestimosAtivos = async () => {
      if (!user) return;
      
      setLoadingEmprestimos(true);
      try {
        const emprestimos = await emprestimoService.buscarEmprestimos();
        
        if (!emprestimos || emprestimos.length === 0) {
          setEmprestimosAtivos(0);
          return;
        }
        
        // Contar apenas empréstimos com status "APROVADO"
        const ativos = emprestimos.filter(emp => emp.statusAprovacao === "APROVADO").length;
        setEmprestimosAtivos(ativos);
      } catch (error) {
        console.error("Erro ao buscar empréstimos:", error);
        // Em caso de erro, mantém o valor atual ou define como 0
        setEmprestimosAtivos(0);
      } finally {
        setLoadingEmprestimos(false);
      }
    };

    fetchEmprestimosAtivos();
  }, [user]);

  // Refresh dos dados quando a página ganha foco
  useEffect(() => {
    const handleFocus = () => {
      if (user && !loadingEmprestimos) {
        const fetchEmprestimosAtivos = async () => {
          try {
            const emprestimos = await emprestimoService.buscarEmprestimos();
            if (emprestimos && emprestimos.length > 0) {
              const ativos = emprestimos.filter(emp => emp.statusAprovacao === "APROVADO").length;
              setEmprestimosAtivos(ativos);
            }
          } catch (error) {
            // Silenciar erro de atualização automática
          }
        };
        fetchEmprestimosAtivos();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, loadingEmprestimos]);

  const handleLogout = () => {
    logout();
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados do usuário</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CrediFit</h1>
              <p className="text-sm text-gray-500">Sistema de Empréstimos</p>
            </div>
            
            {/* Menu do Usuário */}
            <div className="relative user-menu">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <AvatarIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.empresa.razaoSocial}
                  </p>
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.nome}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {user.empresa.razaoSocial}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ExitIcon className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Empréstimos Ativos</h3>
              <p className="text-xs text-blue-600 mt-1">Aprovados e em andamento</p>
              {loadingEmprestimos ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-blue-200 rounded w-12"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-blue-900">
                  {emprestimosAtivos > 0 ? emprestimosAtivos : '0'}
                </p>
              )}
            </div>
            
                          <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Empresa</h3>
                <p className="text-lg font-bold text-green-900">
                  {user.empresa.razaoSocial}
                </p>
              </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-orange-800">Status</h3>
              <p className="text-lg font-bold text-orange-900">
                Ativo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/simulacao")}
                className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <span>Nova Simulação</span>
              </button>
              
              <button 
                onClick={() => navigate("/emprestimos")}
                className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <span>Ver Empréstimos</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
