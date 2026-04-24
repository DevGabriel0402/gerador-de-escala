import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaXmark, FaArrowRightArrowLeft, FaUsers, FaDumbbell, FaDesktop, FaHeart } from 'react-icons/fa6';

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  @media (min-width: 768px) { align-items: center; padding: 2rem; }
`;

const Modal = styled.div`
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 32px 32px 0 0;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease-out;
  @media (min-width: 768px) { border-radius: 24px; animation: none; }
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  h3 { font-size: 1.2rem; font-weight: 900; color: #1a1a1a; display: flex; align-items: center; gap: 0.5rem; text-transform: uppercase; }
  p { font-size: 0.8rem; font-weight: bold; color: #666; margin-top: 4px; }
  .close { background: #eee; padding: 8px; border-radius: 50%; color: #666; font-size: 1.2rem; }
`;

const Content = styled.div`
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  &:last-child { margin-bottom: 0; }
  h4 { font-size: 0.7rem; font-weight: 900; color: #bbb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.8rem;
`;

const NameButton = styled.button`
  padding: 1rem;
  background: white;
  border: 2px solid #f1f1f1;
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #333;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: #fffafa;
    transform: scale(1.02);
  }

  &:active { transform: scale(0.98); }
`;

export const EmployeeSelectionModal = ({ modal, onClose, employees, onSelect }) => {
  if (!modal.isOpen) return null;

  const isSwap = modal.field?.startsWith('troca');

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <div>
            <h3>
              {isSwap ? <FaArrowRightArrowLeft color="#2980b9" /> : <FaUsers color="#e50914" />}
              {isSwap ? `Troca - ${modal.fieldName}` : `Escalar ${modal.fieldName}`}
            </h3>
            <p>
              {isSwap ? (
                modal.swapStep === 1 ? 'Passo 1: Quem vai SAIR?' : `Passo 2: Quem entra no lugar de ${modal.firstEmployee}?`
              ) : `${modal.dayName} - Escolha um funcionário`}
            </p>
          </div>
          <button className="close" onClick={onClose}><FaXmark /></button>
        </Header>
        
        <Content>
          {['professores', 'recepcao', 'bem_estar'].map(role => {
            const filtered = employees.filter(e => e.role === role);
            if (filtered.length === 0) return null;
            return (
              <Section key={role}>
                <h4>
                  {role === 'professores' ? <FaDumbbell /> : role === 'recepcao' ? <FaDesktop /> : <FaHeart />}
                  {role.replace('_', ' ')}
                </h4>
                <Grid>
                  {filtered.map(emp => (
                    <NameButton key={emp.id} onClick={() => onSelect(emp.name)}>
                      {emp.name}
                    </NameButton>
                  ))}
                </Grid>
              </Section>
            );
          })}
          {employees.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>Nenhum funcionário cadastrado.</p>}
        </Content>
      </Modal>
    </Overlay>
  );
};
