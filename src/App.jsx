import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Toaster, toast } from 'react-hot-toast';
import { FaCalendarPlus, FaXmark, FaEye, FaFilePdf, FaImage, FaShareNodes, FaPrint } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react'; // Mantendo Loader2 pois é elegante
import html2canvas from 'html2canvas';

import { GlobalStyle, theme } from './styles/global';
import { Navbar } from './components/Navbar';
import { EscalaPage } from './pages/EscalaPage';
import { EquipePage } from './pages/EquipePage';
import { SorteioPage } from './pages/SorteioPage';
import { Card, Button, IconButton } from './styles/components';
import { CustomModal } from './components/CustomModal';
import { FaCircleInfo } from 'react-icons/fa6';


import {
  subscribeEmployees,
  subscribeSchedule,
  subscribeSettings,
  updateSettings,
  clearSchedule,
  deleteAllSchedules,
  saveScheduleRow
} from './services/firestore';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { EscalaPDF } from './utils/EscalaPDF';
import logoPratique from './assets/Menor-PRATIQUE.png';



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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [warningMessage, setWarningMessage] = useState('Chegar com 20 minutos de antecedência para preparar o ambiente da academia.');
  const now = new Date();
  const initialMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [currentMonthId, setCurrentMonthId] = useState(initialMonth);
  const [globalModal, setGlobalModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, type: 'info', isAlert: false });

  const computedMonthName = new Date(currentMonthId + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();


  useEffect(() => {
    const unsubEmployees = subscribeEmployees(setEmployees);
    const unsubSchedule = subscribeSchedule(currentMonthId, setSchedule);
    const unsubSettings = subscribeSettings((data) => {
      setUnitName(data.unitName || 'MANGABEIRAS');
      setDraftedEmployees(data.draftedEmployees || []);
      setWarningMessage(data.warningMessage || 'Chegar com 20 minutos de antecedência para preparar o ambiente da academia.');
      setIsLoading(false);
    });


    return () => {
      unsubEmployees();
      unsubSchedule();
      unsubSettings();
    };
  }, [currentMonthId]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={40} className="animate-spin" color={theme.colors.primary} />
          <p style={{ fontWeight: 900, color: '#333' }}>CARREGANDO...</p>
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
            warningMessage={warningMessage}
            monthName={computedMonthName}
            setGlobalModal={setGlobalModal}
            currentMonthId={currentMonthId}
            setCurrentMonthId={setCurrentMonthId}
          />

        )}
        {activeTab === 'equipe' && <EquipePage employees={employees} />}
        {activeTab === 'sorteio' && <SorteioPage employees={employees} draftedEmployees={draftedEmployees} setGlobalModal={setGlobalModal} />}

        {activeTab === 'ajustes' && (
          <Card style={{ maxWidth: '600px' }}>
            <h2 style={{ fontWeight: 900, marginBottom: '2rem' }}>Configurações</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#666' }}>Nome da Unidade</label>
                <input
                  style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  value={unitName}
                  onChange={e => setUnitName(e.target.value.toUpperCase())}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#666' }}>Mensagem de Aviso (Rodapé)</label>
                <textarea
                  style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 'bold', minHeight: '100px', resize: 'vertical' }}
                  value={warningMessage}
                  onChange={e => setWarningMessage(e.target.value)}
                />
              </div>

              <Button $variant="success" onClick={async () => {
                await updateSettings({ unitName, warningMessage });
                toast.success('Configurações salvas!');
              }}>
                Salvar Alterações
              </Button>
            </div>
          </Card>
        )}

      </Main>

      {/* MODAL ANO */}
      {isMonthModalOpen && (
        <ModalOverlay className="modal-overlay" onClick={() => setIsMonthModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Gerar Escala Anual</h3>
            <p>Escolha o ano. Isso criará escalas para <span style={{ color: 'red', fontWeight: 900 }}>todos os meses</span>. As escalas existentes serão apagadas.</p>
            <input 
              type="number" 
              value={selectedYear} 
              onChange={e => setSelectedYear(e.target.value)} 
              min="2024" 
              max="2100"
              style={{ textAlign: 'center' }}
            />
            <div className="footer">
              <Button $variant="outline" style={{ flex: 1 }} onClick={() => setIsMonthModalOpen(false)}>Cancelar</Button>
              <Button $variant="primary" style={{ flex: 1 }} onClick={async () => {
                setGlobalModal({
                  isOpen: true,
                  title: 'Confirmar Escala Anual',
                  message: `Deseja apagar TODAS as escalas existentes e gerar uma nova escala para todo o ano de ${selectedYear}?`,
                  type: 'danger',
                  onConfirm: async () => {
                    setGlobalModal(prev => ({ ...prev, isOpen: false }));
                    setIsLoading(true);
                    const loadingToast = toast.loading(`Gerando escala para ${selectedYear}...`);
                    
                    try {
                      await deleteAllSchedules();
                      
                      let totalRows = 0;
                      for (let month = 1; month <= 12; month++) {
                        const monthId = `${selectedYear}-${String(month).padStart(2, '0')}`;
                        const daysInMonth = new Date(selectedYear, month, 0).getDate();
                        
                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(selectedYear, month - 1, day);
                          if (date.getDay() === 0 || date.getDay() === 6) {
                            await saveScheduleRow({
                              id: Date.now() + totalRows, // ID único
                              date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
                              day: date.getDay() === 6 ? 'SÁBADO' : 'DOMINGO',
                              low: '', prime: '', trocaLow: '', trocaPrime: '', highlight: date.getDay() === 6
                            }, day, monthId);
                            totalRows++;
                          }
                        }
                      }
                      
                      toast.success(`Escala anual de ${selectedYear} gerada!`, { id: loadingToast });
                      setIsMonthModalOpen(false);
                      setIsLoading(false);
                      // Opcional: mudar para janeiro do ano gerado
                      setCurrentMonthId(`${selectedYear}-01`);
                    } catch (error) {
                      toast.error('Erro ao gerar escala anual', { id: loadingToast });
                      setIsLoading(false);
                    }
                  }
                });
              }}>Gerar Agora</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* MODAL PREVIEW PDF */}
      {isPreviewModalOpen && (
        <ModalOverlay className="modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
          <ModalContent className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaEye color={theme.colors.purple} /> Pré-visualização para Download
              </h3>
              <IconButton onClick={() => setIsPreviewModalOpen(false)}><FaXmark /></IconButton>
            </div>

            <div id="capture-area" style={{
              background: '#f8f9fa',
              padding: '2rem',
              maxHeight: '500px',
              overflowY: 'auto',
              marginBottom: '1rem'
            }}>
              <div id="print-area" style={{
                background: 'white',
                padding: '40px',
                width: '100%',
                minHeight: '600px',
                boxShadow: '0 0 20px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  background: 'transparent',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '20px'
                }}>
                  <img
                    src={logoPratique}
                    alt="Logo"
                    style={{ height: '60px' }}
                  />


                  <span style={{ color: '#e50914', fontWeight: 900, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{unitName}</span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '30px', textAlign: 'center' }}>
                  Escala de Final de Semana do Mês de {computedMonthName || '...'}
                </h4>


                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '2px solid #000',
                  tableLayout: 'fixed',
                  wordBreak: 'break-word'
                }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900, textAlign: 'center', background: theme.colors.primary, color: 'white' }}>DIA</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900, textAlign: 'center', background: theme.colors.primary, color: 'white' }}>MUSCULAÇÃO (LOW)</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900, textAlign: 'center', background: theme.colors.primary, color: 'white' }}>MUSCULAÇÃO PRIME</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900, textAlign: 'center', background: theme.colors.primary, color: 'white' }}>TROCA LOW</th>
                      <th style={{ border: '1px solid #000', padding: '10px', fontWeight: 900, textAlign: 'center', background: theme.colors.primary, color: 'white' }}>TROCA PRIME</th>

                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(row => (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 900, background: '#fff1f1', textAlign: 'center' }}>

                          {row.date}<br />{row.day}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', textAlign: 'center' }}>{row.low}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', textAlign: 'center' }}>{row.prime}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', textAlign: 'center' }}>{row.trocaLow}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', textAlign: 'center' }}>{row.trocaPrime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {warningMessage && (
                  <div style={{ marginTop: '30px', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
                    <FaCircleInfo style={{ fontSize: '1.5rem', color: '#e50914' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: '#000' }}>
                      {warningMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>


            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

              <Button
                $variant="primary"
                style={{ flex: 1, background: theme.colors.success }}
                onClick={() => window.print()}
              >
                <FaPrint /> Imprimir Escala
              </Button>


              <Button
                $variant="primary"
                style={{ flex: 1, background: theme.colors.navy }}
                onClick={async () => {
                  const element = document.getElementById('export-a4-area');
                  if (element) {
                    element.style.visibility = 'visible';
                    // Pequeno delay para garantir o layout
                    await new Promise(r => setTimeout(r, 100));

                    const canvas = await html2canvas(element, {
                      useCORS: true,
                      allowTaint: true,
                      scale: 2
                    });
                    
                    element.style.visibility = 'hidden';
                    const link = document.createElement('a');
                    link.download = `Escala-${unitName}-A4.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}
              >
                <FaImage /> Baixar Imagem
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* AREA OCULTA PARA EXPORTAÇÃO DE IMAGEM (A4) */}
      <div id="export-a4-area" style={{
        visibility: 'hidden',
        position: 'fixed',
        top: 0,
        left: '-5000px', // Fora da tela
        width: '1240px',
        height: '1754px',
        background: '#fff',
        zIndex: -1001,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px',
        fontFamily: "'Inter', sans-serif",
        color: '#000'
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <img src={logoPratique} alt="Logo" style={{ height: '80px' }} />
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ color: '#e50914', fontWeight: 900, margin: 0, fontSize: '32px' }}>{unitName}</h2>
            <p style={{ margin: 0, fontWeight: 900, fontSize: '18px' }}>ESCALA DE FINAL DE SEMANA</p>
          </div>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, textAlign: 'center', marginBottom: '40px', textTransform: 'uppercase' }}>
          MÊS DE {computedMonthName || '...'}
        </h1>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '3px solid #000' }}>
          <thead>
            <tr>
              <th style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>DIA</th>
              <th style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>MUSCULAÇÃO (LOW)</th>
              <th style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>MUSCULAÇÃO PRIME</th>
              <th style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>TROCA LOW</th>
              <th style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>TROCA PRIME</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(row => (
              <tr key={row.id}>
                <td style={{ border: '2px solid #000', padding: '15px', fontWeight: 900, textAlign: 'center', background: '#fff1f1', fontSize: '18px' }}>
                  {row.date}<br />{row.day}
                </td>
                <td style={{ border: '2px solid #000', padding: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 600, whiteSpace: 'pre-wrap' }}>{row.low}</td>
                <td style={{ border: '2px solid #000', padding: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 600, whiteSpace: 'pre-wrap' }}>{row.prime}</td>
                <td style={{ border: '2px solid #000', padding: '15px', textAlign: 'center', fontSize: '16px', color: '#666', whiteSpace: 'pre-wrap' }}>{row.trocaLow}</td>
                <td style={{ border: '2px solid #000', padding: '15px', textAlign: 'center', fontSize: '16px', color: '#666', whiteSpace: 'pre-wrap' }}>{row.trocaPrime}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {warningMessage && (
          <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #e50914', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <FaCircleInfo style={{ fontSize: '30px', color: '#e50914' }} />
            <span style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase' }}>{warningMessage}</span>
          </div>
        )}

        <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontWeight: 900, color: '#e50914', fontSize: '20px', letterSpacing: '2px' }}>PRATIQUE FITNESS - A MAIOR REDE DE MINAS</p>
        </div>
      </div>


      {globalModal.isOpen && (
        <CustomModal
          {...globalModal}
          onCancel={() => setGlobalModal({ ...globalModal, isOpen: false })}
        />
      )}

    </ThemeProvider>
  );
}
