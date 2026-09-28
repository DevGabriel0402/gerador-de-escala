import React from 'react';
import styled from 'styled-components';
import { FaCalendarCheck, FaDumbbell, FaStar, FaArrowRightArrowLeft } from 'react-icons/fa6';
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.4rem;
`;

const DayCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid ${p => p.$highlight ? '#e50914' : '#f0f0f0'};
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 8px 28px rgba(229,9,20,0.12);
    transform: translateY(-2px);
  }
`;

const DayHeader = styled.div`
  background: ${p => p.$highlight ? '#e50914' : '#1a2a3a'};
  color: #fff;
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .date { font-size: 1.15rem; font-weight: 900; }
  .dayname {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    opacity: 0.8;
    text-transform: uppercase;
    margin-top: 2px;
  }
`;

const DayBody = styled.div`
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const SectionLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${p => p.$color || '#888'};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

const EmpRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  min-height: 38px;
`;

const EmpAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #fff;
  border: 2px solid ${p => p.$type === 'prime' ? '#1a2a3a' : '#e50914'};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img.photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const EmpName = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  white-space: pre-wrap;
  line-height: 1.3;
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #e5e5e5;
  min-height: 38px;
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
  height: 1px;
  background: #f0f0f0;
  margin: 2px 0;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {names.map((name, i) => {
        const emp = findEmployee(employees, name);
        const role = emp?.role || type;
        return (
          <EmpRow key={i}>
            <EmpAvatar $type={role}>
              {emp?.photo
                ? <img className="photo" src={emp.photo} alt={name} />
                : <img className="placeholder" src={logoPratique} alt="Pratique" />
              }
            </EmpAvatar>
            <EmpName>{name}</EmpName>
          </EmpRow>
        );
      })}
    </div>
  );
}

export const EscaladoPage = ({ schedule, monthName, employees = [] }) => {
  const filled = schedule.filter(r => r.low || r.prime || r.trocaLow || r.trocaPrime);

  return (
    <div>
      <PageTitle>
        <h2>Escalado do Final de Semana</h2>
        <p>Visualize quem está escalado por dia</p>
      </PageTitle>

      {monthName && (
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
