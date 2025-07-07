import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRightIcon, PersonIcon } from "@radix-ui/react-icons";
import { useUser } from "../../../contexts/UserContext";
import { emprestimoService } from "../../../app/services/emprestimoService";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { Toast } from "../../components/Toast";
import { formatarMoeda } from "../../../app/utils/format";

interface ParcelaSelecionada {
  parcelas: number;
  valorParcela: number;
}

interface ConfirmacaoData {
  valorEmprestimo: number;
  parcelas: Array<{ parcelas: number; valorParcela: number }>;
  parcelaSelecionada: number;
  parcelaSelecionadaData: ParcelaSelecionada;
}

export function Confirmacao() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const confirmacaoData: ConfirmacaoData = location.state;

  const handleVoltar = () => {
    navigate("/simulacao/parcelamento", { 
      state: { valorEmprestimo: confirmacaoData.valorEmprestimo } 
    });
  };

  const handleSolicitarEmprestimo = async () => {
    if (!confirmacaoData) {
      setErrorMessage("Dados da simulação não encontrados");
      setShowErrorToast(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await emprestimoService.solicitarEmprestimo({
        valorSolicitado: confirmacaoData.valorEmprestimo,
        quantidadeParcelas: confirmacaoData.parcelaSelecionada
      });

      console.log('Empréstimo solicitado com sucesso:', response);
      setShowSuccessToast(true);
      
      // Marcar que veio da confirmação
      sessionStorage.setItem('fromConfirmation', 'true');
      
      // Redirecionar para página de empréstimos após 2 segundos
      setTimeout(() => {
        navigate("/emprestimos");
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao solicitar empréstimo:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao solicitar empréstimo. Tente novamente.';
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
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

  if (!confirmacaoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Dados da simulação não encontrados</p>
          <button 
            onClick={() => navigate("/simulacao")}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Voltar para Simulação
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
          <h1 className="text-3xl font-bold text-teal-600 mb-8">
            Resumo da Simulação
          </h1>

          {/* Bloco de Simulação */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Confirmação do Empréstimo
            </h2>

            {/* Alerta */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <PersonIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-800 text-sm leading-relaxed">
                    Pronto! Agora você já pode solicitar o empréstimo e recebê-lo na sua Conta Credifit! Veja o resumo da simulação!
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela de Resumo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="space-y-6">
                {/* Valor a Creditar */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Valor a Creditar</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatarMoeda(confirmacaoData.valorEmprestimo)}
                    </p>
                  </div>
                </div>

                {/* Valor a Financiar */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Valor a Financiar</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatarMoeda(confirmacaoData.valorEmprestimo)}
                    </p>
                  </div>
                </div>

                {/* Parcelamento */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Parcelamento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {confirmacaoData.parcelaSelecionada} x {formatarMoeda(confirmacaoData.parcelaSelecionadaData.valorParcela)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleVoltar}
                disabled={isLoading}
                className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </button>
              <button
                onClick={handleSolicitarEmprestimo}
                disabled={isLoading}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Solicitando..." : "Solicitar Empréstimo"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast de Sucesso */}
      <Toast
        message="Empréstimo solicitado com sucesso! Redirecionando para seus empréstimos..."
        type="success"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Toast de Erro */}
      <Toast
        message={errorMessage}
        type="error"
        isVisible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
} 