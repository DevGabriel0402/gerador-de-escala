import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaUsers, FaDice, FaCog, FaBars, FaTimes, FaCalendarCheck } from 'react-icons/fa';

const SIDEBAR_WIDTH = '240px';
const SIDEBAR_COLLAPSED = '72px';

const SidebarWrap = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${p => p.$open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED};
  background: #e50914;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(.4,0,.2,1);
  z-index: 200;
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(229,9,20,0.18);

  @media (max-width: 900px) {
    width: ${p => p.$open ? '100vw' : '0'};
    border-radius: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${p => p.$open ? '1.4rem 1.4rem 1rem' : '1.4rem 0 1rem'};
  justify-content: ${p => p.$open ? 'flex-start' : 'center'};
  min-height: 76px;
  border-bottom: 1px solid rgba(255,255,255,0.15);

  img {
    height: 34px;
    object-fit: contain;

    flex-shrink: 0;
  }

  .brand {
    display: ${p => p.$open ? 'flex' : 'none'
  };
    flex-direction: column;
    white-space: nowrap;
    overflow: hidden;

    strong {
      color: #fff;
      font-size: 1.05rem;
      font-weight: 900;
      letter-spacing: 1px;
    }

    span {
      color: rgba(255,255,255,0.7);
      font-size: 0.65rem;
      letter-spacing: 2px;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: ${p => p.$open ? '0.85rem 1.4rem' : '0.85rem 0'};
  justify-content: ${p => p.$open ? 'flex-start' : 'center'};
  background: ${p => p.$active ? 'rgba(255,255,255,0.18)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.72)'};
  border: none;
  cursor: pointer;
  border-left: ${p => p.$active ? '4px solid #fff' : '4px solid transparent'};
  border-radius: 0 10px 10px 0;
  margin-right: 12px;
  transition: all 0.2s;
  font-weight: ${p => p.$active ? '900' : '600'};
  font-size: 0.9rem;
  white-space: nowrap;

  svg {
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  span {
    display: ${p => p.$open ? 'inline' : 'none'};
  }

  &:hover {
    background: rgba(255,255,255,0.14);
    color: #fff;
  }
`;

const UnitBadge = styled.div`
  padding: ${p => p.$open ? '1rem 1.4rem' : '1rem 0'};
  text-align: ${p => p.$open ? 'left' : 'center'};
  border-top: 1px solid rgba(255,255,255,0.15);

  .label {
    display: ${p => p.$open ? 'block' : 'none'};
    font-size: 0.6rem;
    color: rgba(255,255,255,0.5);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .name {
    display: ${p => p.$open ? 'block' : 'none'};
    font-size: 0.85rem;
    color: #fff;
    font-weight: 900;
    text-transform: uppercase;
  }

  .dot {
    display: ${p => p.$open ? 'none' : 'block'};
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto;
  }
`;

const MobileBar = styled.nav`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  height: 66px;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.10);
  z-index: 300;
  border-top: 1.5px solid #f0f0f0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  @media (max-width: 900px) {
    display: flex;
  }
`;

const MobileTab = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: transparent;
  border: none;
  color: ${p => p.$active ? '#e50914' : '#bbb'};
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  flex: 1;
  padding: 8px 0;
  transition: all 0.2s;

  svg {
    font-size: 1.3rem;
    transform: ${p => p.$active ? 'translateY(-3px)' : 'none'};
    transition: transform 0.2s;
  }
`;

const ToggleBtn = styled.button`
  position: fixed;
  top: 1.3rem;
  left: ${p => p.$open ? `calc(${SIDEBAR_WIDTH} + 8px)` : `calc(${SIDEBAR_COLLAPSED} + 8px)`};
  z-index: 300;
  background: #fff;
  border: 2px solid #e50914;
  color: #e50914;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 12px rgba(229,9,20,0.18);
  font-size: 0.75rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const TABS = [
  { id: 'escala', label: 'Escala', icon: <FaCalendarAlt /> },
  { id: 'escalado', label: 'Escalado', icon: <FaCalendarCheck /> },
  { id: 'equipe', label: 'Profissionais', icon: <FaUsers /> },
  { id: 'sorteio', label: 'Sorteio', icon: <FaDice /> },
  { id: 'ajustes', label: 'Configurações', icon: <FaCog /> },
];

export const Sidebar = ({ activeTab, setActiveTab, unitName, open, setOpen }) => {

  return (
    <>
      <SidebarWrap $open={open} className="no-print">
        <Logo $open={open}>
          <img src="/logo.png" alt="Pratique" />
          <div className="brand">
            <strong>ESCALA</strong>
            <span>PRATIQUE FITNESS</span>
          </div>
        </Logo>

        <Nav>
          {TABS.map(tab => (
            <NavItem
              key={tab.id}
              $active={activeTab === tab.id}
              $open={open}
              onClick={() => setActiveTab(tab.id)}
              title={!open ? tab.label : ''}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </NavItem>
          ))}
        </Nav>

        <UnitBadge $open={open}>
          <div className="label">Unidade</div>
          <div className="name">{unitName}</div>
          <div className="dot" />
        </UnitBadge>
      </SidebarWrap>

      <ToggleBtn $open={open} onClick={() => setOpen(p => !p)} className="no-print">
        {open ? <FaTimes /> : <FaBars />}
      </ToggleBtn>

      <MobileBar className="no-print">
        {TABS.map(tab => (
          <MobileTab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </MobileTab>
        ))}
      </MobileBar>
    </>
  );
};
