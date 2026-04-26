import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

const AccordionContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 250px;
  max-width: 350px;
`;

const AccordionHeader = styled.div`
  background: white;
  padding: 0.8rem 1.2rem;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.radius.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  .arrow {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    color: ${props => props.theme.colors.primary};
  }
`;

const AccordionContent = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.radius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 100;
  overflow: hidden;
  max-height: ${props => props.$isOpen ? '300px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: all 0.3s ease-in-out;
`;

const OptionItem = styled.div`
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    background: ${props => props.theme.colors.gray.light};
    color: ${props => props.theme.colors.primary};
  }

  ${props => props.$isSelected && `
    background: ${props.theme.colors.gray.light};
    color: ${props.theme.colors.primary};
    border-left: 4px solid ${props.theme.colors.primary};
  `}
`;

export const CustomAccordionSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <AccordionContainer>
      <AccordionHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder || 'Selecione...'}</span>
        <FaChevronDown className="arrow" />
      </AccordionHeader>
      <AccordionContent $isOpen={isOpen}>
        {options.map((option) => (
          <OptionItem
            key={option.value}
            $isSelected={option.value === value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </OptionItem>
        ))}
      </AccordionContent>
    </AccordionContainer>
  );
};
