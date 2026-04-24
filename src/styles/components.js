import styled, { css } from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.radius.large};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.gray.medium};
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s;
  color: white;

  ${props => props.$variant === 'primary' && css`
    background: ${props.theme.colors.primary};
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'secondary' && css`
    background: ${props.theme.colors.secondary};
    &:hover { filter: brightness(1.3); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'success' && css`
    background: ${props.theme.colors.success};
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'blue' && css`
    background: ${props.theme.colors.blue};
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'purple' && css`
    background: ${props.theme.colors.purple};
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'dark' && css`
    background: ${props.theme.colors.dark};
    &:hover { filter: brightness(1.3); transform: translateY(-2px); }
  `}

  ${props => props.$variant === 'outline' && css`
    background: transparent;
    color: ${props.theme.colors.gray.dark};
    border: 1px solid ${props.theme.colors.gray.medium};
    &:hover { background: ${props.theme.colors.gray.light}; transform: translateY(-1px); }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  color: ${props => props.color || props.theme.colors.gray.dark};
  padding: 0.4rem;
  border-radius: ${props => props.theme.radius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.theme.colors.gray.light};
    color: ${props => props.hoverColor || props.theme.colors.primary};
  }
`;
