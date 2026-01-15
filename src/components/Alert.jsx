import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const config = {
    info: {
      icon: <AlertCircle className="w-5 h-5" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
  }[type];

  return (
    <div className={`rounded-lg border ${config.bg} ${config.border} p-4 animate-fade-in`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className={config.iconColor}>{config.icon}</div>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.text}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`mt-2 text-sm ${config.text}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md ${config.bg} ${config.text} hover:opacity-75 focus:outline-none`}
            >
              <span className="sr-only">Fechar</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;