import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRightIcon, PersonIcon } from "@radix-ui/react-icons";
import { useUser } from "../../../contexts/UserContext";
import { emprestimoService } from "../../../app/services/emprestimoService";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { formatarMoeda } from "../../../app/utils/format";

interface OpcaoParcelamento {
  parcelas: number;
  valorParcela: number;
}

interface SimulacaoResponse {
  valorSolicitado: number;
  margemCredito: number;
  opcoesParcelamento: OpcaoParcelamento[];
}

export function Parcelamento() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<number | null>(null);
  const [simulacao, setSimulacao] = useState<SimulacaoResponse | null>(null);
  const [isSimulando, setIsSimulando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const valorEmprestimo = location.state?.valorEmprestimo || 5000;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadData() {
      try {
        setError(null);
        setIsSimulando(true);

        // Simular empréstimo na API
        console.log('Valor do empréstimo sendo enviado:', valorEmprestimo);
        console.log('Tipo do valor:', typeof valorEmprestimo);
        console.log('Estado completo recebido:', location.state);
        
        const simulacaoResponse = await emprestimoService.simularEmprestimo({
          valorSolicitado: valorEmprestimo
        });
        setSimulacao(simulacaoResponse);
      } catch (error: any) {
        console.error('Erro na simulação:', error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (error.response?.status === 429) {
          setError('Rate limit excedido. Aguarde um momento e tente novamente.');
        } else if (error.response?.status === 400) {
          // Tratar diferentes tipos de erro 400
          const errorMessage = error.response?.data?.message || error.message || 'Erro na validação dos dados';
          setError(errorMessage);
        } else {
          setError('Erro inesperado ao simular empréstimo. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
        setIsSimulando(false);
      }
    }

    loadData();
  }, [navigate, valorEmprestimo]);

  const handleVoltar = () => {
    navigate("/simulacao");
  };

  const handleSeguinte = () => {
    if (parcelaSelecionada && simulacao) {
      const parcelaSelecionadaData = simulacao.opcoesParcelamento.find(
        opcao => opcao.parcelas === parcelaSelecionada
      );
      
      // Navegar para a próxima etapa
      navigate("/simulacao/confirmacao", {
        state: { 
          valorEmprestimo: simulacao.valorSolicitado,
          parcelas: simulacao.opcoesParcelamento,
          parcelaSelecionada,
          parcelaSelecionadaData
        }
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsSimulando(true);
    loadData();
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Função para recarregar dados (definida aqui para ser usada no handleRetry)
  const loadData = async () => {
    try {
      setError(null);
      setIsSimulando(true);

      const simulacaoResponse = await emprestimoService.simularEmprestimo({
        valorSolicitado: valorEmprestimo
      });
      setSimulacao(simulacaoResponse);
    } catch (error: any) {
      console.error('Erro na simulação:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 429) {
        setError('Rate limit excedido. Aguarde um momento e tente novamente.');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.message || 'Erro na validação dos dados';
        setError(errorMessage);
      } else {
        setError('Erro inesperado ao simular empréstimo. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
      setIsSimulando(false);
    }
  };

  if (userLoading || isLoading || isSimulando) {
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

          {/* Bloco de Simulação */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Simular Empréstimo
            </h2>

            {/* Exibir erro se houver */}
            {error && (
              <ErrorAlert
                error={error}
                onClose={handleCloseError}
                onRetry={handleRetry}
                showCloseButton={true}
              />
            )}

            {/* Conteúdo principal - só mostrar se não houver erro */}
            {!error && simulacao && (
              <>
                {/* Alerta */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <PersonIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-orange-800 text-sm leading-relaxed">
                        Escolha a opção de parcelamento que melhor funcionar para você:
                      </p>
                    </div>
                  </div>
                </div>

                {/* Valor Total */}
                <div className="text-center mb-8">
                  <div className="bg-gray-100 rounded-lg p-6 inline-block">
                    <p className="text-sm text-gray-600 mb-2">Valor Total do Empréstimo</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatarMoeda(simulacao.valorSolicitado)}
                    </p>
                  </div>
                </div>

                {/* Texto "Divididas em" */}
                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-700">Divididas em:</p>
                </div>

                {/* Grade de Parcelas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {simulacao.opcoesParcelamento.map((opcao) => (
                    <button
                      key={opcao.parcelas}
                      onClick={() => setParcelaSelecionada(opcao.parcelas)}
                      className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                        parcelaSelecionada === opcao.parcelas
                          ? 'border-teal-500 shadow-md'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {/* Faixa vertical laranja */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-lg"></div>
                      
                      {/* Conteúdo do cartão */}
                      <div className="p-4 pl-6 text-center">
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {opcao.parcelas}x
                        </p>
                        <p className="text-sm text-gray-600">de</p>
                        <p className="text-lg font-semibold text-teal-600">
                          {formatarMoeda(opcao.valorParcela)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleVoltar}
                    className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSeguinte}
                    disabled={!parcelaSelecionada}
                    className={`px-8 py-3 font-medium rounded-lg transition-colors ${
                      parcelaSelecionada
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Seguinte
                  </button>
                </div>
              </>
            )}

            {/* Se não há erro nem simulação, mostrar mensagem */}
            {!error && !simulacao && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Nenhuma simulação disponível</p>
                <button
                  onClick={handleVoltar}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 