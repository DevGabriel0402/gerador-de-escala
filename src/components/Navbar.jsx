import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaUsers, FaDice, FaCog } from 'react-icons/fa';

const NavContainer = styled.div`
  @media (max-width: 900px) {
    padding-bottom: 70px; /* Espaço para a TabBar */
  }
`;

const TopHeader = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.hard};
  
  @media (max-width: 900px) {
    padding: 0.8rem 1rem;
    justify-content: center;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .logo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;

    img {
      height: 32px;
      object-fit: contain;
      @media (max-width: 900px) {
        height: 45px;
      }
    }

    span {
      font-size: 0.65rem;
      font-weight: 900;
      color: white;
      letter-spacing: 1px;
      margin-top: 4px;
      text-transform: uppercase;
    }
  }

  h1 {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    @media (max-width: 900px) {
      display: none;
    }
  }
`;

const DesktopMenu = styled.nav`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const TabButton = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : 'white'};
  padding: 0.6rem 1.2rem;
  border-radius: ${props => props.theme.radius.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  }

  svg { font-size: 1.1rem; }
`;

const MobileTabBar = styled.nav`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 0 10px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  @media (min-width: 901px) {
    display: none;
  }
  
  @media (max-width: 900px) {
    display: flex;
  }
`;

const MobileTab = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  color: ${props => props.$active ? props.theme.colors.primary : '#999'};
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  transition: all 0.3s ease;
  flex: 1;

  svg { 
    font-size: 1.4rem; 
    transform: ${props => props.$active ? 'translateY(-2px)' : 'none'};
  }
  
  span {
    opacity: ${props => props.$active ? 1 : 0.7};
  }
`;

export const Navbar = ({ activeTab, setActiveTab, unitName }) => {
  const tabs = [
    { id: 'escala', label: 'Escala', icon: <FaCalendarAlt /> },
    { id: 'equipe', label: 'Equipe', icon: <FaUsers /> },
    { id: 'sorteio', label: 'Sorteio', icon: <FaDice /> },
    { id: 'ajustes', label: 'Ajustes', icon: <FaCog /> },
  ];

  return (
    <NavContainer className="no-print">
      <TopHeader>
        <LogoSection>
          <div className="logo-box">
            <img src="https://pratiquefitness.com.br/wp-content/uploads/2025/10/pratique-logo-academia.webp" alt="Pratique" />
            <span>{unitName}</span>
          </div>
          <h1>Gerador de Escalas</h1>
        </LogoSection>

        <DesktopMenu>
          {tabs.map(tab => (
            <TabButton 
              key={tab.id}
              $active={activeTab === tab.id} 
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} <span>{tab.label}</span>
            </TabButton>
          ))}
        </DesktopMenu>
      </TopHeader>

      <MobileTabBar>
        {tabs.map(tab => (
          <MobileTab 
            key={tab.id}
            $active={activeTab === tab.id} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </MobileTab>
        ))}
      </MobileTabBar>
    </NavContainer>
  );
};
