import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Outfit', sans-serif;
  }

  body {
    background-color: #f8f9fa;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease-in-out;
  }

  input, select, textarea {
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #e50914;
    border-radius: 10px;
  }

  @media print {
    /* Esconder tudo por padrão */
    body * {
      visibility: hidden;
    }
    /* Mostrar apenas a área de captura ou a tabela de escala */
    #capture-area, #capture-area * {
      visibility: visible;
    }
    #capture-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
      border: none;
    }
    /* Esconder modais e overlays */
    .no-print, [role="dialog"], .modal-overlay {
      display: none !important;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

export const theme = {
  colors: {
    primary: '#e50914', // Vermelho Pratique
    secondary: '#1a1a1a',
    white: '#ffffff',
    gray: {
      light: '#f4f4f4',
      medium: '#e0e0e0',
      dark: '#666666'
    },
    success: '#27ae60',
    warning: '#f39c12',
    error: '#c0392b',
    blue: '#3498db',
    purple: '#9b59b6',
    dark: '#1a1a1a'
  },
  shadows: {
    soft: '0 2px 4px rgba(0, 0, 0, 0.05)',
    medium: '0 10px 25px rgba(0, 0, 0, 0.1)',
    hard: '0 20px 40px rgba(0, 0, 0, 0.2)'
  },
  radius: {
    small: '6px',
    medium: '12px',
    large: '24px',
    full: '999px'
  }
};
