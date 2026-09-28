import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Toaster, toast } from 'react-hot-toast';
import { FaXmark, FaEye, FaImage, FaPrint } from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

import { GlobalStyle, theme } from './styles/global';
import { Sidebar } from './components/Sidebar';
import { EscalaPage } from './pages/EscalaPage';
import { EquipePage } from './pages/EquipePage';
import { SorteioPage } from './pages/SorteioPage';
import { EscaladoPage } from './pages/EscaladoPage';
import { ConfigPage } from './pages/ConfigPage';
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

import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { EscalaPDF } from './utils/EscalaPDF';
import logoPratique from './assets/Menor-PRATIQUE.png';

// --- Layout ---
const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  margin-left: ${p => p.$open ? '240px' : '72px'};
  padding: 2rem 2.5rem;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);

  @media (max-width: 900px) {
    margin-left: 0;
    padding: 1.5rem 1rem 90px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

// --- Modals ---
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 480px;
  h3 { font-size: 1.4rem; font-weight: 900; margin-bottom: 0.5rem; }
  p { color: #666; margin-bottom: 2rem; font-size: 0.9rem; }
  input { width: 100%; padding: 1rem; border: 2px solid #eee; border-radius: 12px; font-size: 1.1rem; font-weight: bold; margin-bottom: 2rem; outline: none;
    &:focus { border-color: ${props => props.theme.colors.primary}; }
  }
  .footer { display: flex; gap: 1rem; }
`;

export default function App() {
  const [activeTab, setActiveTab] = useState('escala');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [unitName, setUnitName] = useState('MANGABEIRAS');
  const [draftedEmployees, setDraftedEmployees] = useState([]);

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [warningMessage, setWarningMessage] = useState('Chegar com 20 minutos de antecedência para preparar o ambiente da academia.');
  const [showPhotos, setShowPhotos] = useState(true);
  const now = new Date();
  const initialMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [currentMonthId, setCurrentMonthId] = useState(initialMonth);
  const [globalModal, setGlobalModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'info', isAlert: false });

  const computedMonthName = new Date(currentMonthId + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
  const isPublicRoute = window.location.search.includes('public=true');

  useEffect(() => {
    const unsubEmployees = subscribeEmployees(setEmployees);
    const unsubSchedule = subscribeSchedule(isPublicRoute ? null : currentMonthId, setSchedule);
    const unsubSettings = subscribeSettings((data) => {
      setUnitName(data.unitName || 'MANGABEIRAS');
      setDraftedEmployees(data.draftedEmployees || []);
      setWarningMessage(data.warningMessage || 'Chegar com 20 minutos de antecedência para preparar o ambiente da academia.');
      setShowPhotos(data.showPhotos !== false);
      setIsLoading(false);
    });

    return () => { unsubEmployees(); unsubSchedule(); unsubSettings(); };
  }, [currentMonthId, isPublicRoute]);

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

  if (isPublicRoute) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', paddingBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', gap: '10px' }}>
            <img src={logoPratique} alt="Pratique" style={{ height: '40px' }} />
            <div style={{ fontWeight: 900, color: '#e50914', letterSpacing: '1px' }}>{unitName}</div>
          </div>
          <EscaladoPage schedule={schedule} employees={employees} isPublic={true} showPhotos={showPhotos} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Toaster position="top-right" />

      <AppShell>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unitName={unitName} open={sidebarOpen} setOpen={setSidebarOpen} />

        <Main $open={sidebarOpen}>
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

          {activeTab === 'escalado' && (
            <EscaladoPage schedule={schedule} monthName={computedMonthName} employees={employees} currentMonthId={currentMonthId} showPhotos={showPhotos} />
          )}

          {activeTab === 'equipe' && (
            <EquipePage employees={employees} />
          )}

          {activeTab === 'sorteio' && (
            <SorteioPage employees={employees} draftedEmployees={draftedEmployees} setGlobalModal={setGlobalModal} />
          )}

          {activeTab === 'ajustes' && (
            <ConfigPage
              unitName={unitName}
              setUnitName={setUnitName}
              warningMessage={warningMessage}
              setWarningMessage={setWarningMessage}
              showPhotos={showPhotos}
              setShowPhotos={setShowPhotos}
              schedule={schedule}
              setGlobalModal={setGlobalModal}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              setIsMonthModalOpen={setIsMonthModalOpen}
            />
          )}
        </Main>
      </AppShell>

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
                              id: Date.now() + totalRows,
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
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '860px',
              background: '#1a1a1a',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
            }}
          >
            {/* Topo escuro */}
            <div style={{ padding: '1.2rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e50914' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ color: '#888', fontSize: '0.82rem', marginLeft: '8px', fontWeight: 600 }}>
                  Pré-visualização — Escala de {computedMonthName}
                </span>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FaXmark />
              </button>
            </div>

            {/* Área de scroll com papel */}
            <div style={{ overflowY: 'auto', background: '#2a2a2a', padding: '2rem', flex: 1 }}>
              {/* Folha A4 simulada — layout idêntico ao PDF */}
              <div id="print-area" style={{
                background: '#fff',
                borderRadius: '6px',
                padding: '40px 44px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                fontFamily: "'Inter', sans-serif",
                width: '100%',
                position: 'relative',
              }}>
                {/* Marca d'água */}
                <span style={{ position: 'absolute', top: 20, left: 20, fontSize: '9px', fontWeight: 900, color: '#e50914', opacity: 0.15, letterSpacing: '1px', textTransform: 'uppercase' }}>PRATIQUE FITNESS</span>

                {/* Logo + Unidade centralizados */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '6px' }}>
                  <img src={logoPratique} alt="Pratique" style={{ height: '70px', objectFit: 'contain' }} />
                  <span style={{ color: '#e50914', fontWeight: 900, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{unitName}</span>
                </div>

                {/* Título */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#1a1a1a' }}>
                    ESCALA DE FINAL DE SEMANA {computedMonthName ? `DO MÊS DE ${computedMonthName}` : ''}
                  </span>
                </div>

                {/* Tabela */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                  <thead>
                    <tr>
                      {[
                        { label: 'DIA',               w: '14%' },
                        { label: 'MUSCULAÇÃO\n(LOW)',  w: '22%' },
                        { label: 'MUSCULAÇÃO\nPRIME',  w: '22%' },
                        { label: 'TROCA LOW',          w: '21%' },
                        { label: 'TROCA PRIME',        w: '21%' },
                      ].map((h, i) => (
                        <th key={i} style={{
                          background: '#e50914',
                          color: '#fff',
                          padding: '10px 6px',
                          fontWeight: 900,
                          fontSize: '0.72rem',
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          border: '2px solid #000',
                          width: h.w,
                          whiteSpace: 'pre-line',
                          lineHeight: 1.3,
                        }}>{h.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(row => (
                      <tr key={row.id} style={{ background: row.highlight ? '#fff1f1' : '#fff' }}>
                        <td style={{ border: '1px solid #000', padding: '8px 6px', fontWeight: 900, textAlign: 'center', fontSize: '0.82rem', lineHeight: 1.4, color: '#000' }}>
                          {row.date}<br />
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 900 }}>{row.day}</span>
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px 6px', fontSize: '0.8rem', textAlign: 'center', whiteSpace: 'pre-wrap', fontWeight: 700, color: '#000' }}>{row.low}</td>
                        <td style={{ border: '1px solid #000', padding: '8px 6px', fontSize: '0.8rem', textAlign: 'center', whiteSpace: 'pre-wrap', fontWeight: 700, color: '#000' }}>{row.prime}</td>
                        <td style={{ border: '1px solid #000', padding: '8px 6px', fontSize: '0.78rem', textAlign: 'center', whiteSpace: 'pre-wrap', color: '#000' }}>{row.trocaLow}</td>
                        <td style={{ border: '1px solid #000', padding: '8px 6px', fontSize: '0.78rem', textAlign: 'center', whiteSpace: 'pre-wrap', color: '#000' }}>{row.trocaPrime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Aviso */}
                {warningMessage && (
                  <div style={{ marginTop: '20px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <FaCircleInfo style={{ fontSize: '1.1rem', color: '#e50914', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#000', lineHeight: 1.5 }}>{warningMessage}</span>
                  </div>
                )}

                {/* Rodapé */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 900, color: '#e50914', fontSize: '1rem', letterSpacing: '1px' }}>BOM TRABALHO EQUIPE! 💪🏿</span>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ padding: '1.2rem 1.8rem', display: 'flex', gap: '0.8rem', borderTop: '1px solid #333', background: '#1a1a1a' }}>
              <button
                onClick={async () => {
                  try {
                    const element = document.getElementById('print-area');
                    if (!element) return;

                    // Captura o print-area exatamente como aparece na tela
                    const canvas = await html2canvas(element, {
                      useCORS: true,
                      allowTaint: true,
                      scale: 3,
                      backgroundColor: '#ffffff',
                      logging: false,
                    });

                    const imgData = canvas.toDataURL('image/png');

                    // Abre uma nova janela só com a imagem da folha e dispara impressão
                    const win = window.open('', '_blank');
                    win.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Escala - ${unitName}</title>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            html, body { width: 100%; height: 100%; background: #fff; }
                            @page { size: A4 portrait; margin: 0; }
                            @media print {
                              body { margin: 0; }
                              img { width: 100%; height: auto; display: block; page-break-inside: avoid; }
                            }
                            img { width: 100%; height: auto; display: block; }
                          </style>
                        </head>
                        <body>
                          <img src="${imgData}" />
                          <script>
                            window.onload = function() {
                              window.focus();
                              window.print();
                            };
                          </script>
                        </body>
                      </html>
                    `);
                    win.document.close();
                  } catch (e) {
                    toast.error('Erro ao gerar impressão');
                  }
                }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem', borderRadius: '10px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                <FaPrint /> Imprimir
              </button>
              <button
                onClick={async () => {
                  const element = document.getElementById('export-a4-area');
                  if (element) {
                    element.style.visibility = 'visible';
                    await new Promise(r => setTimeout(r, 100));
                    const canvas = await html2canvas(element, { useCORS: true, allowTaint: true, scale: 2 });
                    element.style.visibility = 'hidden';
                    const link = document.createElement('a');
                    link.download = `Escala-${unitName}-A4.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem', borderRadius: '10px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                <FaImage /> Baixar Imagem
              </button>
              <button
                onClick={() => {
                  try {
                    // Agrupa os dias em pares (sábado + domingo)
                    const pairs = [];
                    for (let i = 0; i < schedule.length; i += 2) {
                      pairs.push(schedule.slice(i, i + 2));
                    }

                    // Encontra o par mais próximo ou futuro
                    const [yearStr, monthStr] = currentMonthId.split('-');
                    const today = new Date();
                    today.setHours(0,0,0,0);

                    let closestPair = pairs[0];
                    for (const group of pairs) {
                      const lastRow = group[group.length - 1]; // Domingo
                      if (lastRow) {
                        const [dayStr] = lastRow.date.split('/');
                        const rowDate = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
                        if (rowDate >= today) {
                          closestPair = group;
                          break;
                        }
                      }
                    }

                    // Se por acaso estamos no fim do mês e já passaram todos, mantém o último
                    if (!closestPair) {
                      closestPair = pairs[pairs.length - 1];
                    }

                    let text = '';
                    if (closestPair && closestPair[0]) {
                      const [rowA, rowB] = closestPair;

                      // Datas do período (e.g. 19/09-20/09)
                      const periodo = rowB
                        ? `${rowA.date}-${rowB.date}`
                        : rowA.date;

                      const dayLabelA = rowA.day.toUpperCase() === 'SÁBADO' ? 'SABÁDO' : rowA.day.toUpperCase();
                      const dayLabelB = rowB ? (rowB.day.toUpperCase() === 'DOMINGO' ? 'DOMINGO' : rowB.day.toUpperCase()) : '';

                      const titleDays = rowB ? `${dayLabelA} E ${dayLabelB}` : dayLabelA;

                      text += `🚨 *Escala de ${titleDays} (${periodo})*\n🌟\n\n`;

                      const formatNames = (namesRaw, prefix = '') => {
                        if (!namesRaw) return '';
                        const names = namesRaw.split('\n').filter(n => n.trim() !== '');
                        return names.map((n, idx) => {
                          if (idx === 0) return `${prefix}@${n.trim()}`;
                          return `@${n.trim()}`;
                        }).join('\n');
                      };

                      // --- Sábado (ou primeiro dia) ---
                      if (rowA) {
                        const dayNameA = rowA.day.charAt(0).toUpperCase() + rowA.day.slice(1).toLowerCase();
                        
                        if (rowA.prime) {
                          text += `🏋️‍♂️ Musculação 🏋️‍♂️\n🌟 PRIME 🌟\n${dayNameA}\n`;
                          text += formatNames(rowA.prime, '07:45 ');
                          text += `\n\n`;
                        }

                        if (rowA.low) {
                          text += `🏋️‍♂️ Musculação LOW 🏋️‍♂️\nMUSCULAÇÃO COMUM\n* *${dayNameA}**\n`;
                          text += formatNames(rowA.low, '*07:45 ');
                          text += `\n\n`;
                        }
                      }

                      // --- Domingo (ou segundo dia) ---
                      if (rowB) {
                        const dayNameB = rowB.day.charAt(0).toUpperCase() + rowB.day.slice(1).toLowerCase();
                        
                        if (rowB.prime) {
                          text += `🏋️‍♂️ Musculação 🏋️‍♂️\n🌟 PRIME 🌟\n${dayNameB} *\n`;
                          text += formatNames(rowB.prime, '08:45 ');
                          text += `\n\n`;
                        }

                        if (rowB.low) {
                          text += `🏋️‍♂️ Musculação LOW 🏋️‍♂️\nMUSCULAÇÃO COMUM\n* *${dayNameB}**\n`;
                          text += formatNames(rowB.low, '08:45');
                          text += `\n\n`;
                        }
                      }

                      // Trocas (opcional)
                      if (rowA.trocaPrime || rowA.trocaLow || (rowB && (rowB.trocaPrime || rowB.trocaLow))) {
                        text += `🔄 *Trocas:*\n`;
                        [rowA, rowB].filter(Boolean).forEach(row => {
                          if (row.trocaPrime) text += `⭐ PRIME ${row.day}: @${row.trocaPrime}\n`;
                          if (row.trocaLow)   text += `💪 LOW ${row.day}: @${row.trocaLow}\n`;
                        });
                        text += `\n\n`;
                      }
                    }

                    text += `🚨 *CHEGAR 15 MINUTOS ANTES PARA ORGANIZAR O SEU SETOR.*\n`;

                    navigator.clipboard.writeText(text);
                    toast.success('Texto copiado para o WhatsApp! 🎉', { icon: '📋' });
                  } catch (e) {
                    toast.error('Erro ao copiar texto');
                  }
                }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem', borderRadius: '10px', border: 'none', background: '#25D366', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                <FaWhatsapp style={{ fontSize: '1.1rem' }} /> WhatsApp
              </button>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                style={{ padding: '0.85rem 1.4rem', borderRadius: '10px', border: '1px solid #444', background: 'transparent', color: '#888', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}


      {/* ÁREA OCULTA PARA EXPORTAÇÃO A4 */}
      <div id="export-a4-area" style={{ visibility: 'hidden', position: 'fixed', top: 0, left: '-5000px', width: '1240px', height: '1754px', background: '#fff', zIndex: -1001, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px', fontFamily: "'Inter', sans-serif", color: '#000' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <img src={logoPratique} alt="Logo" style={{ height: '80px' }} />
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ color: '#e50914', fontWeight: 900, margin: 0, fontSize: '32px' }}>{unitName}</h2>
            <p style={{ margin: 0, fontWeight: 900, fontSize: '18px' }}>ESCALA DE FINAL DE SEMANA</p>
          </div>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, textAlign: 'center', marginBottom: '40px', textTransform: 'uppercase' }}>MÊS DE {computedMonthName || '...'}</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '3px solid #000' }}>
          <thead>
            <tr>
              {['DIA', 'MUSCULAÇÃO (LOW)', 'MUSCULAÇÃO PRIME', 'TROCA LOW', 'TROCA PRIME'].map(h => (
                <th key={h} style={{ border: '2px solid #000', padding: '15px', background: '#e50914', color: 'white', fontWeight: 900, fontSize: '20px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map(row => (
              <tr key={row.id}>
                <td style={{ border: '2px solid #000', padding: '15px', fontWeight: 900, textAlign: 'center', background: '#fff1f1', fontSize: '18px' }}>{row.date}<br />{row.day}</td>
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
        <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
          <p style={{ fontWeight: 900, color: '#e50914', fontSize: '24px', letterSpacing: '1px' }}>BOM TRABALHO EQUIPE! 💪🏿</p>
        </div>
        <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontWeight: 900, color: '#e50914', fontSize: '20px', letterSpacing: '2px' }}>PRATIQUE FITNESS - A MAIOR REDE DE MINAS</p>
        </div>
      </div>

      {globalModal.isOpen && (
        <CustomModal {...globalModal} onCancel={() => setGlobalModal({ ...globalModal, isOpen: false })} />
      )}

    </ThemeProvider>
  );
}
