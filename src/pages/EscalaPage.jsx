import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaCalendarPlus, FaEdit, FaSave, FaPlus, FaEye, FaTrash, 
  FaPalette, FaPlusCircle, FaEraser
} from 'react-icons/fa';
import { FaArrowRightArrowLeft, FaShuffle } from 'react-icons/fa6';
import { Card, Button, IconButton } from '../styles/components';
import { saveScheduleRow, clearSchedule } from '../services/firestore';
import { EmployeeSelectionModal } from '../components/EmployeeSelectionModal';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;

  .left { display: flex; flex-direction: column; gap: 4px; }
  .right { display: flex; gap: 0.8rem; flex-wrap: wrap; }
`;

const TableContainer = styled(Card)`
  padding: 0;
  overflow-x: auto;
  border: 2px solid #000;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  
  th {
    background: #fff;
    padding: 1.2rem 0.5rem;
    border: 2px solid #000;
    font-weight: 900;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #000;
  }

  td {
    padding: 0.8rem 0.4rem;
    border: 1px solid #000;
    font-weight: 900;
    font-size: 0.85rem;
    vertical-align: middle;
    color: #000;
    
    @media (max-width: 600px) {
      padding: 0.5rem 0.2rem;
      font-size: 0.7rem;
    }
  }

  tr.highlight { background-color: #fff1f1; }

  
  /* Linha separadora de dias no estilo do PDF */
  .day-cell {
    background: #e9ecef;
    border-right: 2px solid #000;
  }
`;

const CellEdit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  textarea {
    width: 100%;
    height: 60px;
    background: transparent;
    border: 1px dashed #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 0.75rem;
    text-align: center;
    resize: none;
    text-transform: uppercase;
    font-weight: bold;
  }

  input {
    width: 100%;
    background: transparent;
    border-bottom: 1px solid #ddd;
    text-align: center;
    font-weight: bold;
    padding: 2px;
  }
`;

const AddBtn = styled.button`
  font-size: 0.65rem;
  font-weight: 900;
  padding: 6px 12px;
  border-radius: 4px;
  background: ${props => props.type === 'swap' ? '#ebf5ff' : '#fff1f1'};
  color: ${props => props.type === 'swap' ? '#3498db' : '#e50914'};
  border: 1px dashed currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-transform: uppercase;
  width: 100%;
  margin-bottom: 4px;
  
  &:hover { background: ${props => props.type === 'swap' ? '#d6e9ff' : '#ffe4e4'}; }
`;

export const EscalaPage = ({ schedule, employees, setIsMonthModalOpen, setIsPreviewModalOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, rowId: null, field: null, dayName: '', fieldName: '', swapStep: 1, firstEmployee: null, targetRole: null });


  const handleAddRow = async () => {
    const newId = Date.now();
    const newRow = { id: newId, date: '', day: '', low: '', prime: '', trocaLow: '', trocaPrime: '', highlight: schedule.length % 2 === 0 };
    await saveScheduleRow(newRow, schedule.length);
    setIsEditing(true);
    toast.success('Linha adicionada');
  };

  const handleUpdate = async (id, field, value) => {
    const row = schedule.find(r => r.id === id);
    if (row) {
      await saveScheduleRow({ ...row, [field]: value }, schedule.indexOf(row));
    }
  };

  const handleDeleteRow = async (id) => {
    if (confirm('Remover esta linha?')) {
      const row = schedule.find(r => r.id === id);
      if (row) await clearSchedule([row]);
      toast.success('Removido');
    }
  };

  const handleToggleHighlight = async (id) => {
    const row = schedule.find(r => r.id === id);
    if (row) await handleUpdate(id, 'highlight', !row.highlight);
  };

  const handleRandomGeneration = async () => {
    if (employees.length === 0) {
      toast.error('Nenhum colaborador cadastrado');
      return;
    }

    if (!confirm('Deseja preencher a escala aleatoriamente? Isso substituirá os dados atuais.')) return;

    const loadingToast = toast.loading('Sorteando colaboradores...');
    
    try {
      // Criar pools separados
      let poolLow = [...employees.filter(e => e.role === 'low').map(e => e.name)];
      let poolPrime = [...employees.filter(e => e.role === 'prime').map(e => e.name)];
      
      const shuffle = (array) => array.sort(() => Math.random() - 0.5);
      shuffle(poolLow);
      shuffle(poolPrime);

      const getNext = (type, excluded = []) => {
        let pool = type === 'low' ? poolLow : poolPrime;
        let available = pool.filter(p => !excluded.includes(p));
        
        if (available.length === 0) {
          // Resetar pool se necessário
          const original = employees.filter(e => e.role === type).map(e => e.name);
          if (type === 'low') poolLow = shuffle([...original]);
          else poolPrime = shuffle([...original]);
          pool = type === 'low' ? poolLow : poolPrime;
          available = pool.filter(p => !excluded.includes(p));
          if (available.length === 0) available = pool;
        }
        
        const selected = available.pop();
        if (type === 'low') poolLow = poolLow.filter(p => p !== selected);
        else poolPrime = poolPrime.filter(p => p !== selected);
        return selected;
      };

      for (let i = 0; i < schedule.length; i++) {
        const row = schedule[i];
        const isSaturday = row.day.toUpperCase() === 'SÁBADO';
        const dayUsed = [];
        
        // Sábado Low (2 vagas) ou Domingo Low (1 vaga)
        const low1 = getNext('low', dayUsed);
        dayUsed.push(low1);
        
        let lowValue = low1;
        if (isSaturday) {
          const low2 = getNext('low', dayUsed);
          dayUsed.push(low2);
          lowValue = `${low1}\n${low2}`;
        }

        // Prime (1 vaga)
        const primeValue = getNext('prime', dayUsed);
        dayUsed.push(primeValue);


        await saveScheduleRow({
          ...row,
          low: lowValue,
          prime: primeValue,
          trocaLow: '',
          trocaPrime: ''
        }, i);
      }

      toast.success('Escala gerada com sucesso!', { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao gerar escala', { id: loadingToast });
    }
  };

  const handleClearAllNames = async () => {
    if (!confirm('Deseja limpar todos os nomes desta escala? As datas e dias serão mantidos.')) return;
    
    const loadingToast = toast.loading('Limpando nomes...');
    try {
      for (let i = 0; i < schedule.length; i++) {
        await saveScheduleRow({
          ...schedule[i],
          low: '',
          prime: '',
          trocaLow: '',
          trocaPrime: ''
        }, i);
      }
      toast.success('Nomes removidos!', { id: loadingToast });
    } catch (error) {
      toast.error('Erro ao limpar escala', { id: loadingToast });
    }
  };

  const openModal = (rowId, field, dayName, fieldName) => {
    const targetRole = field.toLowerCase().includes('prime') ? 'prime' : 'low';
    setModal({ isOpen: true, rowId, field, dayName, fieldName, swapStep: 1, firstEmployee: null, targetRole });
  };


  const onSelectEmployee = async (name) => {
    const row = schedule.find(r => r.id === modal.rowId);
    if (!row) return;

    if (modal.field.startsWith('troca')) {
      if (modal.swapStep === 1) {
        setModal({ ...modal, swapStep: 2, firstEmployee: name });
      } else {
        const current = row[modal.field];
        const newValue = current ? `${current}\n${modal.firstEmployee} ⇄ ${name}` : `${modal.firstEmployee} ⇄ ${name}`;
        await handleUpdate(modal.rowId, modal.field, newValue);
        setModal({ ...modal, isOpen: false });
      }
    } else {
      const current = row[modal.field];
      const newValue = current ? `${current}\n${name}` : name;
      await handleUpdate(modal.rowId, modal.field, newValue);
      setModal({ ...modal, isOpen: false });
    }
  };

  return (
    <Container>
      <Actions className="no-print">
        <div className="left">
          <h2 style={{ fontWeight: 900 }}>Escala de Final de Semana</h2>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Gerencie o plantão da sua unidade.</p>
        </div>
        <div className="right">
          <Button $variant="purple" onClick={() => setIsMonthModalOpen(true)}>
            <FaCalendarPlus /> Nova Escala Mensal
          </Button>
          <Button $variant={isEditing ? 'success' : 'blue'} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <><FaSave /> Salvar Edição</> : <><FaEdit /> Editar Escala</>}
          </Button>
          {isEditing && (
            <Button $variant="dark" onClick={handleAddRow}>
              <FaPlus /> Add Linha
            </Button>
          )}
          <Button $variant="dark" onClick={handleRandomGeneration}>
            <FaShuffle /> Sorteio Aleatório
          </Button>
          <Button $variant="danger" style={{ color: '#000' }} onClick={handleClearAllNames}>
            <FaEraser /> Limpar Nomes
          </Button>
          <Button $variant="blue" onClick={() => setIsPreviewModalOpen(true)}>
            <FaEye /> Pré-visualizar & Exportar
          </Button>
        </div>
      </Actions>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Musculação (LOW)</th>
              <th>Musculação PRIME</th>
              <th>Troca LOW</th>
              <th>Troca PRIME</th>
              {isEditing && <th className="no-print">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {schedule.map(row => (
              <tr key={row.id} className={row.highlight ? 'highlight' : ''}>
                <td>
                  {isEditing ? (
                    <CellEdit>
                      <input value={row.date} onChange={e => handleUpdate(row.id, 'date', e.target.value)} placeholder="00/00" />
                      <input className="uppercase" value={row.day} onChange={e => handleUpdate(row.id, 'day', e.target.value)} placeholder="DIA" />
                    </CellEdit>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{row.date}</span>
                      <span className="uppercase">{row.day}</span>
                    </div>
                  )}
                </td>
                
                {['low', 'prime', 'trocaLow', 'trocaPrime'].map(field => (
                  <td key={field}>
                    {isEditing ? (
                      <CellEdit>
                        <AddBtn 
                          type={field.startsWith('troca') ? 'swap' : 'add'} 
                          onClick={() => openModal(row.id, field, row.day, field.toUpperCase())}
                        >
                          {field.startsWith('troca') ? <FaArrowRightArrowLeft /> : <FaPlusCircle />}
                          {field.startsWith('troca') ? 'Add Troca' : row.day === 'SÁBADO' && field === 'low' ? 'Adicionar (2 vagas)' : 'Adicionar (1 vaga)'}
                        </AddBtn>
                        <textarea 
                          value={row[field]} 
                          onChange={e => handleUpdate(row.id, field, e.target.value)}
                        />
                      </CellEdit>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{row[field]}</div>
                    )}
                  </td>
                ))}

                {isEditing && (
                  <td className="no-print">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                      <IconButton onClick={() => handleToggleHighlight(row.id)} title="Destaque"><FaPalette /></IconButton>
                      <IconButton onClick={() => handleDeleteRow(row.id)} hoverColor="#e50914" title="Remover"><FaTrash /></IconButton>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <EmployeeSelectionModal 
        modal={modal} 
        onClose={() => setModal({ ...modal, isOpen: false })}
        employees={employees}
        onSelect={onSelectEmployee}
      />
    </Container>
  );
};
