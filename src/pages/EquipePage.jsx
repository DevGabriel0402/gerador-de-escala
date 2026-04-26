import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaDumbbell, FaStar } from 'react-icons/fa';


import { Card, Button, IconButton } from '../styles/components';
import { saveEmployee, deleteEmployee } from '../services/firestore';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormRow = styled(Card)`
  display: flex;
  gap: 1rem;
  background: ${props => props.theme.colors.gray.light};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.radius.medium};
  text-transform: uppercase;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.radius.medium};
  background: white;
  font-weight: bold;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-transform: uppercase;
  transition: all 0.3s;
  
  background: ${props => {
    if (!props.$active) return '#eee';
    return props.$type === 'low' ? props.theme.colors.primary : props.theme.colors.navy;
  }};
  
  color: ${props => props.$active ? 'white' : '#666'};
  border: 2px solid ${props => {
    if (!props.$active) return 'transparent';
    return props.$type === 'low' ? props.theme.colors.primary : props.theme.colors.navy;
  }};

  span {
    background: rgba(255, 255, 255, 0.2);
    color: ${props => props.$active ? 'white' : '#666'};
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 900;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${props => {
      if (props.$active) return;
      return '#e5e5e5';
    }};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const EmployeeCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border: 1px solid #eee;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border-radius: 8px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  span {
    font-weight: 900;
    color: #1a1a1a;
    font-size: 0.95rem;
    text-transform: uppercase;
  }
`;

export const EquipePage = ({ employees }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('low');
  const [activeTab, setActiveTab] = useState('low');



  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error('Informe o nome do funcionário');
      return;
    }
    try {
      await saveEmployee({ name: name.toUpperCase(), role });
      setName('');
      toast.success('Funcionário cadastrado com sucesso!');
    } catch (err) {
      toast.error('Erro ao cadastrar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este funcionário?')) {
      try {
        await deleteEmployee(id);
        toast.success('Removido com sucesso');
      } catch (err) {
        toast.error('Erro ao remover');
      }
    }
  };

  const filtered = employees.filter(e => e.role === activeTab);

  return (
    <Container>
      <div>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>Gerenciar Equipe</h2>
        <FormRow>
          <Input 
            placeholder="NOME COMPLETO" 
            value={name} 
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Select value={role} onChange={e => setRole(e.target.value)}>
            <option value="low">🔴 MUSCULAÇÃO LOW</option>
            <option value="prime">🔵 MUSCULAÇÃO PRIME</option>
          </Select>

          <Button $variant="primary" onClick={handleAdd}>
            + Adicionar
          </Button>
        </FormRow>
      </div>

      <div>
        <TabsContainer>
          <Tab $active={activeTab === 'low'} $type="low" onClick={() => setActiveTab('low')}>
            <FaDumbbell /> Musculação Low <span>{employees.filter(e => e.role === 'low').length}</span>
          </Tab>
          <Tab $active={activeTab === 'prime'} $type="prime" onClick={() => setActiveTab('prime')}>
            <FaStar /> Musculação Prime <span>{employees.filter(e => e.role === 'prime').length}</span>
          </Tab>
        </TabsContainer>
        <Grid>
          {filtered.length > 0 ? (
            filtered.map(emp => (
              <EmployeeCard key={emp.id}>
                <span>{emp.name}</span>
                <IconButton onClick={() => handleDelete(emp.id)} hoverColor="#e50914">
                  <FaTrash />
                </IconButton>
              </EmployeeCard>
            ))
          ) : (
            <p style={{ color: '#999', padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              Nenhum funcionário cadastrado neste setor.
            </p>
          )}
        </Grid>
      </div>
    </Container>
  );
};
