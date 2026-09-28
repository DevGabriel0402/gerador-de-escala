import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import LogoPratique from '../assets/Menor-PRATIQUE.png';

const styles = StyleSheet.create({
  page: {
    padding: '30 36',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },

  // Marca d'água
  watermark: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#e50914',
    opacity: 0.15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Header centralizado (logo + unidade)
  header: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  logo: { width: 110 },
  unit: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#e50914',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // Título
  titleContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Tabela
  table: {
    display: 'flex',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
  },

  // Linha cabeçalho
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#e50914',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },

  // Linha normal
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    backgroundColor: '#ffffff',
  },

  // Linha sábado (highlight)
  tableRowHighlight: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    backgroundColor: '#fff1f1',
  },

  // Célula cabeçalho
  colHeader: {
    width: '20%',
    padding: '6 4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  colHeaderLast: {
    width: '20%',
    padding: '6 4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // Célula data (primeira coluna)
  colDate: {
    width: '20%',
    padding: '6 4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  dateText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  dayText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 2,
  },

  // Células de dados
  col: {
    width: '20%',
    padding: '6 4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  colLast: {
    width: '20%',
    padding: '6 4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 8,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'normal',
  },

  // Aviso
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    gap: 6,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e50914',
    marginTop: 2,
  },
  warningText: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
    flex: 1,
  },

  // Rodapé
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#e50914',
  },
});

export const EscalaPDF = ({ schedule, unitName, warningMessage, monthName }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Marca d'água */}
      <Text style={styles.watermark}>PRATIQUE FITNESS</Text>

      {/* Header: logo + unidade */}
      <View style={styles.header}>
        <Image src={LogoPratique} style={styles.logo} />
        <Text style={styles.unit}>{unitName}</Text>
      </View>

      {/* Título */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          ESCALA DE FINAL DE SEMANA{monthName ? ` DO MÊS DE ${monthName}` : ''}
        </Text>
      </View>

      {/* Tabela */}
      <View style={styles.table}>

        {/* Cabeçalho */}
        <View style={styles.tableRowHeader}>
          <View style={styles.colHeader}>
            <Text style={styles.headerText}>DIA</Text>
          </View>
          <View style={styles.colHeader}>
            <Text style={styles.headerText}>{'MUSCULAÇÃO\n(LOW)'}</Text>
          </View>
          <View style={styles.colHeader}>
            <Text style={styles.headerText}>{'MUSCULAÇÃO\nPRIME'}</Text>
          </View>
          <View style={styles.colHeader}>
            <Text style={styles.headerText}>TROCA LOW</Text>
          </View>
          <View style={styles.colHeaderLast}>
            <Text style={styles.headerText}>TROCA PRIME</Text>
          </View>
        </View>

        {/* Linhas de dados */}
        {schedule.map((row) => (
          <View
            key={row.id}
            style={row.highlight ? styles.tableRowHighlight : styles.tableRow}
          >
            <View style={styles.colDate}>
              <Text style={styles.dateText}>{row.date}</Text>
              <Text style={styles.dayText}>{row.day}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.cellText}>{row.low}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.cellText}>{row.prime}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.cellText}>{row.trocaLow}</Text>
            </View>
            <View style={styles.colLast}>
              <Text style={styles.cellText}>{row.trocaPrime}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Aviso */}
      {warningMessage && (
        <View style={styles.warningRow}>
          <View style={styles.warningDot} />
          <Text style={styles.warningText}>{warningMessage}</Text>
        </View>
      )}

      {/* Rodapé */}
      <Text style={styles.footer}>BOM TRABALHO EQUIPE! 💪🏿</Text>

    </Page>
  </Document>
);
