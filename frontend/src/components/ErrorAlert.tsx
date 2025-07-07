import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

interface ErrorAlertProps {
  error: string;
  onClose?: () => void;
  onRetry?: () => void;
  showCloseButton?: boolean;
}

export function ErrorAlert({ error, onClose, onRetry, showCloseButton = true }: ErrorAlertProps) {
  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('excede a margem de crédito') || errorMessage.includes('Valor solicitado')) {
      return 'credit_limit';
    }
    if (errorMessage.includes('Funcionário não encontrado')) {
      return 'user_not_found';
    }
    if (errorMessage.includes('deve ser pelo menos 100')) {
      return 'validation';
    }
    if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
      return 'rate_limit';
    }
    return 'general';
  };

  const errorType = getErrorType(error);

  const getErrorConfig = (type: string) => {
    switch (type) {
      case 'credit_limit':
        return {
          title: 'Limite de Crédito Excedido',
          description: 'O valor solicitado excede sua margem de crédito disponível.',
          icon: '💰',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconBgColor: 'bg-red-100',
          iconColor: 'text-red-600',
        };
      case 'user_not_found':
        return {
          title: 'Usuário Não Encontrado',
          description: 'Não foi possível encontrar suas informações. Tente fazer login novamente.',
          icon: '👤',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconBgColor: 'bg-orange-100',
          iconColor: 'text-orange-600',
        };
      case 'validation':
        return {
          title: 'Valor Inválido',
          description: 'O valor mínimo para simulação é R$ 100,00.',
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        };
      case 'rate_limit':
        return {
          title: 'Muitas Tentativas',
          description: 'Aguarde alguns segundos antes de tentar novamente.',
          icon: '⏱️',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
        };
      default:
        return {
          title: 'Erro na Simulação',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          icon: '❌',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconBgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
        };
    }
  };

  const config = getErrorConfig(errorType);

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 ${config.iconBgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{config.icon}</span>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.textColor} mb-1`}>
            {config.title}
          </h3>
          <p className={`text-sm ${config.textColor} mb-3`}>
            {config.description}
          </p>
          
          <div className="flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`px-3 py-1.5 text-xs font-medium ${config.iconBgColor} ${config.textColor} rounded-md hover:opacity-80 transition-opacity`}
              >
                Tentar Novamente
              </button>
            )}
            
            {errorType === 'credit_limit' && (
              <button
                onClick={() => window.history.back()}
                className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors"
              >
                Ajustar Valor
              </button>
            )}
            
            {errorType === 'user_not_found' && (
              <button
                onClick={() => window.location.href = '/login'}
                className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors"
              >
                Fazer Login
              </button>
            )}
          </div>
        </div>
        
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className={`p-1 ${config.iconColor} hover:opacity-70 transition-opacity`}
          >
            <Cross2Icon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
} 