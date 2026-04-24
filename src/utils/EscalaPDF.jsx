import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Fontes para o PDF
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyAZ9hiA.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFu6AZ9hiA.woff2', fontWeight: 900 },
  ]
});

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#fff', fontFamily: 'Inter' },
  header: { alignItems: 'center', marginBottom: 20 },
  logoContainer: { 
    backgroundColor: '#e50914', 
    padding: '10 20', 
    borderRadius: 10, 
    alignItems: 'center', 
    gap: 5,
    marginBottom: 15
  },
  logo: { width: 80 },
  unit: { fontSize: 8, fontWeight: 900, letterSpacing: 2, color: '#fff', textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 900, color: '#000', textTransform: 'uppercase' },
  watermark: { position: 'absolute', top: 30, left: 30, fontSize: 8, fontWeight: 900, color: '#e50914', opacity: 0.2 },
  
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 2, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableRowHighlight: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', backgroundColor: '#c0c0c0' },
  tableHeader: { borderBottomWidth: 2, borderColor: '#000' },
  
  tableColHeader: { width: '20%', borderRightWidth: 2, borderColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  tableCol: { width: '20%', borderRightWidth: 1, borderColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  lastCol: { borderRightWidth: 0 },
  
  headerText: { fontSize: 7, fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' },
  cellText: { fontSize: 8, fontWeight: 700, textAlign: 'center' },
  dayText: { fontSize: 7, fontWeight: 700, textTransform: 'uppercase' },
  dateText: { fontSize: 8, fontWeight: 700 }
});

export const EscalaPDF = ({ schedule, unitName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>PRATIQUE FITNESS</Text>
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src="https://pratiquefitness.com.br/wp-content/uploads/2025/10/pratique-logo-academia.webp" style={styles.logo} />
          <Text style={styles.unit}>{unitName}</Text>
        </View>
        <Text style={styles.title}>Escala de Final de Semana</Text>
      </View>

      <View style={styles.table}>
        {/* HEADER */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>DIA</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>MUSCULAÇÃO{"\n"}(LOW)</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>MUSCULAÇÃO{"\n"}PRIME</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>TROCA LOW</Text></View>
          <View style={[styles.tableColHeader, styles.lastCol]}><Text style={styles.headerText}>TROCA PRIME</Text></View>
        </View>

        {/* ROWS */}
        {schedule.map((row) => (
          <View key={row.id} style={row.highlight ? styles.tableRowHighlight : styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.dateText}>{row.date}</Text>
              <Text style={styles.dayText}>{row.day}</Text>
            </View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row.low}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row.prime}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row.trocaLow}</Text></View>
            <View style={[styles.tableCol, styles.lastCol]}><Text style={styles.cellText}>{row.trocaPrime}</Text></View>
          </View>
        ))}
      </View>
      
      <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#e50914' }}>
        BOM TRABALHO EQUIPE! 💪
      </Text>
    </Page>
  </Document>
);
