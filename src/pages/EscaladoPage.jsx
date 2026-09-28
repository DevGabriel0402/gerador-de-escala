import React from 'react';
import styled from 'styled-components';
import { FaCalendarCheck, FaDumbbell, FaStar, FaArrowRightArrowLeft, FaLink } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import logoPratique from '../assets/Menor-PRATIQUE.png';

const PageTitle = styled.div`
  margin-bottom: 1.5rem;
  h2 { font-size: 1.6rem; font-weight: 900; color: #1a1a1a; }
  p { color: #888; font-size: 0.9rem; margin-top: 4px; }
`;

const MonthLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e50914;
  color: #fff;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.4rem;

  > * {
    flex: 1;
    min-width: 320px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    flex-wrap: nowrap;
    
    > * {
      min-width: 100%;
    }
  }
`;

const DayCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 6px;
    background: ${p => p.$highlight ? 'linear-gradient(90deg, #e50914, #ff4b4b)' : 'linear-gradient(90deg, #1a2a3a, #3a4a5a)'};
  }
`;

const DayHeader = styled.div`
  background: transparent;
  color: #111;
  padding: 1.5rem 1.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .date { 
    font-size: 2.2rem; 
    font-weight: 900; 
    letter-spacing: -1.5px;
    line-height: 1;
    color: ${p => p.$highlight ? '#e50914' : '#111'};
  }
  .dayname {
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: #a0a0a0;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  
  svg {
    font-size: 1.8rem;
    color: #f0f0f0;
  }
`;

const DayBody = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${p => p.$color || '#888'};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0,0,0,0.06);
  }
`;

const EmpCard = styled.div`
  flex: 1;
  min-width: 100px;
  max-width: 150px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  overflow: hidden;
`;

const EmpAvatar = styled.div`
  width: 100%;
  height: 120px;
  background: #fdfdfd;
  border-bottom: 4px solid ${p => p.$type === 'prime' ? '#1a2a3a' : '#e50914'};
  display: flex;
  align-items: center;
  justify-content: center;

  img.photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  img.placeholder {
    width: 70%;
    height: 70%;
    object-fit: contain;
    filter: ${p => p.$type === 'prime'
      ? 'brightness(0) saturate(100%) invert(11%) sepia(39%) saturate(1200%) hue-rotate(185deg) brightness(90%) contrast(95%)'
      : 'brightness(0) saturate(100%) invert(14%) sepia(88%) saturate(4000%) hue-rotate(349deg) brightness(95%) contrast(100%)'
    };
  }
`;

const EmpName = styled.div`
  padding: 10px 6px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 900;
  color: #111;
  text-transform: uppercase;
  white-space: pre-wrap;
  line-height: 1.2;
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px dashed #e5e5e5;
  min-height: 48px;
  color: #ccc;
  font-size: 0.78rem;
  font-style: italic;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #ccc;
  svg { font-size: 3rem; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto; }
  p { font-weight: 700; font-size: 0.95rem; }
  small { font-size: 0.8rem; color: #ddd; }
`;

const Divider = styled.div`
  display: none;
`;

// Busca o funcionário pelo nome (case-insensitive) e retorna foto + role
function findEmployee(employees, name) {
  if (!name) return null;
  const normalized = name.trim().toUpperCase();
  // name pode ter múltiplos nomes separados por \n
  const firstName = normalized.split('\n')[0].trim();
  return employees.find(e => e.name.toUpperCase() === firstName) || null;
}

// Renderiza um ou mais nomes, cada um com avatar
function EmpCell({ nameStr, employees, type }) {
  if (!nameStr || !nameStr.trim()) {
    return <EmptySlot>—</EmptySlot>;
  }
  const names = nameStr.split('\n').map(n => n.trim()).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {names.map((name, i) => {
        const emp = findEmployee(employees, name);
        const role = emp?.role || type;
        return (
          <EmpCard key={i}>
            <EmpAvatar $type={role}>
              {emp?.photo
                ? <img className="photo" src={emp.photo} alt={name} />
                : <img className="placeholder" src={logoPratique} alt="Pratique" />
              }
            </EmpAvatar>
            <EmpName>{name}</EmpName>
          </EmpCard>
        );
      })}
    </div>
  );
}

export const EscaladoPage = ({ schedule, monthName, employees = [], currentMonthId, isPublic = false }) => {
  let displaySchedule = [];

  if (isPublic) {
    // Modo Público: Mostra os dias escalados pros próximos 7 dias
    const today = new Date();
    today.setHours(0,0,0,0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    displaySchedule = schedule.filter(row => {
      if (!row.monthId) return false;
      const [yearStr, monthStr] = row.monthId.split('-');
      const [dayStr] = row.date.split('/');
      const rowDate = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
      
      // Inclui se a data for de hoje até 7 dias pra frente
      return rowDate >= today && rowDate <= nextWeek;
    });

    // Ordenar a exibição apenas para garantir que dias de meses diferentes fiquem na ordem correta cronologicamente
    displaySchedule.sort((a, b) => {
      const dateA = new Date(Number(a.monthId.split('-')[0]), Number(a.monthId.split('-')[1]) - 1, Number(a.date.split('/')[0]));
      const dateB = new Date(Number(b.monthId.split('-')[0]), Number(b.monthId.split('-')[1]) - 1, Number(b.date.split('/')[0]));
      return dateA - dateB;
    });

  } else {
    // Modo Admin: Mostra o mês todo
    displaySchedule = schedule;
  }

  // Mantém os rows preenchidos
  const filled = displaySchedule.filter(r => r.low || r.prime || r.trocaLow || r.trocaPrime);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <PageTitle style={{ marginBottom: 0 }}>
          <h2>{isPublic ? 'Escala dos Próximos 7 Dias' : 'Escalado do Mês'}</h2>
          <p>{isPublic ? 'Confira quem está escalado para os próximos dias' : 'Visualize quem está escalado por dia'}</p>
        </PageTitle>

        {!isPublic && (
          <button
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}?public=true`;
              navigator.clipboard.writeText(url);
              toast.success('Link público copiado! 🎉');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#e50914', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <FaLink /> Copiar Link Público
          </button>
        )}
      </div>

      {monthName && !isPublic && (
        <MonthLabel>
          <FaCalendarCheck /> {monthName}
        </MonthLabel>
      )}

      {filled.length === 0 ? (
        <EmptyState>
          <FaCalendarCheck />
          <p>Nenhum escalado ainda neste mês.</p>
          <small>Preencha a aba Escala para visualizar aqui.</small>
        </EmptyState>
      ) : (
        <Grid>
          {filled.map(row => (
            <DayCard key={row.id} $highlight={row.highlight}>
              <DayHeader $highlight={row.highlight}>
                <div>
                  <div className="date">{row.date}</div>
                  <div className="dayname">{row.day}</div>
                </div>
                <FaCalendarCheck style={{ fontSize: '1.3rem', opacity: 0.5 }} />
              </DayHeader>

              <DayBody>
                {/* LOW */}
                <div>
                  <SectionLabel $color="#e50914">
                    <FaDumbbell /> Musculação LOW
                  </SectionLabel>
                  <EmpCell nameStr={row.low} employees={employees} type="low" />
                </div>

                <Divider />

                {/* PRIME */}
                <div>
                  <SectionLabel $color="#1a2a3a">
                    <FaStar /> Musculação PRIME
                  </SectionLabel>
                  <EmpCell nameStr={row.prime} employees={employees} type="prime" />
                </div>

                <Divider />

                {/* TROCA LOW */}
                <div>
                  <SectionLabel $color="#e59014">
                    <FaArrowRightArrowLeft /> Troca LOW
                  </SectionLabel>
                  <EmpCell nameStr={row.trocaLow} employees={employees} type="low" />
                </div>

                <Divider />

                {/* TROCA PRIME */}
                <div>
                  <SectionLabel $color="#7c3aed">
                    <FaArrowRightArrowLeft /> Troca PRIME
                  </SectionLabel>
                  <EmpCell nameStr={row.trocaPrime} employees={employees} type="prime" />
                </div>
              </DayBody>
            </DayCard>
          ))}
        </Grid>
      )}
    </div>
  );
};
