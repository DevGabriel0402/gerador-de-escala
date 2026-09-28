import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaDumbbell, FaStar, FaCamera, FaUpload } from 'react-icons/fa';
import logoPratique from '../assets/Menor-PRATIQUE.png';
import { Card, Button, IconButton } from '../styles/components';
import { saveEmployee, deleteEmployee } from '../services/firestore';
import { CustomAccordionSelect } from '../components/CustomAccordionSelect';
import toast from 'react-hot-toast';

const PageTitle = styled.div`
  margin-bottom: 2rem;
  h2 {
    font-size: 1.6rem;
    font-weight: 900;
    color: #1a1a1a;
  }
  p { color: #888; font-size: 0.9rem; margin-top: 4px; }
`;

const AddCard = styled(Card)`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 140px;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  background: #fafafa;
  transition: border-color 0.2s;

  &:focus {
    border-color: #e50914;
    background: #fff;
  }
`;

const TabsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-weight: 900;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-transform: uppercase;
  border: 2px solid ${p => {
    if (!p.$active) return '#eee';
    return p.$type === 'low' ? '#e50914' : '#1a2a3a';
  }};
  background: ${p => {
    if (!p.$active) return '#f5f5f5';
    return p.$type === 'low' ? '#e50914' : '#1a2a3a';
  }};
  color: ${p => p.$active ? '#fff' : '#888'};
  cursor: pointer;
  transition: all 0.2s;

  .count {
    background: rgba(255,255,255,0.22);
    color: ${p => p.$active ? '#fff' : '#888'};
    padding: 1px 8px;
    border-radius: 20px;
    font-size: 0.7rem;
  }

  &:hover { transform: translateY(-1px); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
`;

const EmpCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f0f0f0;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.2s;

  &:hover {
    border-color: #e50914;
    box-shadow: 0 6px 20px rgba(229,9,20,0.10);
    transform: translateY(-2px);
  }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid ${p => p.$type === 'prime' ? '#1a2a3a' : '#e50914'};
  cursor: pointer;
  position: relative;

  img.photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img.placeholder {
    width: 68%;
    height: 68%;
    object-fit: contain;
    filter: ${p => p.$type === 'prime'
      ? 'brightness(0) saturate(100%) invert(11%) sepia(39%) saturate(1200%) hue-rotate(185deg) brightness(90%) contrast(95%)'
      : 'brightness(0) saturate(100%) invert(14%) sepia(88%) saturate(4000%) hue-rotate(349deg) brightness(95%) contrast(100%)'
    };
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    svg { font-size: 1rem; color: #fff; }
  }

  &:hover .overlay {
    display: flex;
  }
`;

const EmpInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 900;
    font-size: 0.95rem;
    text-transform: uppercase;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${p => p.$type === 'prime' ? '#1a2a3a' : '#e50914'};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${p => p.$type === 'prime' ? 'rgba(26,42,58,0.10)' : 'rgba(229,9,20,0.10)'};
  color: ${p => p.$type === 'prime' ? '#1a2a3a' : '#e50914'};
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 900;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: #ccc;
  svg { font-size: 3rem; margin-bottom: 1rem; }
  p { font-weight: 700; font-size: 0.9rem; }
`;

export const EquipePage = ({ employees }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('low');
  const [activeTab, setActiveTab] = useState('low');
  const fileRefs = useRef({});

  const handleAdd = async () => {
    if (!name.trim()) { toast.error('Informe o nome do profissional'); return; }
    try {
      await saveEmployee({ name: name.toUpperCase(), role, photo: '' });
      setName('');
      toast.success('Profissional cadastrado!');
    } catch {
      toast.error('Erro ao cadastrar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este profissional?')) {
      try { await deleteEmployee(id); toast.success('Removido!'); }
      catch { toast.error('Erro ao remover'); }
    }
  };

  const handlePhoto = async (emp, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await saveEmployee({ ...emp, photo: e.target.result });
        toast.success('Foto atualizada!');
      } catch { toast.error('Erro ao salvar foto'); }
    };
    reader.readAsDataURL(file);
  };

  const filtered = employees.filter(e => e.role === activeTab);

  return (
    <div>
      <PageTitle>
        <h2>Profissionais</h2>
        <p>Gerencie a equipe por setor (LOW / PRIME)</p>
      </PageTitle>

      <AddCard>
        <InputGroup>
          <label>Nome completo</label>
          <Input
            placeholder="EX: JOÃO SILVA"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </InputGroup>
        <InputGroup style={{ flex: '0 0 160px', minWidth: '140px' }}>
          <label>Setor</label>
          <CustomAccordionSelect
            value={role}
            onChange={e => setRole(e.target.value)}
            options={[
              { value: 'low', label: '🔴 LOW' },
              { value: 'prime', label: '🔵 PRIME' },
            ]}
          />
        </InputGroup>
        <Button $variant="primary" onClick={handleAdd} style={{ height: '44px', alignSelf: 'flex-end', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <FaPlus /> Adicionar
        </Button>
      </AddCard>

      <div style={{ marginTop: '2rem' }}>
        <TabsRow>
          <Tab $active={activeTab === 'low'} $type="low" onClick={() => setActiveTab('low')}>
            <FaDumbbell /> LOW <span className="count">{employees.filter(e => e.role === 'low').length}</span>
          </Tab>
          <Tab $active={activeTab === 'prime'} $type="prime" onClick={() => setActiveTab('prime')}>
            <FaStar /> PRIME <span className="count">{employees.filter(e => e.role === 'prime').length}</span>
          </Tab>
        </TabsRow>

        <Grid>
          {filtered.length > 0 ? filtered.map(emp => (
            <EmpCard key={emp.id}>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={el => fileRefs.current[emp.id] = el}
                onChange={e => handlePhoto(emp, e.target.files[0])}
              />
              <Avatar $type={emp.role} onClick={() => fileRefs.current[emp.id]?.click()} title="Clique para trocar foto">
                {emp.photo
                  ? <img className="photo" src={emp.photo} alt={emp.name} />
                  : <img className="placeholder" src={logoPratique} alt="Pratique" />
                }
                <div className="overlay"><FaCamera /></div>
              </Avatar>

              <EmpInfo $type={emp.role}>
                <div className="name">{emp.name}</div>
                <RoleBadge $type={emp.role}>
                  {emp.role === 'low' ? <><FaDumbbell /> LOW</> : <><FaStar /> PRIME</>}
                </RoleBadge>
              </EmpInfo>

              <IconButton onClick={() => handleDelete(emp.id)} $hoverColor="#e50914" title="Excluir">
                <FaTrash />
              </IconButton>
            </EmpCard>
          )) : (
            <EmptyState>
              <FaUsers />
              <p>Nenhum profissional cadastrado neste setor.</p>
            </EmptyState>
          )}
        </Grid>
      </div>
    </div>
  );
};
