import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRightIcon, 
  PersonIcon, 
  ClockIcon, 
  CheckIcon, 
  Cross2Icon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@radix-ui/react-icons";
import { useUser } from "../../../contexts/UserContext";
import { emprestimoService } from "../../../app/services/emprestimoService";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { formatarMoeda, formatarData } from "../../../app/utils/format";

interface Parcela {
  numeroParcela: number;
  valor: number;
  dataVencimento: string;
}

interface Empresa {
  nomeRepresentante: string;
  razaoSocial: string;
  cnpj: string;
}

interface Funcionario {
  nome: string;
  email: string;
  empresa: Empresa;
}

interface Emprestimo {
  id: string;
  valorSolicitado: number;
  quantidadeParcelas: number;
  scoreUtilizado: number;
  statusAprovacao: string;
  dataSolicitacao: string;
  createdAt?: string;
  funcionario: Funcionario;
  parcelas: Parcela[];
}

export function Emprestimos() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Verificar se veio da confirmação de empréstimo
    const fromConfirmation = sessionStorage.getItem('fromConfirmation');
    if (fromConfirmation === 'true') {
      setShowSuccessMessage(true);
      sessionStorage.removeItem('fromConfirmation');
      
      // Auto-hide da mensagem após 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }

    async function loadEmprestimos() {
      try {
        setError(null);
        setIsLoading(true);
        
        const response = await emprestimoService.buscarEmprestimos();
        console.log('Resposta da API de empréstimos:', response);
        console.log('Tipo da resposta:', typeof response);
        console.log('É array?', Array.isArray(response));
        
        // Garantir que sempre temos um array
        setEmprestimos(Array.isArray(response) ? response : []);
      } catch (error: any) {
        console.error('Erro ao carregar empréstimos:', error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (error.response?.status === 429) {
          setError('Rate limit excedido. Aguarde um momento e tente novamente.');
        } else {
          setError('Erro ao carregar empréstimos. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEmprestimos();
  }, [navigate]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return {
          title: 'SOLICITAÇÃO DE EMPRÉSTIMO',
          icon: <ClockIcon className="w-6 h-6 text-orange-600" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        };
      case 'APROVADO':
        return {
          title: 'EMPRÉSTIMO CORRENTE',
          icon: <CheckIcon className="w-6 h-6 text-green-600" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'REPROVADO':
        return {
          title: 'EMPRÉSTIMO REPROVADO',
          icon: <Cross2Icon className="w-6 h-6 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      default:
        return {
          title: 'EMPRÉSTIMO',
          icon: <ClockIcon className="w-6 h-6 text-gray-600" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800'
        };
    }
  };

  const toggleCard = (emprestimoId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(emprestimoId)) {
      newExpanded.delete(emprestimoId);
    } else {
      newExpanded.add(emprestimoId);
    }
    setExpandedCards(newExpanded);
  };

  const handleVoltar = () => {
    navigate("/");
  };

  const handleNovoEmprestimo = () => {
    navigate("/simulacao");
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    loadEmprestimos();
  };

  // Função para recarregar dados (definida aqui para ser usada no handleRetry)
  const loadEmprestimos = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await emprestimoService.buscarEmprestimos();
      console.log('Resposta da API (retry):', response);
      console.log('Tipo da resposta (retry):', typeof response);
      console.log('É array (retry)?', Array.isArray(response));
      
      // Garantir que sempre temos um array
      setEmprestimos(Array.isArray(response) ? response : []);
    } catch (error: any) {
      console.error('Erro ao carregar empréstimos:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 429) {
        setError('Rate limit excedido. Aguarde um momento e tente novamente.');
      } else {
        setError('Erro ao carregar empréstimos. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const emprestimosMemo = useMemo(() => emprestimos, [emprestimos]);

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (userError || !user) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção Central */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-700 transition-colors"
            >
              Home
            </button>
            <ChevronRightIcon className="w-4 h-4" />
            <span>Crédito Consignado</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl font-bold text-blue-900 mb-8">
            Crédito Consignado
          </h1>

          {/* Bloco Principal */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Meus Empréstimos
            </h2>

            {/* Exibir erro se houver */}
            {error && (
              <ErrorAlert
                error={error}
                onRetry={handleRetry}
                showCloseButton={false}
              />
            )}

            {/* Mensagem de Sucesso */}
            {showSuccessMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-800 text-sm leading-relaxed font-medium">
                      Empréstimo solicitado com sucesso! 🎉
                    </p>
                    <p className="text-green-700 text-sm leading-relaxed mt-1">
                      Seu empréstimo foi registrado e está em análise. Você pode acompanhar o status abaixo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Alerta */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <PersonIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-800 text-sm leading-relaxed">
                    Você solicitou seu empréstimo! Agora aguarde as etapas de análises serem concluídas!
                  </p>
                </div>
              </div>
            </div>

            {/* Cards de Empréstimos */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(!emprestimos || !Array.isArray(emprestimos) || emprestimos.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Nenhum empréstimo encontrado</p>
                  <button
                    onClick={handleNovoEmprestimo}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                  >
                    Solicitar Primeiro Empréstimo
                  </button>
                </div>
              ) : (
                emprestimosMemo.map((emprestimo, index) => {
                  const statusInfo = getStatusInfo(emprestimo.statusAprovacao);
                  const isExpanded = expandedCards.has(emprestimo.id);
                  
                  return (
                    <div
                      key={emprestimo.id}
                      className={`bg-white rounded-lg border ${statusInfo.borderColor} shadow-sm transition-all duration-200`}
                    >
                      {/* Header do Card */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                              {statusInfo.icon}
                            </div>
                            <div>
                              <h3 className={`font-bold ${statusInfo.textColor}`}>
                                {statusInfo.title} {(index + 1).toString().padStart(2, '0')}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {formatarData(emprestimo.dataSolicitacao)}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleCard(emprestimo.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Detalhes Expandidos */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Valor Solicitado</p>
                              <p className="font-semibold text-gray-900">
                                {formatarMoeda(emprestimo.valorSolicitado)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Parcelas</p>
                              <p className="font-semibold text-gray-900">
                                {emprestimo.quantidadeParcelas}x
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Empresa</p>
                              <p className="font-semibold text-gray-900">
                                {emprestimo.funcionario.empresa.razaoSocial}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Score Utilizado</p>
                              <p className="font-semibold text-gray-900">
                                {emprestimo.scoreUtilizado}
                              </p>
                            </div>
                          </div>

                          {/* Parcelas */}
                          {emprestimo.parcelas && emprestimo.parcelas.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">Parcelas:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {emprestimo.parcelas.map((parcela) => (
                                  <div key={parcela.numeroParcela} className="bg-white p-2 rounded border">
                                    <p className="text-xs text-gray-600">
                                      Parcela {parcela.numeroParcela}
                                    </p>
                                    <p className="font-semibold text-sm">
                                      {formatarMoeda(parcela.valor)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Venc: {formatarData(parcela.dataVencimento)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleVoltar}
                className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleNovoEmprestimo}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Novo Empréstimo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 