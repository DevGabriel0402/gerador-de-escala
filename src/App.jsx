import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { FaCalendarPlus, FaXmark, FaEye, FaFilePdf, FaImage, FaShareNodes } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react'; // Mantendo Loader2 pois é elegante
import html2canvas from 'html2canvas';

import { GlobalStyle, theme } from './styles/global';
import { Navbar } from './components/Navbar';
import { EscalaPage } from './pages/EscalaPage';
import { EquipePage } from './pages/EquipePage';
import { SorteioPage } from './pages/SorteioPage';
import { Card, Button, IconButton } from './styles/components';

import { 
  subscribeEmployees, 
  subscribeSchedule, 
  subscribeSettings, 
  updateSettings,
  clearSchedule,
  saveScheduleRow
} from './services/firestore';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { EscalaPDF } from './utils/EscalaPDF';

const Main = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  
  @media (max-width: 900px) {
    margin: 1rem auto;
    padding-bottom: 80px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 450px;
  h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; }
  p { color: #666; margin-bottom: 2rem; font-size: 0.9rem; }
  input { width: 100%; padding: 1rem; border: 2px solid #eee; border-radius: 12px; font-size: 1.1rem; font-weight: bold; margin-bottom: 2rem; outline: none; &:focus { border-color: ${props => props.theme.colors.primary}; } }
  .footer { display: flex; gap: 1rem; }
`;

export default function App() {
  const [activeTab, setActiveTab] = useState('escala');
  const [isLoading, setIsLoading] = useState(true);
  
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [unitName, setUnitName] = useState('MANGABEIRAS');
  const [draftedEmployees, setDraftedEmployees] = useState([]);

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    const unsubEmployees = subscribeEmployees(setEmployees);
    const unsubSchedule = subscribeSchedule(setSchedule);
    const unsubSettings = subscribeSettings((data) => {
      setUnitName(data.unitName || 'MANGABEIRAS');
      setDraftedEmployees(data.draftedEmployees || []);
      setIsLoading(false);
    });

    return () => {
      unsubEmployees();
      unsubSchedule();
      unsubSettings();
    };
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={40} className="animate-spin" color={theme.colors.primary} />
          <p style={{ fontWeight: 900, color: '#333' }}>CONECTANDO À PRATIQUE...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Toaster position="top-right" />
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} unitName={unitName} />

      <Main>
        {activeTab === 'escala' && (
          <EscalaPage 
            schedule={schedule} 
            employees={employees} 
            setIsMonthModalOpen={setIsMonthModalOpen}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
          />
        )}
        {activeTab === 'equipe' && <EquipePage employees={employees} />}
        {activeTab === 'sorteio' && <SorteioPage employees={employees} draftedEmployees={draftedEmployees} />}
        {activeTab === 'ajustes' && (
          <Card style={{ maxWidth: '600px' }}>
            <h2 style={{ fontWeight: 900, marginBottom: '2rem' }}>Configurações</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#666' }}>Nome da Unidade</label>
              <input 
                style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}
                value={unitName} 
                onChange={async e => {
                  setUnitName(e.target.value.toUpperCase());
                  await updateSettings({ unitName: e.target.value.toUpperCase() });
                }} 
              />
            </div>
          </Card>
        )}
      </Main>

      {/* MODAL MÊS */}
      {isMonthModalOpen && (
        <ModalOverlay className="modal-overlay" onClick={() => setIsMonthModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Nova Escala Mensal</h3>
            <p>Escolha o mês. A escala atual será <span style={{ color: 'red', fontWeight: 900 }}>limpa</span>.</p>
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
            <div className="footer">
              <Button $variant="outline" style={{ flex: 1 }} onClick={() => setIsMonthModalOpen(false)}>Cancelar</Button>
              <Button $variant="primary" style={{ flex: 1 }} disabled={!selectedMonth} onClick={async () => {
                 // Lógica de gerar mês (integrada aqui para simplificar)
                 setIsLoading(true);
                 await clearSchedule(schedule);
                 const [year, month] = selectedMonth.split('-');
                 const daysInMonth = new Date(year, month, 0).getDate();
                 let rowId = Date.now();
                 for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month - 1, day);
                    if (date.getDay() === 0 || date.getDay() === 6) {
                      await saveScheduleRow({
                        id: rowId++,
                        date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
                        day: date.getDay() === 6 ? 'SÁBADO' : 'DOMINGO',
                        low: '', prime: '', trocaLow: '', trocaPrime: '', highlight: date.getDay() === 6
                      }, day);
                    }
                 }
                 setIsMonthModalOpen(false);
                 setIsLoading(false);
              }}>Gerar Agora</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* MODAL PREVIEW PDF */}
      {isPreviewModalOpen && (
        <ModalOverlay className="modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
          <ModalContent style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <FaEye color={theme.colors.purple} /> Pré-visualização para Download
               </h3>
               <IconButton onClick={() => setIsPreviewModalOpen(false)}><FaXmark /></IconButton>
            </div>
            
            <div id="capture-area" style={{ 
              background: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '12px', 
              border: '1px solid #ddd',
              maxHeight: '500px',
              overflowY: 'auto',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                background: 'white', 
                padding: '40px', 
                width: '100%', 
                minHeight: '600px',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ 
                  background: theme.colors.primary, 
                  padding: '15px 30px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '5px',
                  marginBottom: '20px'
                }}>
                  <img 
                    src="https://pratiquefitness.com.br/wp-content/uploads/2025/10/pratique-logo-academia.webp" 
                    alt="Logo" 
                    style={{ height: '30px' }} 
                    crossOrigin="anonymous"
                  />
                  <span style={{ color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{unitName}</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', color: theme.colors.primary, marginBottom: '5px', textAlign: 'center' }}>
                  {unitName}
                </h2>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '30px' }}>
                  Escala de Final de Semana
                </h4>

                <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900 }}>DIA</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900 }}>MUSCULAÇÃO (LOW)</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900 }}>MUSCULAÇÃO PRIME</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900 }}>TROCA LOW</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900 }}>TROCA PRIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(row => (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 900, background: '#eee' }}>
                          {row.date}<br/>{row.day}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{row.low}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{row.prime}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{row.trocaLow}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{row.trocaPrime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <PDFDownloadLink 
                document={<EscalaPDF schedule={schedule} unitName={unitName} />} 
                fileName={`Escala-${unitName}.pdf`}
                style={{ flex: 1, textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <Button $variant="primary" style={{ width: '100%' }} disabled={loading}>
                    <FaFilePdf /> {loading ? 'Preparando...' : 'Baixar PDF (A4)'}
                  </Button>
                )}
              </PDFDownloadLink>
              
              <Button $variant="warning" style={{ flex: 1, background: 'linear-gradient(45deg, #e50914, #000)' }} onClick={async () => {
                const element = document.getElementById('export-image-area');
                if (element) {
                  element.style.display = 'flex';
                  const canvas = await html2canvas(element, { 
                    width: 1080, 
                    height: 1920,
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                  });
                  element.style.display = 'none';
                  const link = document.createElement('a');
                  link.download = `Escala-${unitName}-Story.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                }
              }}>
                <FaImage /> Baixar Foto (Instagram)
              </Button>

              <Button $variant="blue" style={{ flex: 1 }} onClick={() => {
                toast.success('Pronto para compartilhar!');
                window.print();
              }}>
                <FaShareNodes /> Compartilhar
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* AREA OCULTA PARA EXPORTAÇÃO DE IMAGEM (STORY) */}
      <div id="export-image-area" style={{ 
        display: 'none', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '1080px', 
        height: '1920px', 
        background: '#f8f9fa', 
        zIndex: -1000,
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        borderTop: '40px solid #e50914',
        borderBottom: '40px solid #e50914',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ marginTop: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            background: '#e50914', 
            padding: '20px 50px', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '10px',
            marginBottom: '40px'
          }}>
            <img 
              src="https://pratiquefitness.com.br/wp-content/uploads/2025/10/pratique-logo-academia.webp" 
              alt="Logo" 
              style={{ height: '60px' }} 
              crossOrigin="anonymous"
            />
            <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase' }}>{unitName}</span>
          </div>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            color: '#000',
            lineHeight: '1.1',
            margin: 0
          }}>
            ESCALA DE FINAL DE<br/>SEMANA
          </h1>
          <div style={{ width: '180px', height: '12px', background: '#e50914', margin: '15px auto 0' }}></div>
        </div>

        <div style={{ width: '960px', marginTop: '100px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '3px solid #000' }}>
            <thead>
              <tr style={{ background: '#fff' }}>
                <th style={{ border: '3px solid #000', padding: '25px 10px', fontWeight: '900', fontSize: '24px' }}>DIA</th>
                <th style={{ border: '3px solid #000', padding: '25px 10px', fontWeight: '900', fontSize: '24px' }}>MUSCULAÇÃO<br/>(LOW)</th>
                <th style={{ border: '3px solid #000', padding: '25px 10px', fontWeight: '900', fontSize: '24px' }}>MUSCULAÇÃO<br/>PRIME</th>
                <th style={{ border: '3px solid #000', padding: '25px 10px', fontWeight: '900', fontSize: '24px' }}>TROCA<br/>LOW</th>
                <th style={{ border: '3px solid #000', padding: '25px 10px', fontWeight: '900', fontSize: '24px' }}>TROCA<br/>PRIME</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(row => (
                <tr key={row.id} style={{ background: row.day === 'SÁBADO' ? '#b0b0b0' : '#ffffff' }}>
                  <td style={{ 
                    border: '2px solid #000', 
                    padding: '20px 10px', 
                    fontWeight: '900', 
                    fontSize: '22px', 
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    {row.date}<br/>{row.day}
                  </td>
                  <td style={{ border: '2px solid #000', padding: '20px 10px', fontSize: '24px', whiteSpace: 'pre-wrap', fontWeight: '900', textAlign: 'center', color: '#1a2a3a' }}>{row.low}</td>
                  <td style={{ border: '2px solid #000', padding: '20px 10px', fontSize: '24px', whiteSpace: 'pre-wrap', fontWeight: '900', textAlign: 'center', color: '#1a2a3a' }}>{row.prime}</td>
                  <td style={{ border: '2px solid #000', padding: '20px 10px', fontSize: '24px', whiteSpace: 'pre-wrap', fontWeight: '900', textAlign: 'center', color: '#1a2a3a' }}>{row.trocaLow}</td>
                  <td style={{ border: '2px solid #000', padding: '20px 10px', fontSize: '24px', whiteSpace: 'pre-wrap', fontWeight: '900', textAlign: 'center', color: '#1a2a3a' }}>{row.trocaPrime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '100px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>
            BOM TRABALHO EQUIPE! 💪
          </span>
        </div>
      </div>
    </ThemeProvider>
  );
}
