import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, PersonIcon } from "@radix-ui/react-icons";
import { useUser } from "../../../contexts/UserContext";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { formatarMoeda } from "../../../app/utils/format";

export function Simulacao() {
  const { user, loading, error } = useUser();
  const navigate = useNavigate();

  // Calcular valor inicial baseado no salário do usuário (assumindo 35% do salário)
  const valorMaximo = user?.salario ? user.salario * 0.35 : 50000; // Usar salário real se disponível
  const [valorEmprestimo, setValorEmprestimo] = useState(() => {
    // Definir valor inicial como 10% do limite ou R$ 5.000, o que for menor
    const valorInicial = Math.min(valorMaximo * 0.1, 5000);
    return Math.max(valorInicial, 500); // Mínimo de R$ 500
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Atualizar valor inicial quando o usuário carrega
  useEffect(() => {
    if (user?.salario) {
      const novoValorMaximo = user.salario * 0.35;
      const novoValorInicial = Math.min(novoValorMaximo * 0.1, 5000);
      setValorEmprestimo(Math.max(novoValorInicial, 500));
    }
  }, [user]);

  const handleValorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = Number(event.target.value);
    const valorMaximo = 50000; // Valor padrão
    
    // Garantir que o valor não exceda o limite
    const valorLimitado = Math.min(novoValor, valorMaximo);
    setValorEmprestimo(valorLimitado);
  };

  const handleSimular = () => {
    // Validar se o valor não excede o limite
    if (valorEmprestimo > valorMaximo) {
      setErrorMessage(`Valor solicitado (R$ ${valorEmprestimo.toLocaleString('pt-BR')}) excede a margem de crédito disponível (R$ ${valorMaximo.toLocaleString('pt-BR')})`);
      setShowError(true);
      return;
    }

    // Navegar para a segunda etapa com o valor selecionado
    navigate("/simulacao/parcelamento", { 
      state: { valorEmprestimo } 
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Crédito Consignado
          </h1>

          {/* Bloco de Simulação */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Simular Empréstimo
            </h2>

            {/* Exibir erro se houver */}
            {showError && (
              <ErrorAlert
                error={errorMessage}
                onClose={() => setShowError(false)}
                showCloseButton={true}
              />
            )}

            {/* Alerta */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <PersonIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-800 text-sm leading-relaxed">
                    Você possui saldo para Crédito Consignado pela empresa{" "}
                    <span className="font-semibold">{user.empresa.razaoSocial}</span>. 
                    Faça uma simulação! Selecione quanto você precisa:
                  </p>
                </div>
              </div>
            </div>

            {/* Campo de Valor */}
            <div className="text-center mb-8">
              <div className="bg-gray-100 rounded-lg p-6 inline-block">
                <p className="text-sm text-gray-600 mb-2">Valor do Empréstimo</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatarMoeda(valorEmprestimo)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Limite disponível: {formatarMoeda(valorMaximo)}
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>R$ 500,00</span>
                <span>{formatarMoeda(valorMaximo)}</span>
              </div>
              <input
                type="range"
                min="500"
                max={valorMaximo}
                step="1"
                value={valorEmprestimo}
                onChange={handleValorChange}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${((valorEmprestimo - 500) / (valorMaximo - 500)) * 100}%, #e5e7eb ${((valorEmprestimo - 500) / (valorMaximo - 500)) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSimular}
                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Simular empréstimo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 