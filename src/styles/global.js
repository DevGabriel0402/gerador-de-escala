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
    @page {
      size: A4;
      margin: 5mm;
    }
    body {
      background: #fff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    #root > *:not(.modal-overlay) {
      display: none !important;
    }
    .no-print, button, nav {
      display: none !important;
    }
    .modal-overlay {
      position: static !important;
      background: none !important;
      padding: 0 !important;
      display: block !important;
    }
    .modal-content {
      position: static !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: none !important;
      display: block !important;
    }
    #capture-area {
      max-height: none !important;
      overflow: visible !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
    }
    #print-area {
      display: block !important;
      visibility: visible !important;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      max-height: none !important;
      overflow: visible !important;
    }
    #print-area * {
      visibility: visible !important;
    }
    /* Garantir que o texto seja preto */
    #print-area table, #print-area td, #print-area th {
      border: 1px solid #000 !important;
      color: #000 !important;
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
    navy: '#1a2a3a',
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
