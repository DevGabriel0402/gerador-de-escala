import React from 'react';
import styled from 'styled-components';
import { Card, Button, IconButton } from '../styles/components';
import { FaXmark, FaCircleInfo, FaTriangleExclamation, FaCircleCheck } from 'react-icons/fa6';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Content = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  padding: 2.5rem 2rem 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  transform: translateY(0);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 1.5rem;
    background: ${props => props.$type === 'danger' ? '#fff1f1' : props.$type === 'success' ? '#f0fff4' : '#ebf5ff'};
    color: ${props => props.$type === 'danger' ? '#e50914' : props.$type === 'success' ? '#22c55e' : '#3498db'};
  }

  h3 { 
    font-size: 1.5rem; 
    font-weight: 900; 
    margin-bottom: 0.8rem; 
    color: #1a1a1a;
    text-transform: uppercase;
  }
  
  p { 
    color: #666; 
    margin-bottom: 2rem; 
    line-height: 1.6;
    font-size: 1rem;
  }
  
  .footer { 
    display: flex; 
    gap: 1rem; 
    justify-content: center; 
  }
`;

export const CustomModal = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  type = 'info', // 'info', 'danger', 'success'
  isAlert = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger': return <FaTriangleExclamation />;
      case 'success': return <FaCircleCheck />;
      default: return <FaCircleInfo />;
    }
  };

  return (
    <Overlay onClick={onCancel}>
      <Content $type={type} onClick={e => e.stopPropagation()}>
        <IconButton 
          style={{ position: 'absolute', top: '15px', right: '15px' }} 
          onClick={onCancel}
        >
          <FaXmark />
        </IconButton>
        
        <div className="icon-wrapper">
          {getIcon()}
        </div>

        <h3>{title}</h3>
        <p>{message}</p>
        
        <div className="footer">
          {!isAlert && (
            <Button $variant="outline" onClick={onCancel} style={{ flex: 1, fontWeight: 900 }}>
              {cancelText}
            </Button>
          )}
          <Button 
            $variant={type === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm} 
            style={{ flex: 1, fontWeight: 900 }}
          >
            {confirmText}
          </Button>
        </div>
      </Content>
    </Overlay>
  );
};
