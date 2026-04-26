import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaDice, FaCheckCircle, FaHistory, FaCalendarDay } from 'react-icons/fa';
import { Card, Button } from '../styles/components';
import { updateSettings } from '../services/firestore';
import toast from 'react-hot-toast';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Form = styled(Card)`
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label { font-size: 0.8rem; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  input { 
    padding: 0.8rem; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const HistoryBox = styled.div`
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h4 { font-size: 0.8rem; font-weight: 900; color: #999; text-transform: uppercase; }
  }

  .names {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    span {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: bold;
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;
      
      &.low { border-color: #ddd; background: #fff; color: #000; }
      &.prime { border-color: ${props => props.theme.colors.primary}; background: ${props => props.theme.colors.primary}15; color: ${props => props.theme.colors.primary}; }
    }
  }
`;

const ResultArea = styled.div`
  min-height: 400px;
`;

const DrawingBox = styled.div`
  background: #1a1a1a;
  color: white;
  height: 100%;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid ${props => props.theme.colors.primary};
  
  .dice { font-size: 5rem; color: ${props => props.theme.colors.primary}; animation: ${bounce} 0.5s infinite; }
  .number { font-size: 8rem; font-weight: 900; }
  p { text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; color: #666; }
`;

const ResultBox = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
  height: 100%;
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);

  .bg-icon { position: absolute; right: -40px; top: -40px; font-size: 15rem; opacity: 0.05; transform: rotate(15deg); }
  
  .header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    margin-bottom: 2rem; 
    
    .tag { 
      background: ${props => props.theme.colors.primary}; 
      padding: 6px 16px; 
      border-radius: 99px; 
      font-size: 0.75rem; 
      font-weight: 900; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .date {
      background: rgba(255,255,255,0.1);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 900;
    }
  }

  h2 { 
    font-size: clamp(2rem, 8vw, 3.5rem); 
    font-weight: 900; 
    text-transform: uppercase; 
    margin-bottom: 2rem; 
    line-height: 1; 
    letter-spacing: -1px;
    word-break: break-word;
  }
  
  .groups {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    
    .section {
      h4 { 
        font-size: 0.75rem; 
        font-weight: 900; 
        color: #94a3b8; 
        text-transform: uppercase; 
        letter-spacing: 2px; 
        margin-bottom: 1rem; 
        display: flex;
        align-items: center;
        gap: 10px;
        &:after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
      }
    }
    
    .names { display: flex; flex-wrap: wrap; gap: 1rem; }
    
    .badge { 
      background: white; 
      color: black; 
      padding: 10px 18px; 
      border-radius: 12px; 
      font-weight: 900; 
      display: flex; 
      align-items: center; 
      gap: 0.6rem; 
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      font-size: 0.9rem;
      text-transform: uppercase;
      
      @media (max-width: 600px) {
        padding: 8px 14px;
        font-size: 0.8rem;
      }
    }
    
    .badge.prime { 
      background: ${props => props.theme.colors.primary}; 
      color: white; 
    }
  }
`;

export const SorteioPage = ({ employees, draftedEmployees, setGlobalModal }) => {

  const [form, setForm] = useState({ title: '', date: '', qtdLow: 1, qtdPrime: 1 });
  const [result, setResult] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleDraw = () => {
    if (!form.title || !form.date) {
      toast.error('Preencha o título e a data');
      return;
    }

    const draftedNames = draftedEmployees.map(e => typeof e === 'string' ? e : e.name);
    
    const availableLow = employees
      .filter(e => e.role === 'low')
      .map(e => e.name)
      .filter(n => !draftedNames.includes(n));
      
    const availablePrime = employees
      .filter(e => e.role === 'prime')
      .map(e => e.name)
      .filter(n => !draftedNames.includes(n));

    if (form.qtdLow > availableLow.length) {
      toast.error(`Vagas LOW (${form.qtdLow}) > Disponíveis (${availableLow.length})`);
      return;
    }
    if (form.qtdPrime > availablePrime.length) {
      toast.error(`Vagas PRIME (${form.qtdPrime}) > Disponíveis (${availablePrime.length})`);
      return;
    }


    setIsDrawing(true);
    setResult(null);
    setCountdown(5);

    let count = 5;
    const timer = setInterval(async () => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setIsDrawing(false);
        const shuffledLow = [...availableLow].sort(() => 0.5 - Math.random());
        const shuffledPrime = [...availablePrime].sort(() => 0.5 - Math.random());
        
        const lows = shuffledLow.slice(0, form.qtdLow);
        const primes = shuffledPrime.slice(0, form.qtdPrime);

        
        const newResult = { title: form.title, date: form.date, lows, primes };
        setResult(newResult);
        
        const newLows = lows.map(n => ({ name: n, type: 'LOW' }));
        const newPrimes = primes.map(n => ({ name: n, type: 'PRIME' }));
        const newDrafted = [...draftedEmployees, ...newLows, ...newPrimes];
        
        await updateSettings({ draftedEmployees: newDrafted });
        toast.success('Sorteio realizado com sucesso!');
      }
    }, 1000);
  };

  const handleResetHistory = async () => {
    setGlobalModal({
      isOpen: true,
      title: 'Zerar Histórico',
      message: 'Deseja zerar o histórico de sorteios realizados?',
      type: 'danger',
      onConfirm: async () => {
        await updateSettings({ draftedEmployees: [] });
        toast.success('Histórico zerado');
        setGlobalModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };


  return (
    <Container>
      <Form>
        <h3 style={{ fontWeight: 900 }}>Configurar Sorteio</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <InputGroup>
            <label>Feriado</label>
            <input type="text" placeholder="Ex: Natal" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </InputGroup>
          <InputGroup>
            <label>Data</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </InputGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <InputGroup>
            <label>Vagas LOW</label>
            <input type="number" value={form.qtdLow} onChange={e => setForm({...form, qtdLow: parseInt(e.target.value)})} />
          </InputGroup>
          <InputGroup>
            <label>Vagas PRIME</label>
            <input type="number" value={form.qtdPrime} onChange={e => setForm({...form, qtdPrime: parseInt(e.target.value)})} />
          </InputGroup>
        </div>
        <Button $variant="primary" onClick={handleDraw} disabled={isDrawing}>
          <FaDice /> {isDrawing ? 'Sorteando...' : 'Realizar Sorteio'}
        </Button>

        {draftedEmployees.length > 0 && (
          <HistoryBox>
            <div className="header">
              <h4>Já trabalharam:</h4>
              <Button $variant="outline" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={handleResetHistory}>Zerar</Button>
            </div>
            <div className="names">
              {draftedEmployees.map((e, i) => {
                const isObject = typeof e === 'object' && e !== null;
                const name = isObject ? e.name : e;
                const type = isObject ? e.type : '';
                return (
                  <span key={i} className={type.toLowerCase()}>
                    {name} {type && <small style={{ opacity: 0.6, fontSize: '0.6rem' }}>({type})</small>}
                  </span>
                );
              })}
            </div>
          </HistoryBox>
        )}
      </Form>

      <ResultArea>
        {isDrawing ? (
          <DrawingBox>
            <FaDice className="dice" />
            <div className="number">{countdown}</div>
            <p>Sorteando nomes...</p>
          </DrawingBox>
        ) : result ? (
          <ResultBox>
            <FaDice className="bg-icon" />
            <div className="header">
              <span className="tag">Oficial</span>
              <span>{result.date.split('-').reverse().join('/')}</span>
            </div>
            <h2>{result.title}</h2>
            <div className="groups">
              {result.lows.length > 0 && (
                <div>
                  <h4>Convocados LOW</h4>
                  <div className="names">
                    {result.lows.map((n, i) => <div key={i} className="badge"><FaCheckCircle color="#27ae60" /> {n}</div>)}
                  </div>
                </div>
              )}
              {result.primes.length > 0 && (
                <div>
                  <h4>Convocados PRIME</h4>
                  <div className="names">
                    {result.primes.map((n, i) => <div key={i} className="badge prime"><FaCheckCircle color="white" /> {n}</div>)}
                  </div>
                </div>
              )}
            </div>
          </ResultBox>
        ) : (
          <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', color: '#999' }}>
            Aguardando novo sorteio...
          </Card>
        )}
      </ResultArea>
    </Container>
  );
};
