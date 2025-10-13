// src/utils/exportPdf.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Helpers replicated from components for standalone usage
function normalizeDocTypes(docArt) {
  if (!docArt) return [];
  try {
    if (Array.isArray(docArt)) {
      return docArt
        .map(item => {
          if (typeof item === 'string') return item.trim().toUpperCase();
          if (item && typeof item === 'object') {
            const strValue = Object.values(item).find(v => typeof v === 'string');
            return strValue ? strValue.trim().toUpperCase() : null;
          }
          return String(item).trim().toUpperCase();
        })
        .filter(Boolean);
    }
    if (typeof docArt === 'string') {
      return docArt.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    }
    return [String(docArt).trim().toUpperCase()].filter(Boolean);
  } catch (e) {
    console.error('normalizeDocTypes error', e);
    return [];
  }
}

function getSafeZustellungsweg(insurer) {
  const z = insurer?.zustellungsweg || insurer?.zustellweg || insurer?.bezugsweg;
  if (!z) return '';
  if (typeof z === 'string') return z;
  if (Array.isArray(z)) {
    const first = z[0];
    if (typeof first === 'object' && first) return first.value || first.label || first.name || '';
    return first || '';
  }
  if (typeof z === 'object') return z.value || z.label || z.name || '';
  return String(z);
}

function isFieldEmpty(field) {
  return field === undefined || field === null || field === '' || 
         (Array.isArray(field) && field.length === 0) ||
         (typeof field === 'object' && Object.keys(field).length === 0);
}

function isInsurerIncomplete(insurer) {
  return !insurer || 
         !insurer.name || 
         !insurer.zahlungsweise || 
         !insurer.zahlungsziel || 
         !insurer.turnus;
}

function formatTurnus(turnus) {
  if (!turnus) return '';
  return String(turnus).charAt(0).toUpperCase() + String(turnus).slice(1).toLowerCase();
}

function formatLastInvoiceValue(last_invoice) {
  if (!last_invoice) return 'Keine Daten';
  try {
    if (typeof last_invoice === 'string') {
      return last_invoice;
    }
    if (last_invoice.display) {
      return last_invoice.display;
    }
    if (last_invoice.datum) {
      return last_invoice.datum;
    }
    return JSON.stringify(last_invoice);
  } catch (e) {
    console.error('Error formatting last invoice', e, last_invoice);
    return 'Fehler beim Formatieren';
  }
}

function groupBy(insurers, mode) {
  const groups = {};
  
  insurers.forEach(insurer => {
    let key;
    
    switch(mode) {
      case 'zustellungsweg':
        key = getSafeZustellungsweg(insurer) || 'Nicht angegeben';
        break;
      case 'turnus':
        key = formatTurnus(insurer.turnus) || 'Nicht angegeben';
        break;
      case 'status':
        key = insurer.letzteRechnungStatus || 'Unbekannt';
        break;
      default:
        key = 'Andere';
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(insurer);
  });
  
  return groups;
}

function buildInsurerRows(insurers) {
  return insurers.map(insurer => ({
    name: insurer.name || 'Unbekannt',
    zustellungsweg: getSafeZustellungsweg(insurer) || 'Nicht angegeben',
    turnus: formatTurnus(insurer.turnus) || 'Nicht angegeben',
    dokumentenart: formatDocumentTypes(insurer.dokumentenart),
    letzteRechnung: formatLastInvoiceValue(insurer.letzteRechnung),
    status: insurer.letzteRechnungStatus || 'Unbekannt'
  }));
}

function exportInsurerPdf(insurer) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(`Versicherer: ${insurer.name || 'Unbekannt'}`, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Zustellungsweg: ${getSafeZustellungsweg(insurer)}`, 14, 40);
  doc.text(`Turnus: ${formatTurnus(insurer.turnus)}`, 14, 50);
  
  const docs = normalizeDocTypes(insurer.dokumentenart);
  doc.text(`Dokumentenarten: ${docs.join(', ') || 'Keine'}`, 14, 60);
  
  doc.save(`${insurer.name || 'versicherer'}_details.pdf`);
}

// Hilfsfunktion zur Formatierung der Dokumententypen
function formatDocumentTypes(docTypes) {
  if (!docTypes) return 'Keine';
  try {
    const types = normalizeDocTypes(docTypes);
    return types.join(', ');
  } catch (e) {
    console.error('Fehler beim Formatieren der Dokumententypen:', e);
    return 'Fehler';
  }
}

// Hilfsfunktion für Sortier-Label
function getSortLabel(sortBy) {
  const labels = {
    'name': 'Name (A-Z)',
    'turnus': 'Turnus',
    'zustellungsweg': 'Zustellungsweg'
  };
  return labels[sortBy] || 'Name (A-Z)';
}

// Erstellt eine detaillierte Übersicht aller Versicherer
export function exportDetailedOverviewPdf(insurers, sortBy = 'name') {
  try {
    // PDF erstellen
    const doc = new jsPDF();
    const title = 'Versicherungsübersicht';
    const date = format(new Date(), 'dd.MM.yyyy');
    
    // Titel und Datum
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Erstellt am: ${date} | Sortiert nach: ${getSortLabel(sortBy)}`, 14, 28);
    
    // Versicherer nach ausgewähltem Kriterium sortieren
    let sortedInsurers = [...insurers];
    switch(sortBy) {
      case 'name':
        sortedInsurers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'turnus':
        sortedInsurers.sort((a, b) => (a.turnus || '').localeCompare(b.turnus || '') || 
                                     (a.name || '').localeCompare(b.name || ''));
        break;
      case 'zustellungsweg':
        sortedInsurers.sort((a, b) => {
          const zustellwegA = getSafeZustellungsweg(a) || '';
          const zustellwegB = getSafeZustellungsweg(b) || '';
          return zustellwegA.localeCompare(zustellwegB) || 
                 (a.name || '').localeCompare(b.name || '');
        });
        break;
    }
    
    // Tabellenkopf
    const headers = [
      'Name',
      'Zustellungsweg',
      'Turnus',
      'Dokumentenarten',
      'Letzte Rechnung',
      'Status'
    ];
    
    // Tabelleninhalt
    const body = sortedInsurers.map(insurer => {
      const docs = normalizeDocTypes(insurer.dokumentenart);
      return [
        insurer.name || 'N/A',
        getSafeZustellungsweg(insurer) || 'N/A',
        formatTurnus(insurer.turnus) || 'N/A',
        docs.join(', ') || 'Keine',
        formatLastInvoiceValue(insurer.letzteRechnung) || 'N/A',
        insurer.letzteRechnungStatus || 'Unbekannt'
      ];
    });
    
    // Tabelle erstellen
    autoTable(doc, {
      startY: 35,
      head: [headers],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      },
      didDrawPage: function(data) {
        // Seitenzahl hinzufügen
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(
          'Seite ' + data.pageCount,
          14,
          pageHeight - 10
        );
      }
    });
    
    // PDF speichern
    doc.save(`Versicherungsuebersicht_${date}.pdf`);
    
  } catch (error) {
    console.error('Fehler beim Erstellen der PDF:', error);
    throw new Error('Beim Erstellen der PDF ist ein Fehler aufgetreten: ' + error.message);
  }
}

// Exportiert Versicherer nach Gruppen
export function exportGroupedPdf(insurers, mode) {
  const groups = groupBy(insurers, mode);
  const doc = new jsPDF();
  
  let yPos = 20;
  
  Object.entries(groups).forEach(([groupName, groupInsurers], index) => {
    if (index > 0) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${groupName}`, 14, yPos);
    yPos += 10;
    
    const rows = buildInsurerRows(groupInsurers);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Name', 'Zustellungsweg', 'Turnus', 'Dokumentenart', 'Letzte Rechnung', 'Status']],
      body: rows.map(row => [
        row.name,
        row.zustellungsweg,
        row.turnus,
        row.dokumentenart,
        row.letzteRechnung,
        row.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  });
  
  doc.save(`Versicherer_nach_${mode}.pdf`);
}
