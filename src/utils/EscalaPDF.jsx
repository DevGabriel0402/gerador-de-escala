import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import LogoPratique from '../assets/Menor-PRATIQUE.png';



const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#fff' },
  header: { alignItems: 'center', marginBottom: 20 },
  logoContainer: {
    backgroundColor: '#fff',
    padding: '10 20',
    borderRadius: 10,
    alignItems: 'center',
    gap: 5,
    marginBottom: 15
  },
  logo: { width: 100 },
  unit: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2, color: '#e50914', textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#e50914', textTransform: 'uppercase' },
  watermark: { position: 'absolute', top: 30, left: 30, fontSize: 8, fontWeight: 'bold', color: '#e50914', opacity: 0.2 },

  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 2, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableRowHighlight: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', backgroundColor: '#fff1f1' },
  tableHeader: { borderBottomWidth: 2, borderColor: '#000', backgroundColor: '#e50914' },


  tableColHeader: { width: '20%', borderRightWidth: 2, borderColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  tableCol: { width: '20%', borderRightWidth: 1, borderColor: '#000', padding: 5, justifyContent: 'center', alignItems: 'center' },
  lastCol: { borderRightWidth: 0 },

  headerText: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', color: 'white' },

  cellText: { fontSize: 8, fontWeight: 'normal', textAlign: 'center' },
  dayText: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { fontSize: 8, fontWeight: 'bold' },
  warningContainer: { marginTop: 20, padding: 10, border: 1, borderColor: '#000', borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 10 },
  warningText: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' }
});


export const EscalaPDF = ({ schedule, unitName, warningMessage, monthName }) => (

  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>PRATIQUE FITNESS</Text>

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src={LogoPratique} style={styles.logo} />
          <Text style={styles.unit}>{unitName}</Text>
        </View>
        <Text style={styles.title}>Escala de Final de Semana {monthName && `- ${monthName}`}</Text>
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

      {warningMessage && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>{warningMessage}</Text>
        </View>
      )}

      <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 10, fontWeight: 'bold', color: '#e50914' }}>
        BOM TRABALHO EQUIPE! 💪
      </Text>
    </Page>
  </Document>
);

