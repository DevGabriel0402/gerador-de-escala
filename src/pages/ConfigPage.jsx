import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaSave, FaBuilding, FaBell, FaTrash, FaDatabase, FaCalendarPlus, FaPalette,
  FaCheck
} from 'react-icons/fa';
import { updateSettings, clearSchedule, deleteAllSchedules } from '../services/firestore';
import toast from 'react-hot-toast';
import { Button } from '../styles/components';

const PageTitle = styled.div`
  margin-bottom: 2rem;
  h2 { font-size: 1.6rem; font-weight: 900; color: #1a1a1a; }
  p { color: #888; font-size: 0.9rem; margin-top: 4px; }
`;

const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f0f0f0;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1.5px solid #f5f5f5;

  svg { color: #e50914; font-size: 1rem; }

  h3 {
    font-size: 1rem;
    font-weight: 900;
    color: #1a1a1a;
  }

  span {
    margin-left: auto;
    font-size: 0.72rem;
    color: #aaa;
    font-weight: 600;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1rem;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.95rem;
  background: #fafafa;
  transition: border-color 0.2s;
  width: 100%;

  &:focus { border-color: #e50914; background: #fff; }
`;

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  background: #fafafa;
  resize: vertical;
  min-height: 90px;
  width: 100%;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus { border-color: #e50914; background: #fff; }
`;

const DangerBox = styled.div`
  background: #fff5f5;
  border: 1.5px solid #fecaca;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .info strong { font-size: 0.9rem; font-weight: 900; color: #b91c1c; }
  .info p { font-size: 0.8rem; color: #888; margin-top: 2px; }
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  gap: 1rem;

  &:last-child { border-bottom: none; }

  .info strong { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
  .info p { font-size: 0.8rem; color: #aaa; }
`;

const Toggle = styled.div`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${p => p.$on ? '#e50914' : '#e0e0e0'};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${p => p.$on ? '23px' : '3px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }
`;

const YearInput = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;

  input {
    width: 120px;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e5e5e5;
    border-radius: 10px;
    font-weight: 900;
    font-size: 1.1rem;
    text-align: center;
    background: #fafafa;
    &:focus { border-color: #e50914; outline: none; }
  }
`;

export const ConfigPage = ({
  unitName, setUnitName,
  warningMessage, setWarningMessage,
  schedule,
  setGlobalModal,
  selectedYear, setSelectedYear,
  setIsMonthModalOpen,
}) => {
  const [notifyBefore, setNotifyBefore] = useState(true);
  const [highlightWeekend, setHighlightWeekend] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ unitName, warningMessage });
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleClearMonth = () => {
    setGlobalModal({
      isOpen: true,
      title: 'Limpar escala do mês',
      message: 'Isso apagará TODOS os dados da escala do mês atual. Tem certeza?',
      type: 'danger',
      onConfirm: async () => {
        setGlobalModal(p => ({ ...p, isOpen: false }));
        await clearSchedule(schedule);
        toast.success('Escala do mês limpa!');
      }
    });
  };

  const handleDeleteAll = () => {
    setGlobalModal({
      isOpen: true,
      title: 'Apagar TODAS as escalas',
      message: 'Isso apagará TODOS os dados de TODOS os meses permanentemente. Não há como desfazer!',
      type: 'danger',
      onConfirm: async () => {
        setGlobalModal(p => ({ ...p, isOpen: false }));
        await deleteAllSchedules();
        toast.success('Todas as escalas foram apagadas!');
      }
    });
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <PageTitle>
        <h2>Configurações</h2>
        <p>Personalize o sistema de escala da sua unidade</p>
      </PageTitle>

      {/* Unidade */}
      <Section>
        <SectionTitle>
          <FaBuilding />
          <h3>Informações da Unidade</h3>
        </SectionTitle>
        <Field>
          <label>Nome da Unidade</label>
          <Input
            value={unitName}
            onChange={e => setUnitName(e.target.value.toUpperCase())}
            placeholder="Ex: MANGABEIRAS"
          />
        </Field>
        <Field>
          <label>Mensagem de Aviso (Rodapé da Escala)</label>
          <Textarea
            value={warningMessage}
            onChange={e => setWarningMessage(e.target.value)}
            placeholder="Ex: Chegar com 20 minutos de antecedência..."
          />
        </Field>
        <SaveRow>
          <Button $variant="primary" onClick={handleSave} disabled={saving}>
            <FaSave /> {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </SaveRow>
      </Section>

      {/* Geração de Escala */}
      <Section>
        <SectionTitle>
          <FaCalendarPlus />
          <h3>Geração de Escala Anual</h3>
          <span>Gera finais de semana para todo o ano</span>
        </SectionTitle>
        <Field>
          <label>Ano</label>
          <YearInput>
            <input
              type="number"
              min="2024"
              max="2100"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            />
            <Button $variant="primary" onClick={() => setIsMonthModalOpen(true)}>
              <FaCalendarPlus /> Gerar Escala Anual
            </Button>
          </YearInput>
        </Field>
      </Section>

      {/* Preferências visuais */}
      <Section>
        <SectionTitle>
          <FaPalette />
          <h3>Preferências</h3>
        </SectionTitle>
        <ToggleRow>
          <div className="info">
            <strong>Destacar sábados</strong>
            <p>Linhas de sábado aparecem com fundo colorido na tabela</p>
          </div>
          <Toggle $on={highlightWeekend} onClick={() => setHighlightWeekend(p => !p)} />
        </ToggleRow>
        <ToggleRow>
          <div className="info">
            <strong>Notificações de aviso</strong>
            <p>Exibir mensagem de aviso no PDF e na pré-visualização</p>
          </div>
          <Toggle $on={notifyBefore} onClick={() => setNotifyBefore(p => !p)} />
        </ToggleRow>
      </Section>

      {/* Zona de perigo */}
      <Section style={{ borderColor: '#fecaca' }}>
        <SectionTitle>
          <FaTrash />
          <h3 style={{ color: '#b91c1c' }}>Zona de Perigo</h3>
        </SectionTitle>

        <DangerBox>
          <div className="info">
            <strong>Limpar escala do mês atual</strong>
            <p>Remove todos os dados do mês selecionado</p>
          </div>
          <Button $variant="danger" onClick={handleClearMonth}>
            <FaTrash /> Limpar mês
          </Button>
        </DangerBox>

        <DangerBox style={{ marginTop: '0.8rem' }}>
          <div className="info">
            <strong>Apagar TODAS as escalas</strong>
            <p>Remove permanentemente todos os meses e dados</p>
          </div>
          <Button $variant="danger" onClick={handleDeleteAll}>
            <FaDatabase /> Apagar tudo
          </Button>
        </DangerBox>
      </Section>
    </div>
  );
};
